import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SampleRoomIcon from '../../data/photos/sample-room.png';

export default function SpaceRoomCard() {
  const theme = useTheme();

  return (
    <Card sx={{ display: 'flex' }} style={{marginTop: 16, height: 112}}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            Live From Space
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Mac Miller
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        style={{width: 144, height: 112}}
        image={SampleRoomIcon}
        alt="Live from space album cover"
      />
    </Card>
  );
}
