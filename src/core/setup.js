
import { setupSocket } from './network/socket';
import { setupResponseReceiver } from './utils/requests';
import { setupDB } from './storage/setup';
import React, { useEffect } from 'react';
import { setupMemory } from './memory';

export let appLoaded,
    setAppLoaded,
    isAuthed,
    setIsAuthed,
    isDbLoaded = false,
    setIsDbLoaded = (dl) => {
        isDbLoaded = dl;
    },
    initCore = () => {
        setTimeout(async () => {
            if (!started) {
                started = true;
                setupDB();
                await setupMemory();
                setupSocket();
                setupResponseReceiver();
            }
        });
    },
    resetCore = () => {
        started = false;
        initCore();
    };

let started = false;

export function SetupCore() {
    [isAuthed, setIsAuthed] = React.useState(false);
    [appLoaded, setAppLoaded] = React.useState(false);
    useEffect(() => {
        initCore();
    }, []);
};
