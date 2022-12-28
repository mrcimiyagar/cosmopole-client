import {
  Avatar,
  Card,
  Fab,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  Zoom
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import React, { useEffect, useRef } from "react";
import {
  ArrowBack,
  Call,
  ChatBubble,
  DynamicFeed,
  PersonAdd,
  Workspaces,
} from "@mui/icons-material";
import { colors, themeId } from "../../config/colors";
import { publish } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { fetchMyHomeId } from "../../core/storage/me";
import { dbFetchTowerRooms } from "../../core/storage/spaces";
import { dbFetchRoomBlogs } from "../../core/storage/blog";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import generatePage from "../../utils/PageGenerator";
import { animOnce } from "../../utils/OnceAnim";
import { enterRoom, enterWorkspace } from "../../core/callables/auth";
import { createInteraction } from "../../core/callables/interactions";
import { blue, green, lime, purple, red, yellow } from "@mui/material/colors";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { interactionsDict, roomsDictById, workspacesDict } from "../../core/memory";
import BaseSection from "../../utils/SectionEssentials";

export default class UserProfile extends BaseSection {
  render() {
    let { user } = this.props;
    return this.renderWrapper(
      <div style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
        <Paper style={{ borderRadius: 0, width: '100%', height: 300, position: 'relative' }}>
          <img src={'https://i.pinimg.com/564x/46/90/b5/4690b59cc8a5b7fe30a8694a49919398.jpg'} style={{ width: '100%', height: '100%' }} />
          <div
            style={{
              top: 250,
              width: "calc(100% - 32px)",
              left: 16,
              right: 16,
              position: "absolute",
              zIndex: 2,
              textAlign: 'center'
            }}
          >
            <Typography variant="caption" style={{
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 4,
              paddingBottom: 4,
              color: '#fff',
              fontWeight: "bold",
              fontSize: 18,
              background: 'rgba(0, 0, 0, 0.35)',
              width: 'auto',
              borderRadius: 8
            }}>
              {user.firstName + (user.lastName ? ' ' : '') + user.lastName}
            </Typography>
          </div>
        </Paper>
        <Paper
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 0,
            backgroundColor: colors.semiTransparentPaper,
            backdropFilter: colors.backdrop,
            padding: 4,
          }}
        >
          <Typography
            style={{
              color: colors.textPencil,
              fontWeight: "bold",
              fontSize: 18,
              marginTop: 32,
              width: "calc(100% - 64px)",
              marginLeft: 16,
              marginRight: 16,
              position: "relative",
              zIndex: 2
            }}
          >
            Bio
          </Typography>
          <Typography
            style={{
              color: colors.textPencil,
              marginTop: 16,
              marginLeft: 16,
              marginRight: 16,
              marginBottom: 32,
            }}
            variant={"subtitle2"}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            gravida tortor vel tellus scelerisque, nec dapibus leo
            eleifend. Phasellus blandit risus non est dapibus, vel gravida
            nunc sollicitudin. Mauris auctor eros vel leo pharetra
            fringilla. Vestibulum nec dictum ante.
          </Typography>
        </Paper>
        <Card
          style={{
            borderRadius: '50%',
            padding: 4,
            width: 144,
            height: 144,
            position: "absolute",
            top: 84,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Avatar
            sx={{
              bgcolor:
                user.avatarBackColor < 2 ? blue[400] :
                  user.avatarBackColor < 4 ? purple[400] :
                    user.avatarBackColor < 6 ? red[400] :
                      user.avatarBackColor < 8 ? green[400] :
                        yellow[600]
            }}
            style={{ width: "100%", height: "100%", fontWeight: 'bold', fontSize: 35 }}
            alt={user.firstName + ' ' + user.lastName}
          >
            {(user.firstName + ' ' + user.lastName).substring(0, 1).toUpperCase()}
          </Avatar>
        </Card>
        <Fab
          style={{ position: 'fixed', right: 24, top: 300 - 28 }}
          sx={{ bgcolor: yellow[600] }}
          onClick={() => {
            publish(uiEvents.NAVIGATE, { navigateTo: 'Inviter', invitingUser: user });
          }}
        >
          <GroupAddIcon />
        </Fab>
        <div
          style={{
            width: "100%",
            position: "absolute",
            top: 8 + comsoToolbarHeight,
            display: 'flex'
          }}
        >
          <IconButton onClick={() => this.close(true)} style={{ marginLeft: 16 }}>
            <ArrowBack style={{ fill: colors.textPencil }} />
          </IconButton>
        </div>
        <Zoom in={interactionsDict[user.id] !== undefined}>
          <Fab
            style={{
              position: "fixed",
              right: 24 + 56 + 16,
              bottom: 24,
              zIndex: 2,
              backdropFilter: 'blur(10px)'
            }}
            sx={{ bgcolor: yellow[600] }}
            onClick={() => {
              createInteraction(user.id, (interaction, ws, user) => {
                enterRoom(ws.roomId, true);
              });
            }}
          >
            <Workspaces style={{ fill: '#666' }} />
          </Fab>
        </Zoom>
        <Zoom in={interactionsDict[user.id] !== undefined}>
          <Fab
            style={{
              position: "fixed",
              right: 24 + 56 + 16 + 56 + 16,
              bottom: 24,
              zIndex: 2,
              backdropFilter: 'blur(10px)'
            }}
            sx={{ bgcolor: yellow[600] }}
            onClick={() => {
              if (interactionsDict[user.id]) {
                let workspaces = workspacesDict[interactionsDict[user.id].roomId];
                for (let i = 0; i < workspaces.length; i++) {
                  if (workspaces[i].title === 'main workspace') {
                    publish(uiEvents.OPEN_CALL, { user, workspace: workspaces[i] });
                    break;
                  }
                }
              }
            }}
          >
            <Call style={{ fill: '#666' }} />
          </Fab>
        </Zoom>
        <Fab
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 2,
            backdropFilter: 'blur(10px)'
          }}
          sx={{ bgcolor: yellow[600] }}
          onClick={() => {
            publish(uiEvents.NAVIGATE, { navigateTo: "Chat", user, preRoomId: fetchCurrentRoomId() });
          }}
        >
          <ChatBubble style={{ fill: '#666' }} />
        </Fab>
      </div>
    );
  }
}
