import { ArrowBack, Done, QuestionMark } from "@mui/icons-material";
import {
  Dialog,
  Fab,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import TopTransition from "../../components/TopTransition";
import { publish, subscribe, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { uploadFile } from "../../core/callables/file";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import useForceUpdate from '../../utils/ForceUpdate';
import { blobToBase64 } from '../../core/utils/converters';
import { filterEmpty } from '../../utils/EmptyChecker';
import { createFile } from "../../core/callables/storage";
import { colors } from "../../config/colors";
import { yellow } from "@mui/material/colors";

export let closeExplore = () => { };

let selectedFile = undefined;

export default function CreateFileDlg({ folderId, tag }) {
  const [dialogOpen, setDialogOpen] = React.useState(true);
  let forceUpdate = useForceUpdate();
  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 250);
  }
  React.useEffect(() => {
    selectedFile = undefined;
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
      <input type={'file'} name={'storageFileUploader'} id={'storageFileUploader'} style={{ display: 'none' }}
        onChange={e => {
          selectedFile = e.target.files[0];
          forceUpdate();
        }} />
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
              onClick={() => {
                publish(uiEvents.BACK, {});
              }}
            >
              <ArrowBack style={{ fill: colors.textPencil }} />
            </IconButton>
            <Typography style={{color: colors.textPencil}}>Create File</Typography>
          </Toolbar>
        </div>
        <div style={{ width: '100%', height: 220, paddingLeft: 16, paddingRight: 16 }}>
          <Paper onClick={() => document.getElementById('storageFileUploader').click()} style={{ position: 'relative', textAlign: 'center', paddingTop: 72, borderRadius: 16, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.35)' }}>
            {selectedFile !== undefined ? selectedFile.name : <QuestionMark style={{ width: 56, height: 56, color: colors.textPencil }} />}
          </Paper>
        </div>
      </Paper>
      <Fab sx={{bgcolor: yellow[600]}} style={{ position: 'absolute', bottom: 24, right: 24 }}
        onClick={() => {
          uploadFile(Math.random(), selectedFile, fetchCurrentRoomId(), true, res => {
            createFile(folderId, res.document.id);
            handleClose();
          });
        }}>
        <Done />
      </Fab>
    </Dialog>
  );
}
