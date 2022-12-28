
import io from 'socket.io-client';
import { publish } from '../bus/index';
import { authenticate, enterRoom, enterTower, enterWorkspace } from '../callables/auth';
import topics from '../events/topics.json';
import { setIsAuthed } from '../setup';
import { fetchCurrentRoomId, fetchCurrentWorkspaceId, fetchSessionToken, saveCurrentRoomId, saveCurrentWorkspaceId } from '../storage/auth';
import { fetchMyHomeId } from '../storage/me';
import { dbFindFirstRoomOfTower } from '../storage/spaces';
import { attachUpdateListeners } from './updates';
import { dbFetchUnsentMessages } from '../storage/messenger';
import { resendMessage } from '../callables/messenger';
import config from '../config.json';
import { workspacesDict } from '../memory';
import updates from '../network/updates.json';

export let socket;

let doUnfinishedJobs = () => {
    
}

let lastWorkspaceId;
export let setWorkspaceAfterEnteringRoom = (lwi) => {
    if (lwi) {
        lastWorkspaceId = lwi;
    }
};

export let setupSocket = () => {
    setTimeout(() => {
        socket = io(config.APIGATEWAY);
        attachUpdateListeners();
        socket.on('authenticated', async () => {
            const publicVapidKey = "BAMVDwd2-8WdAym5HkOVHJ6VqYCml4j-D0G66A32ZQYB68al_14P2Ndcen6tU9AKVSHzyWBGlzQQ3obN6vMLOuY";
            async function registerServiceWorker() {
                const register = await navigator.serviceWorker.register('worker.js', {
                    scope: '/'
                });
                const subscription = await register.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: publicVapidKey,
                });
                await fetch(config.APIGATEWAY + "/subscribe", {
                    method: "POST",
                    body: JSON.stringify(subscription),
                    headers: {
                        "Content-Type": "application/json",
                        "token": fetchSessionToken()
                    }
                })
            }
            await registerServiceWorker();
            setIsAuthed(true);
            publish(topics.AUTHENTICATED, {});
            let homeId = fetchMyHomeId();
            enterTower(homeId);
            doUnfinishedJobs();
            let lastRoomId = fetchCurrentRoomId();
            if (lastRoomId) {
                lastWorkspaceId = fetchCurrentWorkspaceId();
                enterRoom(lastRoomId);
            } else {
                dbFindFirstRoomOfTower(homeId).then(homeHall => {
                    enterRoom(homeHall.id);
                });
            }
        });
        socket.on('enteredRoom', ({ roomId, openWorkspace }) => {
            saveCurrentRoomId(roomId);
            publish(topics.ENTERED_ROOM, { roomId });
            if (lastWorkspaceId && workspacesDict[roomId]?.map(w => w.id).includes(lastWorkspaceId)) {
                enterWorkspace(lastWorkspaceId, openWorkspace);
            } else {
                let workspaces = workspacesDict[roomId];
                for (let i = 0; i < workspaces.length; i++) {
                    if (workspaces[i].title === 'main workspace') {
                        enterWorkspace(workspaces[i].id, openWorkspace);
                        break;
                    }
                }
            }
        });
        socket.on('enteredWorkspace', ({ workspaceId, openWorkspace }) => {
            saveCurrentWorkspaceId(workspaceId);
            publish(topics.ENTERED_WORKSPACE, { workspaceId, openWorkspace });
        });
        socket.on("connect", () => {
            authenticate();
            publish(updates.CONNECTED, {});
        });
        socket.on("disconnect", () => {
            publish(updates.DISCONNECTED, {});
        });
    });
};
