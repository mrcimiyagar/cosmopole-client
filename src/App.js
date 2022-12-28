
import React, { useEffect, useRef } from "react";
import Auth from "./sections/Auth";
import topics from './core/events/topics.json';
import { publish, subscribe, unsubscribe } from './core/bus';
import uiEvents from './config/ui-events.json';
import Chat, { checkEmojiBeingOpen } from "./sections/Chat";
import Explore from "./sections/Explore";
import UserProfile from "./sections/UserProfile";
import Workspace from "./sections/Workspace";
import Filespace from "./sections/Filespace";
import TowerProfile from "./sections/TowerProfile";
import Wallet from "./pending/Wallet";
import RoomProfile from "./pending/RoomProfile";
import People from "./pending/People";
import BotProfile from "./pending/BotProfile";
import Blog from "./sections/Blog";
import Media from "./sections/Media";
import Folders from "./sections/Folders";
import CreateTowerDlg from "./sections/CreateTowerDlg";
import CreateRoomDlg from "./sections/CreateRoomDlg";
import CreateWorkspaceDlg from "./sections/CreateWorkspaceDlg";
import CreateFilespaceDlg from "./sections/CreateFilespaceDlg";
import CreateBlogDlg from "./sections/CreateBlogDlg";
import CreatePostDlg from "./sections/CreatePostDlg";
import { authenticate } from "./core/callables/auth";
import Post from './sections/Post';
import Inviter from "./sections/Inviter";
import UserInvites from "./pending/UserInvites";
import { Button, Drawer, Fab, Paper, Popover, Zoom } from "@mui/material";
import useForceUpdate from "./utils/ForceUpdate";
import MediaPlayer from "./components/MediaPlayer";
import CreateDiskDlg from './sections/CreateDiskDlg'
import CreateFolderDlg from "./sections/CreateFolderDlg";
import CreateFileDlg from "./sections/CreateFileDlg";
import Home from "./sections/Home";
import CosmoToolbar from "./components/CosmoToolbar";
import Rooms from "./sections/Rooms";
import Room from "./sections/Room";
import toast, { Toaster } from 'react-hot-toast';
import { Close } from "@mui/icons-material";
import { yellow } from "@mui/material/colors";
import Draggable from 'react-draggable';
import CallPeopleDrawer from "./components/CallPeopleDrawer";
import CallNew from "./sections/Call";
import PostEditor from "./sections/PostEditor";
import VideoPlayer from "./sections/VideoPlayer";
import Think from "./sections/Think";
import PhotoViewer from "./sections/PhotoViewer";
import Forwarder from './sections/Forwarder';
import SpacePicker from './sections/SpacePicker';
import { colors } from "./config/colors";
import AudioPlugin from "./shell/AudioPlugin";
import Permissions from "./sections/Permissions";

const pageDictionary = {
  "Auth": Auth,
  "Home": Home,
  "Chat": Chat,
  "Explore": Explore,
  "UserProfile": UserProfile,
  "Workspace": Workspace,
  "Filespace": Filespace,
  "SpaceProfile": TowerProfile,
  "Wallet": Wallet,
  "RoomProfile": RoomProfile,
  "People": People,
  "BotProfile": BotProfile,
  "Blog": Blog,
  "PhotosGallery": Media,
  "Folders": Folders,
  "Bank": Wallet,
  "CreateTowerDlg": CreateTowerDlg,
  "CreateRoomDlg": CreateRoomDlg,
  "CreateWorkspaceDlg": CreateWorkspaceDlg,
  "CreateFilespaceDlg": CreateFilespaceDlg,
  "CreateBlogDlg": CreateBlogDlg,
  "CreatePostDlg": CreatePostDlg,
  "Post": Post,
  "Inviter": Inviter,
  "UserInvites": UserInvites,
  "CreateDiskDlg": CreateDiskDlg,
  "CreateFolderDlg": CreateFolderDlg,
  "CreateFileDlg": CreateFileDlg,
  "Rooms": Rooms,
  "Room": Room,
  "PostEditor": PostEditor,
  "Forwarder": Forwarder,
  "SpacePicker": SpacePicker,
  "TowerProfile": TowerProfile,
  "Permissions": Permissions
}

export const showToast = (text) => {
  toast(text);
};

export const closeToast = (toastId) => {
  toast.dismiss(toastId);
};

let callMeta = {
  transitionFlag: false,
  activateTransition: () => {
    callMeta.transitionFlag = true;
  }
};

export let historyKeys = [localStorage.getItem('token') === null ? 'Auth' : 'Home'];
let history = [pageDictionary[historyKeys[historyKeys.length - 1]]];
export let historyMeta = [{ key: Math.random(), transitionFlag: false, activateTransition: () => { historyMeta[0].transitionFlag = true; } }];
export let isGettingBack = false;

export let getBackToAuth = () => {
  historyKeys = [localStorage.getItem('token') === null ? 'Auth' : 'Home'];
  history = [pageDictionary[historyKeys[historyKeys.length - 1]]];
  historyMeta = [{ key: Math.random(), transitionFlag: false, activateTransition: () => { historyMeta[0].transitionFlag = true; } }];
  forceUpdate();
}

let authenticationCallback;
export let setAuthenticationCallback = (ac) => {
  authenticationCallback = ac;
};
let floatingVideos = {};
let floatingVideosMeta = {};

let FloatingVideo = ({ tag }) => {
  const closerRef = useRef(null);
  useEffect(() => {
    document.getElementById('floating_video_' + tag).srcObject = floatingVideos[tag];
  }, []);
  return (
    <Draggable onDrag={(e, dd) => {
      if (closerRef.current !== null) {
        closerRef.current.style.left = (dd.x + (floatingVideosMeta[tag].type === 'video' ? 150 : 265) + 75 + 'px');
        closerRef.current.style.top = (dd.y + 75 + 'px');
      } else {
        closerRef.current = document.getElementById('floating_video_closer_' + tag);
        if (closerRef.current !== null) {
          closerRef.current.style.left = (dd.x + (floatingVideosMeta[tag].type === 'video' ? 150 : 265) + 75 + 'px');
          closerRef.current.style.top = (dd.y + 75 + 'px');
        }
      }
    }}>
      <Paper id={'floating_video_wrapper_' + tag} elevation={8} style={{
        background: 'transparent', width: floatingVideosMeta[tag].type === 'video' ? 150 : 265,
        height: 150, zIndex: 99999, position: 'absolute', left: 100, top: 100, borderRadius: 16
      }}>
        <video id={'floating_video_' + tag} style={{ width: '100%', height: '100%', borderRadius: 16 }} autoPlay />
      </Paper>
    </Draggable>
  );
}

const FBComp = ({ tag, forceUpdate }) => {
  return (
    <Zoom in={true}>
      <Fab
        id={'floating_video_closer_' + tag}
        size={'small'}
        sx={{ bgcolor: yellow[600] }}
        style={{ position: 'absolute', left: 100 + (floatingVideosMeta[tag].type === 'video' ? 150 : 265) - 20, top: 100 - 20, zIndex: 99999 }}
        onClick={() => {
          delete floatingVideos[tag];
          delete floatingVideosMeta[tag];
          forceUpdate();
        }}>
        <Close />
      </Fab>
    </Zoom>
  );
};

let drawerMenuView = (<div></div>);

export let forceUpdate;

function App() {
  forceUpdate = useForceUpdate();
  const [shadow, setShadow] = React.useState(false);
  const [mediaPlayerOpen, setMediaPlayerOpen] = React.useState(false);
  const [drawerMenuOpen, setDrawerMenuOpen] = React.useState(false);
  const [popupMenuAnchor, setPopupMenuAnchor] = React.useState(undefined);
  const [popupMenuItems, setPopupMenuItems] = React.useState([]);

  useEffect(() => {
    const back = () => {
      isGettingBack = true;
      if (history.length > 1) {
        const key = historyMeta[historyMeta.length - 1].key;
        history.pop();
        historyKeys.pop();
        historyMeta.pop();
        window.history.pushState(null, null, window.location.pathname);
        forceUpdate();
      }
    };
    window.onpopstate = () => {
      if (!checkEmojiBeingOpen()) {
        publish(uiEvents.ACT_BACK_ANIMATION, { tag: historyMeta[historyMeta.length - 1].key });
      }
    };
    var tokenShowPopupMenu = subscribe(uiEvents.SHOW_POPUP_MENU, ({ anchorPosition, items }) => {
      setPopupMenuItems(items)
      setPopupMenuAnchor(anchorPosition);
    });
    var tokenClosePopupMenu = subscribe(uiEvents.CLOSE_POPUP_MENU, () => {
      setPopupMenuItems([]);
      setPopupMenuAnchor(undefined);
    });
    var tokenSetupDone = subscribe(topics.SETUP_DONE, (msg, data) => {
      authenticate();
      setShadow(true);
      setTimeout(() => {
        const appShadow = document.getElementById('appShadow');
        appShadow.style.opacity = 1;
        setTimeout(() => {
          historyKeys = [localStorage.getItem('token') === null ? 'Auth' : 'Home'];
          history = [pageDictionary[historyKeys[historyKeys.length - 1]]];
          historyMeta = [{ key: Math.random(), transitionFlag: false, activateTransition: () => { historyMeta[0].transitionFlag = true; } }];
          setTimeout(() => {
            appShadow.style.opacity = 0;
            setTimeout(() => {
              setShadow(false);
            }, 750);
          }, 250);
        }, 1000);
      }, 100);
    });
    var tokenNavigate = subscribe(uiEvents.NAVIGATE, (msg, data) => {
      let CurrentPageObj = pageDictionary[msg.navigateTo];
      if (CurrentPageObj !== undefined) {
        historyKeys.push(msg.navigateTo);
        const index = historyKeys.length - 1;
        let key = Math.random();
        historyMeta.push({
          transitionFlag: false, activateTransition: () => {
            historyMeta[index].transitionFlag = true;
          }, key: key, ...msg
        });
        history.push(CurrentPageObj);
        isGettingBack = false;
        window.history.pushState(null, null, window.location.pathname);
        forceUpdate();
      }
    });
    var tokenBack = subscribe(uiEvents.BACK, (msg, data) => {
      back();
    });
    var tokenAuthentication = subscribe(topics.AUTHENTICATED, () => {
      if (authenticationCallback !== undefined) {
        authenticationCallback();
      }
    });
    var tokenEnteredWorkspace = subscribe(topics.ENTERED_WORKSPACE, ({ workspaceId, openWorkspace }) => {
      setTimeout(() => {
        if (openWorkspace) {
          publish(uiEvents.NAVIGATE, { navigateTo: 'Workspace' });
        }
      }, 250);
    });
    var tokenCreatingFloatingVideo = subscribe(uiEvents.CREATE_FLOATING_VIDEO, ({ stream, type }) => {
      if (Object.keys(floatingVideos).length < 6) {
        let id = Math.random();
        floatingVideos[id] = stream;
        floatingVideosMeta[id] = { type: type };
        forceUpdate();
      }
    });
    var tokenStoppingFloatingVideo = subscribe(uiEvents.STOP_ALL_FLOATING_VIDEOS, () => {
      floatingVideos = {};
      floatingVideosMeta = {};
      forceUpdate();
    });
    var tokenOpenDrawer = subscribe(uiEvents.OPEN_DRAWER_MENU, ({ view, openDrawer }) => {
      drawerMenuView = view;
      if (openDrawer) {
        setDrawerMenuOpen(true);
      }
    });
    var tokenCloseDrawer = subscribe(uiEvents.CLOSE_DRAWER_MENU, () => {
      setDrawerMenuOpen(false);
    });
    
    return () => {
      unsubscribe(tokenShowPopupMenu);
      unsubscribe(tokenClosePopupMenu);
      unsubscribe(tokenSetupDone);
      unsubscribe(tokenNavigate);
      unsubscribe(tokenBack);
      unsubscribe(tokenAuthentication);
      unsubscribe(tokenEnteredWorkspace);
      unsubscribe(tokenCreatingFloatingVideo);
      unsubscribe(tokenStoppingFloatingVideo);
      unsubscribe(tokenOpenDrawer);
      unsubscribe(tokenCloseDrawer);
    }
  }, []);

  let BelowComp = history[history.length - 3];
  if (BelowComp === undefined) BelowComp = null;
  let BottomComp = history[history.length - 2];
  if (BottomComp === undefined) BottomComp = null;
  let TopComp = history[history.length - 1];
  if (TopComp === undefined) TopComp = null;

  return (
    <div style={{ width: '100%', height: '100%' }} id={'AppContainer'}>
      <AudioPlugin />
      {
        BelowComp === null ? null : <BelowComp
          key={historyMeta[historyMeta.length - 3].key}
          {...historyMeta[historyMeta.length - 3]}
          tag={historyMeta[historyMeta.length - 3].key}
        />
      }
      {
        BottomComp === null ? null : <BottomComp
          key={historyMeta[historyMeta.length - 2].key}
          {...historyMeta[historyMeta.length - 2]}
          tag={historyMeta[historyMeta.length - 2].key}
        />
      }
      {
        TopComp === null ? null : <TopComp
          key={historyMeta[historyMeta.length - 1].key}
          {...historyMeta[historyMeta.length - 1]}
          tag={historyMeta[historyMeta.length - 1].key}
        />
      }
      <CallNew {...callMeta} />
      <VideoPlayer />
      <PhotoViewer />
      {
        Object.keys(floatingVideos).map(tag => {
          return (
            <div
              key={'floating_video_wrapper' + tag}>
              <FloatingVideo
                key={'floating_video_' + tag}
                tag={tag}
                forceUpdate={forceUpdate} />
              <FBComp
                key={'floating_video_closer_' + tag}
                tag={tag}
                forceUpdate={forceUpdate}
              />
            </div>
          );
        })
      }
      <CosmoToolbar />
      {
        popupMenuAnchor ? (
          <Popover
            style={{ background: 'rgba(0, 0, 0, 0.25)' }}
            PaperProps={{
              style: {
                background: colors.floatingCard2,
                backdropFilter: colors.backdrop,
                paddingLeft: 16, paddingRight: 16,
                borderRadius: 8
              }
            }}
            open={popupMenuAnchor ? true : false}
            onClose={() => {
              setPopupMenuAnchor(undefined);
            }}
            anchorReference="anchorPosition"
            anchorPosition={{ top: popupMenuAnchor.y, left: popupMenuAnchor.x }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}>
            {popupMenuItems}
          </Popover>
        ) : null
      }
      <div style={{ width: '100%', position: 'fixed', left: 0, top: 0, zIndex: 99999 }}>
        <Toaster />
      </div>
      <CallPeopleDrawer open={drawerMenuOpen} onClose={() => setDrawerMenuOpen(false)} view={drawerMenuView} />
      <Think />
      {shadow ? (
        <div
          id={'appShadow'}
          style={{
            backgroundColor: '#000',
            opacity: 0,
            transition: 'opacity .75s',
            width: '100%',
            height: '100%',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 99999
          }} />
      ) : null
      }
    </div>
  );
}

export default App;
