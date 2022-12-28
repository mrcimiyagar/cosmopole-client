import { ArrowBack, Done, Search } from "@mui/icons-material";
import {
  Dialog,
  Fab,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import TopTransition from "../../components/TopTransition";
import { publish, restoreState, saveState, subscribe, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { createDisk, createFolder } from "../../core/callables/storage";
import { colors } from "../../config/colors";
import { yellow } from "@mui/material/colors";

export let closeExplore = () => { };

export default function CreateFolderDlg({ folderId, tag }) {
  const [dialogOpen, setDialogOpen] = React.useState(true);
  const [title, setTitle] = React.useState('');
  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 250);
  }
  React.useEffect(() => {
    let tokenBack = subscribe(uiEvents.ACT_BACK_ANIMATION, ({ tag: t }) => {
      if (tag === t) handleClose();
    });
    return () => {
      unsubscribe(tokenBack);
    };
  }, []);
  return (
    <Dialog
      open={dialogOpen}
      TransitionComponent={TopTransition}
      PaperProps={{ style: { background: 'transparent', boxShadow: 'none', width: '90%', height: 'auto', borderRadius: 16, paddingBottom: 48 } }}
    >
      <Paper
        style={{
          backgroundColor: colors.semiTransparentPaper,
          backdropFilter: 'blur(10px)',
          overflow: "hidden",
          borderRadius: 16,
          position: 'relative',
          height: 'auto',
          width: '100%',
          paddingBottom: 40
        }}
      >
        <div
          style={{
            height: 64
          }}
        >
          <Toolbar>
            <IconButton
              onClick={handleClose}
            >
              <ArrowBack style={{ fill: colors.textPencil }} />
            </IconButton>
            <Typography style={{color: colors.textPencil}}>Create Folder</Typography>
          </Toolbar>
        </div>
        <div style={{ paddingLeft: 16, paddingRight: 16, position: 'relative' }}>
          <InputBase
            style={{ width: '100%', textAlign: "center", color: colors.textPencil }}
            placeholder="Disk Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
      </Paper>
      <Fab sx={{bgcolor: yellow[600]}} style={{ position: 'absolute', bottom: 24, right: 24 }}
        onClick={() => {
          createFolder(title, folderId);
          handleClose();
        }}>
        <Done />
      </Fab>
    </Dialog>
  );
}
