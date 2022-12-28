import {
  Avatar,
  Fab,
  Fade,
  Grid,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import React, { Component, useEffect, useRef } from "react";
import {
  Add,
  ArrowBack,
  Call,
  CameraAlt,
  ChatBubble,
  Close,
  Delete,
  Description,
  Edit,
  EmojiEmotions,
  Forward,
  InsertPhoto,
  Mic,
  PlayCircleOutline,
  Reply,
  SdStorage,
  Send,
  Videocam,
  VolumeUp,
  Workspaces,
} from "@mui/icons-material";
import { colors, themeId } from "../../config/colors";
import { publish, subscribe, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import topics from '../../core/events/topics.json';
import { createTextMessage, trySendingFileMessage, tryFinalizingFileMessage, createStickerMessage, fetchMessages } from '../../core/callables/messenger';
import { uploadFile } from "../../core/callables/file";
import { fetchCurrentRoomId, fetchCurrentWorkspaceId } from "../../core/storage/auth";
import { checkElementAvailable } from '../../utils/UiAttacher';
import { enterRoom } from "../../core/callables/auth";
import { dbFindWorkspaceById } from "../../core/storage/spaces";
import updates from '../../core/network/updates.json';
import { createInteraction } from "../../core/callables/interactions";
import emojis from '../../core/storage/emojis';
import Recorder from "../../components/Recorder";
import { messagesDict, me, workspacesDictById, interactionsDict, usersDict, roomsDictById, towersDictById, workspacesDict, messagesDictById, activeCalls } from "../../core/memory";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import LottieSticker from '../../components/LottieSticker';
import stickers from '../../core/storage/stickers';
import Face2 from "@mui/icons-material/Face2";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { setupScrollListenerForContainer } from "../../utils/ScrollHelper";
import { dbUpdateMessageById } from "../../core/storage/messenger";
import { socket } from "../../core/network/socket";
import { readUserById } from "../../core/callables/users";
import formatDate from '../../utils/DateFormatter';
import 'emoji-mart-virtualized/css/emoji-mart.css'
import { Picker } from 'emoji-mart-virtualized'
import MessageDocPicker from "../../components/MessageDocPicker";
import MessageSentAudio from '../../data/audios/message-sent.mp3';
import { VariableSizeList } from 'react-window';
import { replaceAll, hideKeyboard } from '../../index';
import { MessageWrapper } from '../../components/Message';
import BaseSection from "../../utils/SectionEssentials";
import Messages from "../../components/Messages";

let uploadingFiles = {};

export let closeChat = () => { };
export let checkEmojiBeingOpen = () => { };

const messageSentAudio = new Audio(MessageSentAudio);
const messageReceivedAudio = new Audio(MessageSentAudio);

class Chat extends BaseSection {
  prevRoomId = undefined;
  prevWorkspaceId = undefined;
  typingTimeout = undefined
  WallpaperWrapper = undefined
  messageKeyStore = {}
  user = undefined
  workspace = undefined
  room = undefined
  reservedInteractionCreationMessage = undefined;
  userChecker = undefined;
  shared = {};
  uploadAndCreateFileMessage(file) {
    trySendingFileMessage('a new file', ['0'], file, this.state.replyTo ? this.state.replyTo.id : '0', '0', '0', (localMessage, rev) => {
      this.setState({ replyTo: undefined });
      const tag = localMessage.id;
      localMessage.rev = rev;
      uploadingFiles[tag] = { file: file, messageId: localMessage.id, progress: 0 };
      setTimeout(() => {
        this.scrollToBottom();
      }, 250);
      uploadFile(tag, file, fetchCurrentRoomId(), true, (response) => {
        delete uploadingFiles[tag];
        let localMessage = messagesDictById[tag];
        localMessage.fileIds = [response.document.id];
        localMessage.docType = response.document.fileType;
        tryFinalizingFileMessage(localMessage, localMessage.rev, message => {
          console.log(message);
        });
      });
    });
  }
  scrollToBottom() {
    if (this.shared?.scrollToBottom) {
      this.shared.scrollToBottom();
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      emojiView: false,
      recorderView: false,
      stickerView: false,
      open: false,
      typing: false,
      peerStatus: '',
      replyTo: undefined
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.uploadAndCreateFileMessage = this.uploadAndCreateFileMessage.bind(this);
  }
  componentDidMount() {
    super.componentDidMount();
    this.prevRoomId = fetchCurrentRoomId();
    this.prevWorkspaceId = fetchCurrentWorkspaceId();
    checkEmojiBeingOpen = () => {
      if (this.state.emojiView) {
        this.setState({ emojiView: false, stickerView: false });
        return true;
      }
      return false;
    }
    this.wire(updates.ON_CONTACT_ONLINE_STATE_CHANGE, ({ userId, peerStatus }) => {
      if (userId === this.props.user?.id) {
        this.setState({ peerStatus: peerStatus });
      }
    });
    if (this.props.user) {
      readUserById(this.props.user.id, (user) => {
        let onlineState = user.onlineState;
        let lastSeen = user.lastSeen;
        let lastSeenString = '';
        if (!onlineState) {
          lastSeenString = 'last seen ' + (lastSeen === 0 ? 'prehistory' : (formatDate(lastSeen) + ' ' + new Date(lastSeen).toTimeString().substring(0, 5)));
        } else {
          lastSeenString = 'online';
        }
        this.setState({ peerStatus: lastSeenString });
      });
    }
    if (themeId === 'LIGHT') {
      import("./chat-wallpaper-light").then(comp => {
        this.WallpaperWrapper = comp.default;
        this.forceUpdate();
      });
    } else {
      import("./chat-wallpaper-dark").then(comp => {
        this.WallpaperWrapper = comp.default;
        this.forceUpdate();
      });
    }
    this.workspace = workspacesDictById[this.props.workspaceId];
    console.log(this.workspace);
    if (this.workspace) {
      this.room = this.workspace.room;
      enterRoom(this.workspace.roomId, false, this.workspace.id);
    }
    this.wire(topics.MESSAGE_CREATION_PENDING, ({ message }) => {
      this.messageKeyStore[message.id] = Math.random();
      this.forceUpdate();
      if (message.authorId === me.id) {
        this.scrollToBottom();
      }
    });
    this.wire(topics.MESSAGE_CREATED, ({ oldMessageId, message }) => {
      if (message.wid === this.workspace.id) {
        delete this.messageKeyStore[oldMessageId];
        this.messageKeyStore[message.id] = Math.random();
        this.forceUpdate();
        messageSentAudio.play();
      }
    });
    this.wire(updates.NEW_MESSAGE, ({ message }) => {
      if (message.wid === this.workspace.id) {
        this.messageKeyStore[message.id] = Math.random();
        this.forceUpdate();
        messageReceivedAudio.play();
        checkElementAvailable('chatScrollContainer_' + this.props.tag, () => {
          let scrollContainer = document.getElementById('chatScrollContainer_' + this.props.tag);
          if (scrollContainer.scrollHeight - scrollContainer.scrollTop - window.innerHeight < 300) {
            this.scrollToBottom();
          }
        });
      }
    });
    this.wire(updates.MESSAGE_SEEN, ({ message }) => {
      if (message.wid === this.workspace.id) {
        this.messageKeyStore[message.id] = Math.random();
        this.forceUpdate();
      }
    });
    this.wire(topics.ENTERED_WORKSPACE, () => {
      if (messagesDict[this.workspace.id].length === 0) {
        fetchMessages(messages => {
          this.forceUpdate();
          this.scrollToBottom();
        });
      } else {
        this.scrollToBottom();
      }
      if (this.reservedInteractionCreationMessage) {
        if (this.reservedInteractionCreationMessage.type === 'text') {
          createTextMessage(this.state.text, this.state.replyTo ? this.state.replyTo.id : '0', '0', '0', message => { });
          this.setState({ stickerView: false, emojiView: false, text: '', replyTo: undefined });
          this.scrollToBottom();
        } else if (this.reservedInteractionCreationMessage.type === 'file') {
          if (this.reservedInteractionCreationMessage.isVoice) {
            this.setState({ recorderView: false, replyTo: undefined });
          } else {
            this.setState({ replyTo: undefined });
          }
          this.uploadAndCreateFileMessage(this.reservedInteractionCreationMessage.file);
          document.getElementById(`chatFileOpener_${this.props.tag}`).value = null;
          this.scrollToBottom();
        } else if (this.reservedInteractionCreationMessage.type === 'sticker') {
          createStickerMessage(this.reservedInteractionCreationMessage.stickerId, this.reservedInteractionCreationMessage.replyTo, '0', '0');
          this.setState({ stickerView: false, emojiView: false, replyTo: undefined });
          this.scrollToBottom();
          hideKeyboard(document.getElementById(`messageInput-${this.props.tag}`));
        }
        this.reservedInteractionCreationMessage = undefined;
      }
    });
    this.wire(uiEvents.FILE_TRANSFER_PROGRESS, ({ tag, progress, current, total }) => {
      messagesDictById[tag] && (messagesDictById[tag].progress = { progress, current, total });
      dbUpdateMessageById(tag, messagesDictById[tag]);
      this.messageKeyStore[tag] = Math.random();
      this.forceUpdate();
    });
    this.wire(updates.ON_ACTIVE_CALLS_SYNC, () => {
      this.forceUpdate();
    });
    this.wire(uiEvents.RESERVE_MESSAGE_FOR_REPLY, ({ message }) => {
      this.setState({ replyTo: message });
    });
    socket.off('on-type');
    socket.on('on-type', ({ workspaceId }) => {
      if (this.workspace?.id === workspaceId) {
        this.setState({ typing: true });
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
          this.setState({ typing: false });
        }, 1000);
      }
    });
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.userChecker) {
      clearInterval(this.userChecker);
    }
    if (this.props.preRoomId) {
      enterRoom(this.prevRoomId, false, this.prevWorkspaceId);
    }
  }
  render() {
    let Wallpaper = this.WallpaperWrapper;
    let { emojiView, recorderView, stickerView, text } = this.state;
    let workspaceAvatarColor = this.workspace?.avatarBackColor;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 3
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: this.state.open ? (this.props.sheet ? `translateY(0px)` : `translateX(0px)`) : (this.props.sheet ? `translateY(400px)` : `translateX(300px)`),
          opacity: this.state.open ? 1 : 0,
          transition: 'transform 0.25s, opacity 0.25s'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            zIndex: 2,
            position: 'absolute',
            left: 0,
            top: 0
          }}>
            <input type='file' id={`chatFileOpener_${this.props.tag}`} style={{ display: 'none', position: 'relative', zIndex: 99999 }} onChange={e => {
              let file = e.target.files[0];
              if (this.props.user && !interactionsDict[this.props.user.id]) {
                createInteraction(this.props.user.id, (interaction, ws, user) => {
                  this.workspace = ws;
                  this.reservedInteractionCreationMessage = { type: 'file', file: file };
                  enterRoom(this.workspace.roomId, false, this.workspace.id);
                });
              } else {
                this.uploadAndCreateFileMessage(file);
                document.getElementById(`chatFileOpener_${this.props.tag}`).value = null;
                this.scrollToBottom();
              }
            }} />
            <div
              style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}
              onClick={e => {
                if (this.props.sheet) {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState({ open: false });
                  this.props.onSheetHide();
                  setTimeout(() => {
                    this.props.onSheetClose();
                  }, 250);
                }
              }}>
              <div style={{
                width: '100%',
                height: this.props.sheet ? 650 : '100%',
                position: 'absolute',
                top: this.props.sheet ? 'calc(100% - 650px)' : 0,
                zIndex: 3
              }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <div
                    style={{
                      backgroundColor: colors.semiTransparentPaper,
                      backdropFilter: colors.backdrop,
                      height: this.props.sheet ? 80 : (80 + comsoToolbarHeight),
                      borderRadius: this.props.sheet ? '24px 24px 0px 0px' : 0
                    }}
                  >
                    <Toolbar style={{ transform: this.props.sheet ? 'translateY(0px)' : `translateY(${comsoToolbarHeight}px)` }}>
                      <IconButton onClick={() => {
                        if (this.props.sheet) {
                          this.setState({ open: false });
                          this.props.onSheetHide();
                          setTimeout(() => {
                            this.props.onSheetClose();
                          }, 250);
                        } else {
                          this.close(true);
                        }
                      }}>
                        {this.props.sheet ? <Close style={{ fill: colors.textPencil }} /> : <ArrowBack style={{ fill: colors.textPencil }} />}
                      </IconButton>
                      <Avatar
                        sx={{
                          bgcolor:
                            workspaceAvatarColor < 2 ? blue[400] :
                              workspaceAvatarColor < 4 ? purple[400] :
                                workspaceAvatarColor < 6 ? red[400] :
                                  workspaceAvatarColor < 8 ? green[400] :
                                    yellow[600]
                        }}
                        alt={this.props.user !== undefined ? (this.props.user.firstName + ' ' + this.props.user.lastName) : this.workspace ? this.workspace.title : '-'}
                        style={{ width: 40, height: 40 }}
                        onClick={() => {
                          if (!this.props.sheet) {
                            if (this.props.user !== undefined) {
                              publish(uiEvents.NAVIGATE, { navigateTo: "UserProfile", user: this.props.user });
                            } else if (workspacesDictById[fetchCurrentWorkspaceId()] !== undefined) {
                              publish(uiEvents.NAVIGATE, { navigateTo: "RoomProfile", room: this.room, workspace: this.workspace, showSwitch: true });
                            }
                          }
                        }}
                      >
                        {
                          this.props.sheet ? (
                            <ChatBubble style={{ fill: '#fff', width: 20, height: 20 }} />
                          ) : (this.props.user !== undefined ? (this.props.user.firstName + ' ' + this.props.user.lastName) : this.workspace ? this.workspace.title : '-').substring(0, 1).toUpperCase()
                        }
                      </Avatar>
                      {
                        this.props.sheet ? (
                          <div
                            style={{
                              flex: 1,
                              marginLeft: 8,
                            }}>
                            <Typography
                              style={{
                                textAlign: "left",
                                color: colors.textPencil,
                              }}
                            >
                              {this.props.user !== undefined ? (this.props.user.firstName + ' ' + this.props.user.lastName) : this.workspace ? this.workspace.title : '-'}
                            </Typography>
                            <Typography
                              style={{
                                textAlign: "left",
                                color: colors.textPencil,
                              }}
                              variant={"subtitle2"}
                            >
                              Chat
                            </Typography>
                          </div>
                        ) : (
                          <div
                            style={{
                              flex: 1,
                              marginLeft: 8,
                            }}
                            onClick={() => {
                              if (this.props.user !== undefined) {
                                publish(uiEvents.NAVIGATE, { navigateTo: "UserProfile", user: this.props.user });
                              } else if (workspacesDictById[fetchCurrentWorkspaceId()] !== undefined) {
                                publish(uiEvents.NAVIGATE, { navigateTo: "RoomProfile", room: this.room, workspace: this.workspace, showSwitch: true });
                              }
                            }}>
                            <Typography
                              style={{
                                textAlign: "left",
                                color: colors.textPencil,
                              }}
                            >
                              {this.props.user !== undefined ? (this.props.user.firstName + ' ' + this.props.user.lastName) : this.workspace ? this.workspace.title : '-'}
                            </Typography>
                            <Typography
                              style={{
                                textAlign: "left",
                                color: colors.textPencil,
                              }}
                              variant={"subtitle2"}
                            >
                              {this.state.typing ? 'is typing...' : this.state.peerStatus}
                            </Typography>
                          </div>
                        )
                      }
                      {
                        this.props.sheet ? null : (
                          <IconButton
                            style={{ opacity: this.workspace ? 1 : 0.5 }}
                            disabled={!this.workspace}
                            onClick={() => {
                              if (this.props.user === undefined) {
                                dbFindWorkspaceById(this.props.workspaceId).then(ws => {
                                  publish(uiEvents.OPEN_CALL, { workspace: ws });
                                });
                              } else {
                                createInteraction(this.props.user.id, (interaction, ws, user) => {
                                  publish(uiEvents.OPEN_CALL, { workspace: ws, user: this.props.user });
                                });
                              }
                            }}>
                            {
                              activeCalls[this.workspace?.id] !== undefined ? (
                                <Call style={{ fill: colors.primary }} />
                              ) : (
                                <Call style={{ fill: colors.textPencil }} />
                              )
                            }
                          </IconButton>
                        )
                      }
                      {
                        this.props.sheet ? null : (
                          <IconButton
                            style={{ opacity: this.workspace ? 1 : 0.5 }}
                            disabled={!this.workspace}
                            onClick={() => {
                              publish(uiEvents.NAVIGATE, { navigateTo: 'Workspace' });
                            }}>
                            <Workspaces style={{ fill: colors.textPencil }} />
                          </IconButton>
                        )
                      }
                      <div style={{ width: 40, height: 40 }} />
                    </Toolbar>
                  </div>
                  <Paper
                    elevation={6}
                    style={{
                      borderRadius: "24px 24px 0px 0px",
                      height: `calc(100% - 56px)`,
                      width: "100%",
                      position: "absolute",
                      left: 0,
                      top: this.props.sheet ? 56 : (56 + comsoToolbarHeight),
                      background: 'transparent'
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "24px 24px 0px 0px",
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      {
                        Wallpaper ? <Wallpaper /> : null
                      }
                    </div>
                    {
                      this.workspace ? (
                        <Messages shared={this.shared} messages={messagesDict[this.workspace.id]} tag={this.tag} workspace={this.workspace} messageKeyStore={this.messageKeyStore} />
                      ) : null
                    }
                  </Paper>
                  {
                    this.state.replyTo ? (
                      <Paper style={{
                        width: 'caalc(100% - 48px)',
                        backgroundColor: colors.floatingCard,
                        backdropFilter: colors.backdrop,
                        borderRadius: 24,
                        display: "flex",
                        position: "fixed",
                        left: 24,
                        right: 24,
                        bottom: emojiView ? (425 + 48 + 56) : 56,
                        zIndex: 2,
                        padding: 16
                      }}>
                        <div style={{ position: 'absolute', top: 16, bottom: 16, width: 4, backgroundColor: colors.primary, borderRadius: 2 }} />
                        <div style={{ width: 12, height: 16 }} />
                        <div>
                          {
                            this.state.replyTo.type === 'workspace' ? (
                              <div style={{ display: 'flex' }}>
                                <Workspaces style={{ fill: colors.primary, width: 20, height: 20, marginRight: 4 }} />
                                <Typography
                                  sx={{ display: "inline", color: colors.primary }}
                                  variant="body2"
                                  style={{
                                    width: window.innerWidth - 148 - 28,
                                  }}
                                >
                                  Workspace
                                </Typography>
                              </div>
                            ) : this.state.replyTo.type === 'storage' ? (
                              <div style={{ display: 'flex' }}>
                                <SdStorage style={{ fill: colors.primary, width: 20, height: 20, marginRight: 4 }} />
                                <Typography
                                  sx={{ display: "inline", color: colors.primary }}
                                  variant="body2"
                                  style={{
                                    width: window.innerWidth - 148 - 28,
                                  }}
                                >
                                  Filespace
                                </Typography>
                              </div>
                            ) : this.state.replyTo.type === 'sticker' ? (
                              <div style={{ display: 'flex' }}>
                                <Face2 style={{ fill: colors.primary, width: 20, height: 20, marginRight: 4 }} />
                                <Typography
                                  sx={{ display: "inline", color: colors.primary }}
                                  variant="body2"
                                  style={{
                                    width: window.innerWidth - 148 - 28,
                                  }}
                                >
                                  Sticker
                                </Typography>
                              </div>
                            ) : this.state.replyTo?.docType === 'image' ? (
                              <div style={{ display: 'flex' }}>
                                <InsertPhoto style={{ fill: colors.primary, width: 20, height: 20, marginRight: 4 }} />
                                <Typography
                                  sx={{
                                    display: "inline",
                                    color: colors.primary,
                                    width: window.innerWidth - 148 - 28,
                                  }}
                                  variant="body2"
                                >
                                  Photo
                                </Typography>
                              </div>
                            ) : this.state.replyTo?.docType === 'audio' ? (
                              <div style={{ display: 'flex' }}>
                                <VolumeUp style={{ fill: colors.primary, width: 20, height: 20, marginRight: 4 }} />
                                <Typography
                                  sx={{
                                    display: "inline",
                                    color: colors.primary,
                                    width: window.innerWidth - 148 - 28,
                                  }}
                                  variant="body2"
                                >
                                  Audio
                                </Typography>
                              </div>
                            ) : this.state.replyTo?.docType === 'video' ? (
                              <div style={{ display: 'flex' }}>
                                <PlayCircleOutline style={{ fill: colors.primary, width: 20, height: 20, marginRight: 4 }} />
                                <Typography
                                  sx={{
                                    display: "inline",
                                    color: colors.primary,
                                    width: window.innerWidth - 148 - 28,
                                  }}
                                  variant="body2"
                                >
                                  Video
                                </Typography>
                              </div>
                            ) : this.state.replyTo?.type === 'text' ? (
                              <Typography
                                style={{
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  width: window.innerWidth - 148,
                                  height: 20,
                                  color: colors.textPencil
                                }}
                                variant={'body2'}
                                dangerouslySetInnerHTML={{
                                  __html: (() => {
                                    let text = this.state.replyTo?.text;
                                    if (text) {
                                      Object.keys(emojis).forEach(key => {
                                        text = replaceAll(text, `:${key}:`, `<img src='${emojis[key]}' alt='${key}' width='18' height='18' />`);
                                      });
                                    }
                                    return text;
                                  })()
                                }}
                              >
                              </Typography>
                            ) : null
                          }
                        </div>
                        <Fab size={'small'} sx={{ bgcolor: yellow[600] }} style={{ marginLeft: 16 }} onClick={() => this.setState({ replyTo: undefined })}>
                          <Close />
                        </Fab>
                      </Paper>
                    ) : null
                  }
                  <Paper
                    style={{
                      width: "100%",
                      height: 'auto',
                      backgroundColor: colors.floatingCard,
                      backdropFilter: colors.backdrop,
                      borderRadius: 0,
                      display: "flex",
                      position: "fixed",
                      left: 0,
                      bottom: emojiView ? 425 + 48 : 0,
                      zIndex: 2
                    }}
                  >
                    <IconButton onClick={() => {
                      hideKeyboard(document.getElementById(`messageInput-${this.props.tag}`));
                      this.setState({ emojiView: !this.state.emojiView, stickerView: false, recorderView: false }, () => {
                        this.scrollToBottom();
                      });
                    }}>
                      <EmojiEmotions style={{ fill: colors.textPencil }} />
                    </IconButton>
                    <InputBase multiline maxRows={4} id={`messageInput-${this.props.tag}`}
                      placeholder="Write Message..." style={{ flex: 1, color: colors.textPencil }}
                      value={this.state.text} onChange={e => {
                        socket.emit('typing', {});
                        this.setState({ text: e.target.value });
                      }}
                    />
                    <MessageDocPicker onVoiceClicked={() => {
                      hideKeyboard(document.getElementById(`messageInput-${this.props.tag}`));
                      this.setState({ recorderView: !this.state.recorderView, emojiView: false, stickerView: false });
                    }} onSpaceClicked={() => {
                      hideKeyboard(document.getElementById(`messageInput-${this.props.tag}`));
                      this.setState({ recorderView: false, emojiView: false, stickerView: false });
                      publish(uiEvents.NAVIGATE, { navigateTo: 'SpacePicker', room: this.room });
                    }} />
                    <IconButton onClick={() => {
                      hideKeyboard(document.getElementById(`messageInput-${this.props.tag}`));
                      document.getElementById(`chatFileOpener_${this.props.tag}`).click();
                    }}>
                      <Description style={{ fill: colors.textPencil }} />
                    </IconButton>
                    <IconButton onClick={() => {
                      if (text.length > 0) {
                        if (!this.workspace && this.props.user && !interactionsDict[this.props.user.id]) {
                          createInteraction(this.props.user.id, (interaction, ws, user) => {
                            this.workspace = ws;
                            this.reservedInteractionCreationMessage = { type: 'text' };
                            enterRoom(this.workspace.roomId, false, this.workspace.id);
                          });
                        } else {
                          createTextMessage(text, this.state.replyTo ? this.state.replyTo.id : '0', '0', '0', message => { });
                          this.setState({ stickerView: false, emojiView: false, text: '', replyTo: undefined });
                          this.scrollToBottom();
                        }
                      }
                    }}>
                      <Send style={{ fill: colors.textPencil }} />
                    </IconButton>
                  </Paper>
                  <Zoom in={emojiView}>
                    <div style={{ width: '100%', position: 'fixed', height: 425 + 48, bottom: 0, zIndex: 3, background: colors.paper }}>
                      <div style={{ width: '100%', height: 425, position: 'relative' }}>
                        {
                          stickerView ? (
                            <div
                              style={{
                                width: '100%', height: 400, position: 'fixed',
                                display: 'flex', flexWrap: 'wrap', padding: 16
                              }}>
                              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                {
                                  <Grid container spacing={2} style={{ marginTop: 64 }}>
                                    <Grid item xs={4}>
                                      {
                                        stickers.map(key => (
                                          <LottieSticker stickerKey={key} size={window.innerWidth / 4 - 4} clickCallback={() => {
                                            if (this.props.user && !interactionsDict[this.props.user.id]) {
                                              createInteraction(this.props.user.id, (interaction, ws, user) => {
                                                this.workspace = ws;
                                                this.reservedInteractionCreationMessage = { type: 'sticker', stickerId: key };
                                                enterRoom(this.workspace.roomId, false, this.workspace.id);
                                              });
                                            } else {
                                              createStickerMessage(key, this.state.replyTo ? this.state.replyTo.id : '0', '0', '0');
                                              this.setState({ stickerView: false, emojiView: false, replyTo: undefined });
                                              this.scrollToBottom();
                                              hideKeyboard(document.getElementById(`messageInput-${this.props.tag}`));
                                            }
                                          }} />
                                        ))
                                      }
                                    </Grid>
                                  </Grid>
                                }
                              </div>
                            </div>
                          ) : (
                            <div style={{ width: '100%' }}>
                              <Picker native={true} set={'apple'} style={{ width: '100%', height: '100%', position: 'absolute', left: 0, right: 0 }} onSelect={emoji => {
                                let el = document.getElementById(`messageInput-${this.props.tag}`);
                                let newText = `${emoji.native}`;
                                const start = el.selectionStart;
                                const end = el.selectionEnd;
                                const before = text.substring(0, start);
                                const after = text.substring(end, text.length);
                                this.setState({ text: (before + newText + after) });
                                setTimeout(() => {
                                  el.selectionStart = el.selectionEnd = start + newText.length;
                                }, 500);
                              }} theme={themeId === 'LIGHT' ? 'light' : 'dark'} />
                            </div>
                          )
                        }
                      </div>
                      <ToggleButtonGroup
                        value={(stickerView && emojiView) ? 0 : 1}
                        exclusive
                        style={{
                          border: 'none',
                          position: 'absolute',
                          zIndex: 4,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'transparent'

                        }}
                        onChange={(event, newPage) => {
                          if (newPage === 0) {
                            this.setState({ emojiView: true, stickerView: true });
                          } else {
                            this.setState({ emojiView: true, stickerView: false });
                          }
                        }}
                      >
                        <ToggleButton value={0} style={{ color: (stickerView && emojiView) ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '16px 0px 0px 16px' }}>Stickers</ToggleButton>
                        <ToggleButton value={1} style={{ color: (!stickerView && emojiView) ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '0px 16px 16px 0px' }}>Emojis</ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </Zoom>
                  <Paper style={{
                    transform: 'translateY(500px)',
                    opacity: emojiView ? 1 : 0,
                    transition: 'transform 0.25s, opacity 0.25s',
                    width: 'calc(100% - 64px)', height: 300, borderRadius: 16, position: 'fixed',
                    left: 16, bottom: 24 + 48 + 16, backgroundColor: colors.floatingCard,
                    backdropFilter: 'blur(10px)', display: 'flex', flexWrap: 'wrap', padding: 16,
                    zIndex: 2
                  }}>
                    {
                      Object.keys(emojis).map(key => (
                        <img style={{ margin: 8 }} src={emojis[key]} alt={key} width="48" height="48" onClick={() => {
                          let el = document.getElementById(`messageInput-${this.props.tag}`);
                          let newText = `:${key}:`;
                          const start = el.selectionStart;
                          const end = el.selectionEnd;
                          const before = text.substring(0, start);
                          const after = text.substring(end, text.length);
                          this.setState({ text: (before + newText + after) });
                          setTimeout(() => {
                            el.selectionStart = el.selectionEnd = start + newText.length;
                          }, 500);
                        }} />
                      ))
                    }
                  </Paper>
                  <Paper style={{
                    transform: recorderView ? 'translateY(0px)' : 'translateY(500px)',
                    opacity: recorderView ? 1 : 0,
                    transition: 'transform 0.25s, opacity 0.25s',
                    width: 'calc(100% - 32px)', height: 112, borderRadius: 16, position: 'fixed',
                    left: 16, bottom: 48 + 16, backgroundColor: colors.floatingCard,
                    backdropFilter: 'blur(10px)', display: 'flex', flexWrap: 'wrap', paddingLeft: 16,
                    paddingRight: 16, paddingBottom: 8, paddingTop: 8, zIndex: 2
                  }}>
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <Recorder compKey={this.props.tag} voiceRecorded={blob => {
                        if (this.props.user && !interactionsDict[this.props.user.id]) {
                          createInteraction(this.props.user.id, (interaction, ws, user) => {
                            this.workspace = ws;
                            this.reservedInteractionCreationMessage = { type: 'file', file: blob, isVoice: true };
                            enterRoom(this.workspace.roomId, false, this.workspace.id);
                          });
                        } else {
                          this.setState({ recorderView: false });
                          this.uploadAndCreateFileMessage(blob);
                        }
                      }} />
                    </div>
                    <Fab size="small" sx={{ bgcolor: yellow[600] }} style={{ position: 'absolute', right: 8, top: 8 }} onClick={() => {
                      this.setState({ recorderView: false });
                    }}>
                      <Close />
                    </Fab>
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
