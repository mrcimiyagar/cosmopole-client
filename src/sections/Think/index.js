import * as React from 'react';
import { CircularProgress, Dialog, Fab, Fade, Grid, Paper, Typography, Zoom } from '@mui/material';
import { colors, themeId } from '../../config/colors';
import { publish, subscribe, unsubscribe } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';
import ReactGridLayout from 'react-grid-layout';
import { Edit } from '@mui/icons-material';
import { yellow } from '@mui/material/colors';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import AudioWidget from '../../components/AudioWidget';
import VideoWidget from '../../components/VideoWidget';
import CallWidget from '../../components/CallWidget';
import TopTransition from '../../components/TopTransition';
import DownloadWidget from '../../components/DownloadWidget';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

function Think() {
  const [open, setOpen] = React.useState(false);
  const [delayedOpen, setDelayedOpen] = React.useState(false);
  const [gridKey, setGridKey] = React.useState(Math.random());
  const [editMode, setEditMode] = React.useState(false);
  const [myBlocks, setMyBlocks] = React.useState(localStorage.getItem('myBlocks') !== null ? JSON.parse(localStorage.getItem('myBlocks')) : []);
  const [value, setValue] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (localStorage.getItem('myBlocks') === null || JSON.parse(localStorage.getItem('myBlocks')).length < 5) {
      let temp = [
        { type: 'call', id: 'call', x: 0, y: 0, width: 4, height: 1 },
        { type: 'audio', id: 'audio', x: 0, y: 1, width: 4, height: 2 },
        { type: 'download', id: 'download', x: 0, y: 3, width: 4, height: 1 },
        { type: 'video', id: 'video', x: 0, y: 4, width: 4, height: 3 },
        { type: 'end', id: 'end', x: 0, y: 7, width: 4, height: 1 }
      ];
      localStorage.setItem('myBlocks', JSON.stringify(temp));
      setMyBlocks(temp);
      setGridKey(Math.random());
    }
    let tokenOpen = subscribe(uiEvents.OPEN_CONTROL_CENTER, () => {
      setOpen(true);
      setTimeout(() => {
        setDelayedOpen(true);
      }, 250);
    });
    let tokenClose = subscribe(uiEvents.CLOSE_CONTROL_CENTER, () => {
      setDelayedOpen(false);
      setTimeout(() => {
        setOpen(false);
      }, 200);
    });
    return () => {
      unsubscribe(tokenOpen);
      unsubscribe(tokenClose);
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
          background: 'transparent',
          backdropFilter: colors.backdrop,
          position: 'relative',
        }
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', paddingTop: 32 + comsoToolbarHeight, paddingLeft: 16, paddingRight: 16 }}>
        <Zoom in={delayedOpen} style={{transitionDelay: open ? '0.1s' : '0ms'}}>
          <div style={{ position: 'absolute', left: 32, width: 'calc(100% - 64px)' }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <AudioWidget />
            </div>
          </div>
        </Zoom>
      </div>
    </Dialog>
  );
}

export default Think;
