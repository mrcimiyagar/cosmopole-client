import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
import { colors } from '../../config/colors';
import { fetchCurrentPlayingMediaId, saveCurrentPlayingMediaId } from '../../core/storage/media';
import { docsDictById } from '../../core/memory';
import { generateCoverLink, generateFileLink } from '../../core/callables/file';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { publish, subscribe, unsubscribe } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import { RepeatRounded } from '@mui/icons-material';

const CoverImage = styled('div')({
  width: 80,
  height: 80,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.75,
  fontWeight: 500,
  letterSpacing: 0.2
});

export default function AudioWidget() {
  const Widget = styled('div')(({ theme }) => ({
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 2,
    borderRadius: 16,
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    position: 'relative',
    background: colors.textAntiPencil,
    zIndex: 1
  }));
  const [playing, setPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [repeat, setRepeat] = React.useState(false);
  const theme = useTheme();
  React.useEffect(() => {
    let tokenAudioPluginStateChanged = subscribe(uiEvents.ON_AUDIO_PLUGIN_STATE_CHANGED, ({ duration: dur, docId: di, position: pos, playing: pl }) => {
      if (dur !== undefined) {
        setDuration(dur);
      }
      if (pos !== undefined) {
        setPosition(pos);
      }
      if (pl !== undefined) {
        setPlaying(pl);
      }
    });
    return () => {
      unsubscribe(tokenAudioPluginStateChanged);
    };
  }, []);
  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = value - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }
  const mainIconColor = colors.textPencil;
  const lightIconColor = colors.textPencil;
  return (
    <Box sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage style={{ width: '100%', height: window.innerWidth - 176 + 'px' }}>
            <HeadphonesIcon style={{ width: '100%', height: '100%', fill: colors.textPencil }} />
          </CoverImage>
        </Box>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => {
            publish(uiEvents.MOVE_AUDIO_POSITION, { position: value });
          }}
          sx={{
            color: colors.textPencil,
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                  ? 'rgb(255 255 255 / 16%)'
                  : 'rgb(0 0 0 / 16%)'
                  }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2
          }}
        >
          <TinyText style={{ color: colors.textPencil }}>{formatDuration(position)}</TinyText>
          <TinyText style={{ color: colors.textPencil }}>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
          style={{ marginTop: -16 }}
        >
          <IconButton aria-label="previous song">
            <FastRewindRounded fontSize="medium" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={!playing ? 'play' : 'pause'}
            onClick={e => {
              try {
                if (playing) {
                  publish(uiEvents.STOP_AUDIO, {});
                } else {
                  publish(uiEvents.PLAY_AUDIO, {});
                }
              } catch (ex) { }
            }}
          >
            {!playing ? (
              <PlayArrowRounded
                sx={{ fontSize: '2rem' }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded sx={{ fontSize: '2rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
          <IconButton aria-label="next song">
            <FastForwardRounded fontSize="medium" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton aria-label="repeat song" onClick={() => {
            publish(uiEvents.TOGGLE_REPEAT, { repeat: !repeat });
            setRepeat(!repeat);
          }}>
            <RepeatRounded style={{ opacity: repeat ? 1 : 0.5 }} fontSize="medium" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
      </Widget>
    </Box>
  );
}
