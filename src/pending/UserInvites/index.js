import { ArrowBack, Search, SmartToy } from "@mui/icons-material";
import {
  Avatar,
  Dialog,
  Fade,
  Grow,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { colors } from "../../config/colors";
import TopTransition from "../../components/TopTransition";
import { publish } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import useForceUpdate from "../../utils/ForceUpdate";
import { acceptInvite } from "../../core/callables/invites";
import { invitesDictById } from "../../core/memory";

export let closeExplore = () => { };

export default function UserInvites() {
  const forceUpdate = useForceUpdate();
  const [dialogOpen, setDialogOpen] = React.useState(true);
  const [show, setShow] = React.useState(true);
  closeExplore = () => {
    setDialogOpen(false);
  };
  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 125);
  };
  return (
    <Dialog
      open={dialogOpen}
      TransitionComponent={TopTransition}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          width: '90%',
          height: 700,
          backgroundColor: colors.semiTransparentPaper,
          borderRadius: 24,
          backdropFilter: colors.backdrop
        }
      }}
    >
      <div
        style={{
          overflow: "hidden",
          position: 'relative',
          height: '100%'
        }}
      >
        <Paper
          style={{
            height: 56,
            background: 'transparent',
            borderRadius: 0
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => handleClose()}
            >
              <ArrowBack style={{ fill: "#000" }} />
            </IconButton>
            <Typography>
              My Invites
            </Typography>
          </Toolbar>
        </Paper>
        <List
          sx={{ width: "100%" }}
          style={{
            position: 'absolute',
            left: 0,
            top: 64
          }}
        >
          {Object.values(invitesDictById).map((invite) => (
            <Fade in={show} timeout={750}>
              <ListItem onClick={() => {
                if (window.confirm('do you want to accept this invite ?')) {
                  acceptInvite(invite.id);
                }
              }}>
                <ListItemAvatar>
                  <Avatar>
                    <SmartToy style={{ fill: '#444' }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={invite.roomId} secondary={'2022/10/20'} />
              </ListItem>
            </Fade>
          ))}
        </List>
      </div>
    </Dialog>
  );
}
