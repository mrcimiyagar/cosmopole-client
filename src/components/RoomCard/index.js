import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import SampleRoomIcon from '../../data/photos/sample-room.png';

export default function RoomCard({onClick}) {
  return (
    <Card style={{width: '100%', marginTop: 16}} onClick={onClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="196"
          image={SampleRoomIcon}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Sample Room
          </Typography>
          <Typography variant="body2" color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
