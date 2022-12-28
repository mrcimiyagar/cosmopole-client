import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { setupScrollListenerForContainer } from "../../utils/ScrollHelper";
import { activeCalls, me, messagesDict, roomsDict, towersDictById, usersDict, workspacesDict } from "../../core/memory";
import uiEvents from '../../config/ui-events.json';
import { publish, subscribe, unsubscribe } from "../../core/bus";
import { dbFindTowerById } from "../../core/storage/spaces";
import emojis from '../../core/storage/emojis';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { colors, themeId } from "../../config/colors";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import { Add, Call, Done, DoneAll, Face2, Forum, SdStorage, Timelapse, Widgets, Workspaces } from "@mui/icons-material";
import '../../styles/chat-item-call-ripple.css';
import updates from '../../core/network/updates.json';
import { Button, Card, Fab, IconButton, Paper } from "@mui/material";
import useForceUpdate from "../../utils/ForceUpdate";
import { replaceAll } from '../../index';
import Coin from "../Coin";
import formatDate from "../../utils/DateFormatter";
import topics from '../../core/events/topics.json';

let ChatItem = ({ workspace }) => {
  const forceUpdate = useForceUpdate();
  let message = messagesDict[workspace.id][messagesDict[workspace.id].length - 1];
  const lastMessageRef = React.useRef();
  const avatarRef = React.useRef();
  React.useEffect(() => {
    let tokenActiveCallsSync = subscribe(updates.ON_ACTIVE_CALLS_SYNC, () => {
      forceUpdate();
    });
    let tokenCallCreation = subscribe(updates.ON_CALL_CREATE, ({ workspaceId }) => {
      if (workspaceId === workspace.id) {
        forceUpdate();
      }
    });
    let tokenCallDestruction = subscribe(updates.ON_CALL_DESTRUCT, ({ workspaceId }) => {
      if (workspaceId === workspace.id) {
        forceUpdate();
      }
    });
    let tokenOnlineStateChange = subscribe(updates.ON_CONTACT_ONLINE_STATE_CHANGE, () => {
      forceUpdate();
    });
    let tokenNewMessage = subscribe(updates.NEW_MESSAGE, ({ message }) => {
      if (workspace.id === message.wid) {
        forceUpdate();
      }
    });
    return () => {
      unsubscribe(tokenOnlineStateChange);
      unsubscribe(tokenCallCreation);
      unsubscribe(tokenCallDestruction);
      unsubscribe(tokenActiveCallsSync);
      unsubscribe(tokenNewMessage);
    }
  }, []);
  React.useEffect(() => {
    let text = message?.text;
    if (text) {
      Object.keys(emojis).forEach(key => {
        text = replaceAll(text, `:${key}:`, `<img src='${emojis[key]}' alt='${key}' width='18' height='18' />`);
      });
      lastMessageRef.current.innerHTML = '<b>' + usersDict[message?.authorId]?.firstName + '</b>: ' + text;
    }
  }, [workspace.lastMessage?.text]);
  let roomTitle = workspace.room.title;
  let workspaceAvatarColor = workspace.avatarBackColor;
  return (
    <div style={{ width: '100%', marginTop: 2, marginLeft: -8 }}>
      <ListItem button alignItems="flex-start" style={{ position: 'relative' }} onClick={() => {
        if (workspace.tower.secret.isContact) {
          publish(uiEvents.NAVIGATE, { navigateTo: "Chat", workspaceId: workspace.id, user: workspace.tower.contact });
        } else {
          publish(uiEvents.NAVIGATE, { navigateTo: "Chat", workspaceId: workspace.id });
        }
      }}>
        <ListItemAvatar
          style={{
            marginTop: -2
          }}>
          <div style={{ position: 'relative' }}>
            <Avatar
              ref={avatarRef} sx={{
                bgcolor:
                  workspaceAvatarColor < 2 ? blue[400] :
                    workspaceAvatarColor < 4 ? purple[400] :
                      workspaceAvatarColor < 6 ? red[400] :
                        workspaceAvatarColor < 8 ? green[400] :
                          yellow[600]
              }}
              style={{ width: 40, height: 40, marginRight: 8 }}>
              {
                roomTitle?.substring(0, 1).toUpperCase()
              }
            </Avatar>
            {
              usersDict[workspace.tower?.contact?.id]?.online ? (
                <div style={{ position: 'absolute', bottom: 0, right: 8, width: 8, height: 8, backgroundColor: 'rgb(0, 240, 200)', borderRadius: 4 }} />
              ) : null
            }
            {
              activeCalls[workspace.id] ? (
                <div style={{ position: 'absolute', bottom: 0, right: 8 }}
                  className={'ripple'}
                >
                  <Call style={{ width: '100%', height: '100%', fill: colors.fabIcon }} />
                </div>
              ) : null
            }
          </div>
        </ListItemAvatar>
        <ListItemText
          style={{ marginTop: -4 }}
          primary={
            <Typography
              sx={{ display: "inline", fontWeight: 'bold' }}
              component="span"
              variant="caption"
              style={{ lineHeight: 1, color: colors.textPencil }}
            >
              {
                roomTitle
              }
            </Typography>
          }
          secondary={
            <div>
              {
                message?.type === 'service' ? (
                  <div style={{
                    display: 'flex',
                    color: colors.textPencil,
                    fontSize: 12
                  }}>
                    <Typography
                      ref={lastMessageRef}
                      style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        height: 20,
                        color: colors.textPencil,
                        paddingRight: 24,
                        fontSize: 11
                      }}
                      variant={'body2'}
                    >
                      {message.text}
                    </Typography>
                  </div>
                ) : message?.type === 'workspace' ? (
                  <div style={{
                    display: 'flex',
                    color: colors.textPencil,
                    fontSize: 12
                  }}>
                    <b>{usersDict[message?.authorId]?.firstName}</b>:
                    <Workspaces style={{ fill: colors.primary, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                    <Typography
                      ref={lastMessageRef}
                      sx={{ display: "inline", color: colors.primary, fontSize: 12 }}
                    >
                      Workspace
                    </Typography>
                  </div>
                ) : message?.type === 'storage' ? (
                  <div style={{
                    display: 'flex',
                    color: colors.textPencil,
                    fontSize: 12
                  }}>
                    <b>{usersDict[message?.authorId]?.firstName}</b>:
                    <SdStorage style={{ fill: colors.primary, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                    <Typography
                      ref={lastMessageRef}
                      sx={{ display: "inline", color: colors.primary, fontSize: 12 }}
                    >
                      Storage
                    </Typography>
                  </div>
                ) : message?.type === 'sticker' ? (
                  <div style={{
                    display: 'flex',
                    color: colors.textPencil,
                    fontSize: 12
                  }}>
                    <b>{usersDict[message?.authorId]?.firstName}</b>:
                    <Face2 style={{ fill: colors.primary, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                    <Typography
                      ref={lastMessageRef}
                      sx={{ display: "inline", color: colors.primary, fontSize: 12 }}
                    >
                      Sticker
                    </Typography>
                  </div>
                ) : message?.docType === 'image' ? (
                  <div style={{
                    display: 'flex',
                    color: colors.textPencil,
                    fontSize: 12
                  }}>
                    <b>{usersDict[message?.authorId]?.firstName}</b>:
                    <InsertPhotoIcon style={{ fill: colors.primary, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                    <Typography
                      ref={lastMessageRef}
                      sx={{ display: "inline", color: colors.primary, fontSize: 12 }}
                    >
                      Photo
                    </Typography>
                  </div>
                ) : message?.docType === 'audio' ? (
                  <div style={{
                    display: 'flex',
                    color: colors.textPencil,
                    fontSize: 12
                  }}>
                    <b>{usersDict[message?.authorId]?.firstName}</b>:
                    <VolumeUpIcon style={{ fill: colors.primary, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                    <Typography
                      ref={lastMessageRef}
                      sx={{ display: "inline", color: colors.primary, fontSize: 12 }}
                    >
                      Audio
                    </Typography>
                  </div>
                ) : message?.docType === 'video' ? (
                  <div style={{
                    display: 'flex',
                    color: colors.textPencil,
                    fontSize: 12
                  }}>
                    <b>{usersDict[message?.authorId]?.firstName}</b>:
                    <PlayCircleOutlineIcon style={{ fill: colors.primary, width: 16, height: 16, marginRight: 2, marginLeft: 4 }} />
                    <Typography
                      ref={lastMessageRef}
                      sx={{ display: "inline", color: colors.primary, fontSize: 12 }}
                    >
                      Video
                    </Typography>
                  </div>
                ) : message?.type === 'text' ? (
                  <Typography
                    ref={lastMessageRef}
                    style={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      height: 20,
                      color: colors.textPencil,
                      paddingRight: 24,
                      fontSize: 11
                    }}
                    variant={'body2'}
                  >
                  </Typography>
                ) : null
              }
            </div>
          }
        />
        <Typography variant={'caption'} style={{ fontSize: 11, position: 'absolute', right: 48, top: 4, color: colors.textPencil }}>
          {message?.time ? (formatDate(message.time) + ' ' + (new Date(message.time)).toTimeString().substring(0, 5)) : ''}
        </Typography>
        <Typography variant={'caption'} style={{ position: 'absolute', right: 48, bottom: 8 }}>
          {
            message?.authorId === me.id ?
              message?.status === 'created' ?
                message?.seen ?
                  (
                    <DoneAll
                      style={{
                        width: 16,
                        height: 16,
                        marginLeft: 8,
                        fill: colors.textPencil
                      }}
                    />
                  ) : (
                    <Done
                      style={{
                        width: 16,
                        height: 16,
                        marginLeft: 8,
                        fill: colors.textPencil
                      }}
                    />
                  ) : (
                  <Timelapse
                    style={{
                      width: 16,
                      height: 16,
                      marginLeft: 8,
                      fill: colors.textPencil
                    }}
                  />
                ) :
              null
          }
        </Typography>
        <IconButton style={{ width: 56, height: '100%', marginRight: -20, paddingLeft: 8, marginTop: -8 }}
          onClick={e => {
            e.stopPropagation();
            publish(uiEvents.NAVIGATE, { navigateTo: 'Room', room: workspace.room });
          }}>
          <Card variant={'contained'} sx={{ bgcolor: yellow[600] }}
            style={{ width: 32, height: 32, padding: 0, minWidth: 0, borderRadius: 16, marginTop: 0, position: 'relative' }}>
            <Widgets style={{ color: '#000', width: 18, height: 18, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
          </Card>
        </IconButton>
      </ListItem>
      <Divider variant="inset" component="li" style={{ marginTop: -4, background: colors.textPencil3 }} />
    </div >
  );
}

export default function ChatsList({ towerId }) {
  const forceUpdate = useForceUpdate();
  React.useEffect(() => {
    setupScrollListenerForContainer('chatsScrollContainer_' + towerId, '0');
    let tokenNewRoom = subscribe(updates.NEW_ROOM, () => forceUpdate());
    let tokenRoomCreated = subscribe(topics.ROOM_CREATED, () => forceUpdate());
    let tokenNewMessage = subscribe(updates.NEW_MESSAGE, () => forceUpdate());
    let tokenMessageCreationPending = subscribe(topics.MESSAGE_CREATION_PENDING, () => forceUpdate());
    let tokenMessageCreated = subscribe(topics.MESSAGE_CREATED, () => forceUpdate());
    return () => {
      unsubscribe(tokenNewRoom);
      unsubscribe(tokenRoomCreated);
      unsubscribe(tokenNewMessage);
      unsubscribe(tokenMessageCreationPending);
      unsubscribe(tokenMessageCreated);
    }
  }, []);
  let tower = towersDictById[towerId];
  return (
    <div style={{
      width: "100%",
      minHeight: '100%',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <div style={{ width: '100%', height: 232, backdropFilter: colors.backdrop, position: 'relative' }}>
        <img
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          src={tower.headerId}
        />
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <Coin Icon={Forum} key={'rooms'} isProfile={true} />
        </div>
        <Typography variant={'h6'} style={{ paddingTop: 2, paddingBottom: 2, paddingLeft: 8, paddingRight: 8, color: '#fff', borderRadius: 8, background: 'rgba(0, 0, 0, 0.35)', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, calc(-50% + 88px))' }}>
          {tower.secret?.isContact ? (tower.contact.firstName + ' ' + tower.contact.lastName) : tower.title}
        </Typography>
      </div>
      <List
        id={'chatsScrollContainer_' + towerId}
        sx={{
          width: "100%",
          bgcolor: colors.paper
        }}
        style={{
          minHeight: window.innerHeight + 'px',
        }}
      >
        <div style={{ width: '100%', height: 'auto', paddingTop: 8 }} />
        {
          roomsDict[towerId].map((room, index) => {
            let roomWorkspaces = workspacesDict[room.id];
            roomWorkspaces.sort((w1, w2) => {
              if (w1 === undefined && w2 === undefined) return 1;
              else if (w1 === undefined && w2 !== undefined) return 1;
              else if (w1 !== undefined && w2 === undefined) return -1;
              else if (w1 !== undefined && w2 !== undefined) {
                if (w1.lastMessage?.time > w2.lastMessage?.time) return -1;
                else if (w1.lastMessage?.time < w2.lastMessage?.time) return 1;
                else return 0;
              }
            });
            if (roomWorkspaces.length > 0) {
              return <ChatItem workspace={roomWorkspaces[0]} />;
            } else {
              return null;
            }
          })
        }
        <div style={{ width: '100%', height: 112 }} />
      </List>
    </div>
  );
}
