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
import { Avatar } from '@mui/material';
import { blue, yellow } from '@mui/material/colors';
import { publish } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import { Download } from '@mui/icons-material';

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
  zIndex: 1,
  background: colors.floatingCard,
  backdropFilter: colors.backdrop,
}));

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

export default function DownloadWidget() {
  const theme = useTheme();
  const duration = 200; // seconds
  const [position, setPosition] = React.useState(32);
  const [paused, setPaused] = React.useState(false);
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
          <CoverImage style={{padding: 24}}>
            <Download style={{ width: '100%', height: '100%', fill: colors.textPencil }}/>
          </CoverImage>
          <Box sx={{ ml: 1.5, minWidth: 0, color: colors.textPencil }}>
            <Typography variant="caption" fontWeight={500}>
              downloading...
            </Typography>
            <Typography noWrap>
              <b>3 files</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              12 MB being downloaded...
            </Typography>
          </Box>
        </Box>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => setPosition(value)}
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
            aria-label={paused ? 'play' : 'pause'}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
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
        </Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center" style={{ marginTop: -12 }}>
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            defaultValue={30}
            sx={{
              color: colors.textPencil,
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                backgroundColor: '#fff',
                '&:before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
    </Box>
  );
}