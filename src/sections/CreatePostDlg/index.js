import { ArrowBack, Done, QuestionMark } from "@mui/icons-material";
import {
  CircularProgress,
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
import { publish, subscribe, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { createPost, updatePost } from "../../core/callables/blog";
import { uploadFile } from "../../core/callables/file";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import useForceUpdate from '../../utils/ForceUpdate';
import { blobToBase64 } from '../../core/utils/converters';
import { reloadCoverFlags } from "../Blog";
import { colors } from "../../config/colors";
import { yellow } from "@mui/material/colors";

export let closeExplore = () => { };

let selectedPostAvatar = undefined;
let b64 = undefined;
let postCreatingId;

export default function CreatePostDlg({ blogId, post, tag }) {
  const [dialogOpen, setDialogOpen] = React.useState(true);
  const [title, setTitle] = React.useState(post !== undefined ? post.title : '');
  const [changedAvatar, setChangedAvatar] = React.useState(false);
  const [doing, setDoing] = React.useState(false);
  const [avatarUplaodProgress, setAvtarUploadProgress] = React.useState(0);
  let forceUpdate = useForceUpdate();
  const handleClose = () => {
    selectedPostAvatar = undefined;
    setDialogOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 250);
  }
  React.useEffect(() => {
    selectedPostAvatar = undefined;
    b64 = undefined;
    let tokenUploadProgress = subscribe(uiEvents.FILE_TRANSFER_PROGRESS, ({ tag, progress }) => {
      if (postCreatingId === tag) setAvtarUploadProgress(progress.progress);
    });
    let tokenBack = subscribe(uiEvents.ACT_BACK_ANIMATION, ({ tag: t }) => {
      if (tag === t) handleClose();
    });
    return () => {
      unsubscribe(tokenUploadProgress);
      unsubscribe(tokenBack);
    };
  }, []);
  if (doing) {
    return (
      <Dialog
        open={dialogOpen}
        TransitionComponent={TopTransition}
        PaperProps={{ style: { background: 'transparent', boxShadow: 'none', width: 100, height: 100, borderRadius: 16, paddingBottom: 48 } }}
      >
        <div style={{
          padding: 16, position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)', background: colors.semiTransparentPaper,
          borderRadius: '50%', width: 64, height: 64
        }}>
          <CircularProgress variant="determinate" value={avatarUplaodProgress} style={{ width: '100%', height: '100%', }} />
        </div>
      </Dialog>
    );
  }
  return (
    <Dialog
      open={dialogOpen}
      TransitionComponent={TopTransition}
      PaperProps={{ style: { background: 'transparent', boxShadow: 'none', width: '90%', height: 'auto', borderRadius: 16, paddingBottom: 48 } }}
    >
      <input type={'file'} name={'postAvatarUploader'} id={'postAvatarUploader'} style={{ display: 'none' }}
        onChange={e => {
          setChangedAvatar(true);
          selectedPostAvatar = e.target.files[0];
          blobToBase64(selectedPostAvatar).then(base64 => {
            b64 = base64;
            forceUpdate();
          });
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
                handleClose();
              }}
            >
              <ArrowBack style={{ fill: colors.textPencil }} />
            </IconButton>
            <Typography style={{ color: colors.textPencil }}>{post !== undefined ? 'Edit Post' : 'Create Post'}</Typography>
          </Toolbar>
        </div>
        <div style={{ width: '100%', height: 220, paddingLeft: 16, paddingRight: 16 }}>
          <Paper onClick={() => document.getElementById('postAvatarUploader').click()} style={{ position: 'relative', textAlign: 'center', paddingTop: 72, borderRadius: 16, width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.35)' }}>
            <QuestionMark style={{ width: 56, height: 56, color: colors.textPencil }} />
            {b64 !== undefined ? (
              <img id={'selectedPostAvatar'} src={b64} key={b64}
                style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}
                alt={''}
              />) : null}
          </Paper>
        </div>
        <div style={{ paddingLeft: 16, paddingRight: 16, position: 'relative', marginTop: 16 }}>
          <InputBase
            style={{ width: '100%', textAlign: "center", color: colors.textPencil }}
            placeholder="Post Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
      </Paper>
      <Fab sx={{ bgcolor: yellow[600] }} style={{ position: 'absolute', bottom: 24, right: 24 }}
        onClick={() => {
          if (post !== undefined) {
            if (changedAvatar) {
              uploadFile(post.id, selectedPostAvatar, fetchCurrentRoomId(), true, res => {
                let documentId = res.document.id;
                updatePost(title, documentId, post.id, () => {
                  handleClose();
                });
              });
              setDoing(true);
            } else {
              updatePost(title, post.coverId, post.id, () => {
                handleClose();
              });
              setDoing(true);
            }
          } else {
            createPost(title, '0', blogId, post => {
              uploadFile(post.id, selectedPostAvatar, fetchCurrentRoomId(), true, res => {
                let documentId = res.document.id;
                updatePost(title, documentId, post.id, () => {
                  handleClose();
                });
              });
            });
            setDoing(true);
          }
        }}>
        <Done />
      </Fab>
    </Dialog>
  );
}
