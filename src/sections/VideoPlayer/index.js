import * as React from 'react';
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import screenfull from 'screenfull';
import './index.css';
import ControlIcons from '../../components/VideoControlIcons/ControlIcons';
import { Dialog, IconButton, Toolbar, Typography } from '@mui/material';
import { colors } from '../../config/colors';
import { ArrowBack } from '@mui/icons-material';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import { subscribe, unsubscribe } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';

const format = (seconds) => {
  if (isNaN(seconds)) {
    return '00:00'
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
  } else {
    return `${mm}:${ss}`
  }
};

let source, docId;

function VideoPlayer() {
  const [playerstate, setPlayerState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playerbackRate: 1.0,
    played: 0,
    seeking: false
  });
  const [open, setOpen] = React.useState(false);

  //Destructure State in other to get the values in it
  const { playing, muted, volume, playerbackRate, played, seeking } = playerstate;
  const playerRef = useRef(null);
  const playerDivRef = useRef(null);

  //This function handles play and pause onchange button
  const handlePlayAndPause = () => {
    setPlayerState({ ...playerstate, playing: !playerstate.playing })
  }

  const handleMuting = () => {
    setPlayerState({ ...playerstate, muted: !playerstate.muted })
  }

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
  }

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 30)
  }

  const handleVolumeChange = (e, newValue) => {
    setPlayerState({ ...playerstate, volume: parseFloat(newValue / 100), muted: newValue === 0 ? true : false, });
  }

  const handleVolumeSeek = (e, newValue) => {
    setPlayerState({ ...playerstate, volume: parseFloat(newValue / 100), muted: newValue === 0 ? true : false, });
  }

  const handlePlayerRate = (rate) => {
    setPlayerState({ ...playerstate, playerbackRate: rate });
  }

  const handleFullScreenMode = () => {
    screenfull.toggle(playerDivRef.current)
  }

  const handlePlayerProgress = (state) => {
    console.log('onProgress', state);
    if (!playerstate.seeking) {
      setPlayerState({ ...playerstate, ...state });
    }
    console.log('afterProgress', state);
  }

  const handlePlayerSeek = (e, newValue) => {
    setPlayerState({ ...playerstate, played: parseFloat(newValue / 100) });
    playerRef.current.seekTo(parseFloat(newValue / 100));
    // console.log(played)
  }

  const handlePlayerMouseSeekDown = (e) => {
    setPlayerState({ ...playerstate, seeking: true });
  }

  const handlePlayerMouseSeekUp = (e, newValue) => {
    setPlayerState({ ...playerstate, seeking: false });
    playerRef.current.seekTo(newValue / 100);
  }

  const currentPlayerTime = playerRef.current ? playerRef.current.getCurrentTime() : '00:00';
  const movieDuration = playerRef.current ? playerRef.current.getDuration() : '00:00';
  const playedTime = format(currentPlayerTime);
  const fullMovieTime = format(movieDuration);

  React.useEffect(() => {
    let tokenOpenVideoPlayer = subscribe(uiEvents.OPEN_VIDEO_PLAYER, ({ source: s, docId: di }) => {
      setOpen(true);
      if (docId) {
        if (di !== docId) {
          setTimeout(() => {
            if (window.confirm('playing this video will close current video being watched. are you sure ?')) {
              source = s;
              docId = di;
              setPlayerState({
                playing: true,
                muted: true,
                volume: 0.5,
                playerbackRate: 1.0,
                played: 0,
                seeking: false,
              });
            }
          }, 300);
        }
      } else {
        source = s;
        docId = di;
        setPlayerState({
          playing: true,
          muted: true,
          volume: 0.5,
          playerbackRate: 1.0,
          played: 0,
          seeking: false,
        });
      }
    });
    return () => {
      unsubscribe(tokenOpenVideoPlayer);
    };
  }, []);

  return (
    <Dialog
      keepMounted
      fullScreen
      open={open}
      PaperProps={{
        style: {
          width: "100%",
          height: "100%",
          background: colors.semiTransparentPaper,
          backdropFilter: colors.backdrop,
          overflow: 'hidden',
          position: 'relative'
        }
      }}
    >
      <ReactPlayer
        width={'100%'}
        height={'100%'}
        ref={playerRef}
        url={source}
        playing={playing}
        volume={volume}
        playbackRate={playerbackRate}
        onProgress={handlePlayerProgress}
        onEnded={() => setPlayerState({ ...playerstate, playing: false })}
        onPlay={() => setPlayerState({ ...playerstate, playing: true })}
        onPause={() => setPlayerState({ ...playerstate, playing: false })}
        muted={muted}
        style={{
          width: '100%',
          top: '100%',
          position: 'absolute',
          left: 0,
          top: 0
        }}
      />
      <ControlIcons
        key={volume.toString()}
        playandpause={handlePlayAndPause}
        playing={playing}
        rewind={handleRewind}
        fastForward={handleFastForward}
        muting={handleMuting}
        muted={muted}
        volumeChange={handleVolumeChange}
        volumeSeek={handleVolumeSeek}
        volume={volume}
        playerbackRate={playerbackRate}
        playRate={handlePlayerRate}
        fullScreenMode={handleFullScreenMode}
        played={played}
        onSeek={handlePlayerSeek}
        onSeekMouseUp={handlePlayerMouseSeekUp}
        onSeekMouseDown={handlePlayerMouseSeekDown}
        playedTime={playedTime}
        fullMovieTime={fullMovieTime}
        seeking={seeking}
        closePlayer={() => {
          if (playerstate.playing && window.confirm('do you want to pause video ?')) {
            setPlayerState({ ...playerstate, playing: false });
          }
          setOpen(false);
        }}
      />
    </Dialog>
  );
}

export default VideoPlayer;
