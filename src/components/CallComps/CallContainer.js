import React, { useEffect } from "react";
import { fetchMyUserId } from '../../core/storage/me';
import VideoMedia, {
  destructVideoNet,
  endVideo,
  initVideo,
  startVideo,
} from "./VideoMedia";
import AudioMedia, {
  destructAudioNet,
  endAudio,
  initAudio,
  startAudio,
} from "./AudioMedia";
import ScreenMedia, {
  destructScreenNet,
  endScreen,
  initScreen,
  startScreen,
} from "./ScreenMedia";
import useForceUpdate from '../../utils/ForceUpdate';
import Audio from './Audio';

export let videoCache = {};
export let needUpdate = {};
let audioNeedUpdate = {};

export let globalVideos = {};
export let globalScreens = {};
export let globalShownVideos = {};
export let globalShownScreens = {};

function Core(props) {
  let forceUpdate = useForceUpdate();
  let [connected, setConnected] = React.useState(false);
  let [videos, setVideos] = React.useState({});
  let [audios, setAudios] = React.useState({});
  let [screens, setScreens] = React.useState({});
  let [shownVideos, setShownVideos] = React.useState({});
  let [shownAudios, setShownAudios] = React.useState({});
  let [shownScreens, setShownScreens] = React.useState({});
  let [videoInConfig, setVideoInConfig] = React.useState(true);
  let [screenInConfig, setScreenInConfig] = React.useState(true);
  let [audioInConfig, setAudioInConfig] = React.useState(true);

  globalVideos = videos;
  globalScreens = screens;
  globalShownVideos = shownVideos;
  globalShownScreens = shownScreens;

  useEffect(() => {
    if (!props.callActive) {
      setConnected(false);
      endAudio();
      destructAudioNet();
      endVideo();
      destructVideoNet();
      endScreen();
      destructScreenNet();
      setShownVideos({});
      setShownAudios({});
      setShownScreens({});
    }
  }, [props.callActive]);

  useEffect(() => {
    if (!videoInConfig) {
      if (!props.useVideo) {
        endVideo();
      } else {
        startVideo();
      }
    } else {
      setVideoInConfig(false);
    }
  }, [props.useVideo]);

  useEffect(() => {
    if (!audioInConfig) {
      if (!props.useAudio) {
        endAudio();
      } else {
        startAudio();
      }
    } else {
      setAudioInConfig(false);
    }
  }, [props.useAudio]);

  useEffect(() => {
    if (!screenInConfig) {
      if (!props.useScreen) {
        endScreen();
      } else {
        startScreen();
      }
    } else {
      setScreenInConfig(false);
    }
  }, [props.useScreen]);

  useEffect(() => {
    setConnected(true);
  }, []);

  useEffect(() => {
    if (connected) {
      initVideo();
      initScreen();
      initAudio();
    }
  }, [connected]);

  let notifyWebcamActivated = () => {

  };

  let onVideoStreamUpdate = (userId) => {
    needUpdate[userId] = true;
    notifyWebcamActivated();
  };
  let onAudioStreamUpdate = (userId) => {
    audioNeedUpdate[userId] = true;
    notifyWebcamActivated();
  };
  let onScreenStreamUpdate = (userId) => {
    needUpdate[userId] = true;
    notifyWebcamActivated();
  };

  let audioLoadCallback = () => {

  };

  let videoLoadCallback = () => {

  };

  let screenLoadCallback = () => {

  };

  return (
    <div
    >
      <div>
        {Object.keys(shownAudios).map((key) => {
          if (fetchMyUserId() === key) return null;
          if (shownAudios[key] === undefined) return null;
          return <Audio id={key} stream={audios[key + "_audio"]} />;
        })}
      </div>
      <div
        style={{
          display: connected && props.videoAccess ? "block" : "none",
        }}
      >
        <VideoMedia
          shownUsers={shownVideos}
          data={videos}
          updateData={onVideoStreamUpdate}
          forceUpdate={forceUpdate}
          userId={fetchMyUserId()}
          roomId={props.moduleWorkerId}
          loadedCallback={videoLoadCallback}
        />
        <AudioMedia
          shownUsers={shownAudios}
          data={audios}
          updateData={onAudioStreamUpdate}
          forceUpdate={forceUpdate}
          userId={fetchMyUserId()}
          roomId={props.moduleWorkerId}
          loadedCallback={audioLoadCallback}
        />
        <ScreenMedia
          shownUsers={shownScreens}
          data={screens}
          updateData={onScreenStreamUpdate}
          forceUpdate={forceUpdate}
          userId={fetchMyUserId()}
          roomId={props.moduleWorkerId}
          loadedCallback={screenLoadCallback}
        />
      </div>
    </div>
  );
}

export default Core;