import {
    Avatar,
    CircularProgress,
    Divider,
    Fab,
    Fade,
    Grid,
    IconButton,
    InputBase,
    ListItem,
    ListItemIcon,
    MenuItem,
    Paper,
    Toolbar,
    Typography,
} from "@mui/material";
import React, { Component, useEffect } from "react";
import {
    ArrowBack,
    Call,
    CameraAlt,
    ChatBubble,
    Close,
    Delete,
    Description,
    Done,
    DoneAll,
    Edit,
    EmojiEmotions,
    Forward,
    Mic,
    MoreVert,
    PlayArrow,
    Replay,
    Reply,
    SdStorage,
    Send,
    Timelapse,
    Videocam,
    Workspaces,
} from "@mui/icons-material";
import { colors, themeId } from "../../config/colors";
import { publish, subscribe, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import topics from '../../core/events/topics.json';
import { createTextMessage, seeMessage, trySendingFileMessage, tryFinalizingFileMessage, createStickerMessage, resendMessage } from '../../core/callables/messenger';
import useForceUpdate from "../../utils/ForceUpdate";
import { downloadAudioCover, downloadPreview, generateFileLink, generatePreviewLink, readDocById, uploadFile } from "../../core/callables/file";
import { fetchCurrentRoomId, fetchCurrentWorkspaceId } from "../../core/storage/auth";
import { checkElementAvailable } from '../../utils/UiAttacher';
import { enterRoom, enterWorkspace } from "../../core/callables/auth";
import { dbFindRoomById, dbFindWorkspaceById } from "../../core/storage/spaces";
import updates from '../../core/network/updates.json';
import { createInteraction } from "../../core/callables/interactions";
import generatePage from "../../utils/PageGenerator";
import { dbFindUserById } from "../../core/storage/users";
import { WaveSurferBox } from "../../components/Wavesurfer";
import emojis from '../../core/storage/emojis';
import Recorder from "../../components/Recorder";
import { messagesDict, me, usersDict, workspacesDictById, messagesDictById, filespacesDict, filespacesDictById, docsDictById, roomsDictById } from "../../core/memory";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import LottieSticker from '../../components/LottieSticker';
import stickers from '../../core/storage/stickers';
import Face2 from "@mui/icons-material/Face2";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { dbFetchDocById } from "../../core/storage/file";
import { getMeta } from "../../core/utils/meta";
import { dbUpdateMessage, dbUpdateMessageById } from "../../core/storage/messenger";
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUp from "@mui/icons-material/VolumeUp";
import InsertPhoto from "@mui/icons-material/InsertPhoto";
import PlayCircleOutline from "@mui/icons-material/PlayCircleOutline";
import './bubble.scss';
import { replaceAll } from '../../index';
import formatDate from "../../utils/DateFormatter";
import { readUserById } from "../../core/callables/users";

const fetchView = (message, roomId) => {
    return new Promise((resolve, _) => {
        if (message.preview === undefined) {
            if (message.docType === 'audio') {
                downloadPreview(message.docType, message.fileIds[0], roomId, res => {
                    message.preview = res;
                    resolve();
                });
            } else {
                resolve();
            }
        } else {
            resolve();
        }
    });
}

export class MessageWrapper extends Component {
    constructor(props) {
        super(props);
        this.messageRef = React.createRef();
        this.clickCallback = this.clickCallback.bind(this);
    }
    clickCallback() {
        let { msg } = this.props;
        var rect = this.messageRef.current.getBoundingClientRect();
        publish(uiEvents.SHOW_POPUP_MENU, {
            anchorPosition: { x: rect.left, y: rect.top }, items: [
                msg.status === 'pending' ? (
                    <MenuItem style={{ color: colors.textPencil }} onClick={() => {
                        publish(uiEvents.CLOSE_POPUP_MENU, {});
                        resendMessage(msg, () => this.forceUpdate());
                    }}>
                        <ListItemIcon>
                            <Replay style={{ fill: colors.textPencil }} fontSize="small" />
                        </ListItemIcon>
                        Retry Sending
                    </MenuItem>
                ) : null,
                <MenuItem style={{ color: colors.textPencil }} onClick={() => {
                    publish(uiEvents.CLOSE_POPUP_MENU, {});
                    publish(uiEvents.RESERVE_MESSAGE_FOR_REPLY, { message: msg });
                }}>
                    <ListItemIcon>
                        <Reply style={{ fill: colors.textPencil }} fontSize="small" />
                    </ListItemIcon>
                    Reply
                </MenuItem>,
                <MenuItem style={{ color: colors.textPencil }} onClick={() => {
                    publish(uiEvents.CLOSE_POPUP_MENU, {});
                }}>
                    <ListItemIcon>
                        <Forward style={{ fill: colors.textPencil }} fontSize="small" />
                    </ListItemIcon>
                    Forward
                </MenuItem>,
                <MenuItem style={{ color: colors.textPencil }} onClick={() => {
                    publish(uiEvents.CLOSE_POPUP_MENU, {});
                }}>
                    <ListItemIcon>
                        <Edit style={{ fill: colors.textPencil }} fontSize="small" />
                    </ListItemIcon>
                    Edit
                </MenuItem>,
                <MenuItem style={{ color: colors.textPencil }} onClick={() => {
                    publish(uiEvents.CLOSE_POPUP_MENU, {});
                }}>
                    <ListItemIcon>
                        <Delete style={{ fill: colors.textPencil }} fontSize="small" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            ]
        });
    }
    render() {
        let { msg, i, tag, workspace, messageKeyStore } = this.props;
        let avatarBackColor = usersDict[msg.authorId]?.avatarBackColor;
        return (
            <div style={{ width: "100%", display: "flex" }} onClick={this.clickCallback}>
                <Avatar
                    onClick={e => {
                        e.stopPropagation();
                        publish(uiEvents.NAVIGATE, { navigateTo: 'UserProfile', user: usersDict[msg.authorId] });
                    }}
                    style={{
                        position: "relative",
                        zIndex: 2,
                        marginTop: "auto",
                        marginBottom: 8,
                        visibility: (msg.authorId !== me.id && (
                            (messagesDict[workspace.id][i + 1] && msg.authorId !== messagesDict[workspace.id][i + 1].authorId) ||
                            (!messagesDict[workspace.id][i + 1])) && msg.type !== 'service') ? 'visible' : 'hidden'
                    }}
                    sx={{
                        bgcolor: avatarBackColor < 2 ? blue[400] :
                            avatarBackColor < 4 ? purple[400] :
                                avatarBackColor < 6 ? red[400] :
                                    avatarBackColor < 8 ? green[400] :
                                        yellow[600]
                    }}
                >
                    {usersDict[msg.authorId]?.firstName?.substring(0, 1).toUpperCase()}
                </Avatar>
                {
                    msg.type === 'service' ? (
                        <ServiceMessage message={msg} />
                    ) : msg.type === 'text' ? (
                        <TextMessage
                            wrapperRef={this.messageRef}
                            key={messageKeyStore[msg.id]}
                            pageKey={tag}
                            author={usersDict[msg.authorId]}
                            message={msg}
                            prevMessage={messagesDict[workspace.id][i - 1]}
                        />
                    ) : msg.type === 'sticker' ? (
                        <StickerMessage
                            wrapperRef={this.messageRef}
                            key={`message_${msg.id}`}
                            pageKey={tag}
                            author={usersDict[msg.authorId]}
                            message={msg}
                            prevMessage={messagesDict[workspace.id][i - 1]}
                        />
                    ) : msg.type === 'workspace' ? (
                        <WorkspaceMessage
                            wrapperRef={this.messageRef}
                            key={messageKeyStore[msg.id]}
                            pageKey={tag}
                            author={usersDict[msg.authorId]}
                            message={msg}
                            prevMessage={messagesDict[workspace.id][i - 1]}
                        />
                    ) : msg.type === 'storage' ? (
                        <FilespaceMessage
                            wrapperRef={this.messageRef}
                            key={messageKeyStore[msg.id]}
                            pageKey={tag}
                            author={usersDict[msg.authorId]}
                            message={msg}
                            prevMessage={messagesDict[workspace.id][i - 1]}
                        />
                    ) : (
                        <FileMessage
                            wrapperRef={this.messageRef}
                            key={messageKeyStore[msg.id]}
                            pageKey={tag}
                            progress={msg.progress}
                            author={usersDict[msg.authorId]}
                            message={msg}
                            docType={msg.docType}
                            prevMessage={messagesDict[workspace.id][i - 1]}
                        />
                    )
                }
                <Avatar
                    onClick={e => {
                        e.stopPropagation();
                        publish(uiEvents.NAVIGATE, { navigateTo: 'UserProfile', user: usersDict[msg.authorId] });
                    }}
                    style={{
                        position: "relative",
                        zIndex: 2,
                        marginTop: "auto",
                        marginBottom: 8,
                        visibility: (msg.authorId === me.id && (
                            (messagesDict[workspace.id][i + 1] && msg.authorId !== messagesDict[workspace.id][i + 1].authorId) ||
                            (!messagesDict[workspace.id][i + 1])) && msg.type !== 'service') ? 'visible' : 'hidden'
                    }}
                    sx={{
                        bgcolor: avatarBackColor < 2 ? blue[400] :
                            avatarBackColor < 4 ? purple[400] :
                                avatarBackColor < 6 ? red[400] :
                                    avatarBackColor < 8 ? green[400] :
                                        yellow[600]
                    }}
                >
                    {usersDict[msg.authorId]?.firstName?.substring(0, 1).toUpperCase()}
                </Avatar>
            </div>
        );
    }
}

export class ReplyToMessage extends Component {
    componentDidMount() {
        let { message } = this.props;
        if (!message.author) {
            message.author = usersDict[message.authorId];
            if (!message.author) {
                readUserById(message.authorId, (user) => {
                    message.author = user;
                    this.forceUpdate();
                });
            }
        }
        let reply = messagesDictById[message.replyToMessageId];
        if (!reply.author) {
            reply.author = usersDict[reply.authorId];
            if (!reply.author) {
                readUserById(reply.authorId, (user) => {
                    reply.author = user;
                    this.forceUpdate();
                });
            }
        }
    }
    shouldComponentUpdate() {
        return false;
    }
    render() {
        let { message, showName } = this.props;
        return message.replyToMessageId?.length > 0 && message.replyToMessageId !== '0' ? (
            <div style={{
                display: "flex",
                marginBottom: showName ? 0 : 4,
                marginTop: showName ? 0 : 4
            }}>
                <div style={{ width: 3, backgroundColor: themeId === 'DARK' ? colors.primary : '#fff', borderRadius: 2, height: 24 }} />
                <div style={{ width: 4, height: 8 }} />
                <div style={{ maxWidth: 'calc(100% - 16px)' }}>
                    <Typography
                        sx={{ color: '#fff' }} style={{ fontSize: 12, marginTop: -4 }}
                    >
                        {
                            message.author?.firstName
                        }
                    </Typography>
                    {
                        messagesDictById[message.replyToMessageId].type === 'workspace' ? (
                            <div style={{ display: 'flex' }}>
                                <Workspaces style={{ fill: themeId === 'DARK' ? colors.primary : '#fff', width: 10, height: 10, marginRight: 4 }} />
                                <Typography
                                    sx={{ display: "inline", color: themeId === 'DARK' ? colors.primary : '#fff' }}
                                    variant="caption"
                                    style={{ fontSize: 10, marginTop: -1 }}
                                >
                                    Workspace
                                </Typography>
                            </div>
                        ) : messagesDictById[message.replyToMessageId].type === 'storage' ? (
                            <div style={{ display: 'flex' }}>
                                <SdStorage style={{ fill: themeId === 'DARK' ? colors.primary : '#fff', width: 10, height: 10, marginRight: 4 }} />
                                <Typography
                                    sx={{ display: "inline", color: themeId === 'DARK' ? colors.primary : '#fff' }}
                                    variant="caption"
                                    style={{ fontSize: 10, marginTop: -1 }}
                                >
                                    Storage
                                </Typography>
                            </div>
                        ) : messagesDictById[message.replyToMessageId].type === 'sticker' ? (
                            <div style={{ display: 'flex' }}>
                                <Face2 style={{ fill: themeId === 'DARK' ? colors.primary : '#fff', width: 10, height: 10, marginRight: 4 }} />
                                <Typography
                                    sx={{ display: "inline", color: themeId === 'DARK' ? colors.primary : '#fff' }}
                                    variant="caption"
                                    style={{ fontSize: 10, marginTop: -1 }}
                                >
                                    Sticker
                                </Typography>
                            </div>
                        ) : messagesDictById[message.replyToMessageId]?.docType === 'image' ? (
                            <div style={{ display: 'flex' }}>
                                <InsertPhoto style={{ fill: themeId === 'DARK' ? colors.primary : '#fff', width: 10, height: 10, marginRight: 4 }} />
                                <Typography
                                    sx={{
                                        display: "inline",
                                        color: themeId === 'DARK' ? colors.primary : '#fff'
                                    }}
                                    variant="caption"
                                    style={{ fontSize: 10, marginTop: -1 }}
                                >
                                    Photo
                                </Typography>
                            </div>
                        ) : messagesDictById[message.replyToMessageId]?.docType === 'audio' ? (
                            <div style={{ display: 'flex' }}>
                                <VolumeUp style={{ fill: themeId === 'DARK' ? colors.primary : '#fff', width: 10, height: 10, marginRight: 4 }} />
                                <Typography
                                    sx={{
                                        display: "inline",
                                        color: themeId === 'DARK' ? colors.primary : '#fff'
                                    }}
                                    variant="caption"
                                    style={{ fontSize: 10, marginTop: -1 }}
                                >
                                    Audio
                                </Typography>
                            </div>
                        ) : messagesDictById[message.replyToMessageId]?.docType === 'video' ? (
                            <div style={{ display: 'flex' }}>
                                <PlayCircleOutline style={{ fill: themeId === 'DARK' ? colors.primary : '#fff', width: 10, height: 10, marginRight: 4 }} />
                                <Typography
                                    sx={{
                                        display: "inline",
                                        color: themeId === 'DARK' ? colors.primary : '#fff'
                                    }}
                                    variant="caption"
                                    style={{ fontSize: 10, marginTop: -1 }}
                                >
                                    Video
                                </Typography>
                            </div>
                        ) : messagesDictById[message.replyToMessageId]?.type === 'text' ? (
                            <Typography
                                style={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    height: 16,
                                    color: '#fff',
                                    fontSize: 10,
                                    marginTop: -4,
                                    maxWidth: 200
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: (() => {
                                        let text = messagesDictById[message.replyToMessageId]?.text;
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
                        ) : (
                            <Typography
                                style={{
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    height: 16,
                                    color: colors.textPencil,
                                    fontSize: 12,
                                    marginTop: -4
                                }}
                                variant={'caption'}
                            >

                            </Typography>
                        )
                    }
                </div>
            </div>
        ) : null;
    }
}

export class ServiceMessage extends Component {
    render() {
        let { message } = this.props;
        return (
            <Fade in={true}>
                <div
                    style={{
                        width: "100%",
                        marginBottom: 16,
                        position: 'relative',
                        zIndex: 0,
                        paddingTop: 32,
                    }}
                >
                    <Paper
                        style={{
                            height: 24,
                            borderRadius: 12,
                            width: 200,
                            position: "absolute",
                            backgroundColor: colors.semiTransparentPaper,
                            backdropFilter: colors.backdrop,
                            left: '50%',
                            transform: 'translate(-50%, -16px)'
                        }}
                    >
                        <Typography
                            variant={"caption"}
                            style={{
                                position: "absolute",
                                left: "50%",
                                transform: "translate(-50%, +4px)",
                                textAlign: "center",
                                color: colors.textPencil,
                                width: '100%'
                            }}
                        >
                            {message.text}
                        </Typography>
                    </Paper>
                </div>
            </Fade>
        );
    }
};

export class TextMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnlyEmoji: false,
            message: props.message,
            pageKey: props.pageKey,
            prevMessage: props.prevMessage
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isOnlyEmoji !== nextState.isOnlyEmoji) {
            return true;
        } else {
            return false;
        }
    }
    componentDidMount() {
        let isOnlyEmoji = false;
        let { message, pageKey } = this.state;
        let temp = message.text;
        Object.keys(emojis).forEach(key => {
            temp = replaceAll(temp, `:${key}:`, ``);
        });
        let ioe = false;
        if (temp.trim().length === 0) {
            isOnlyEmoji = true;
            ioe = true;
        }
        temp = message.text;
        let countEmoji = 0;
        Object.keys(emojis).forEach(key => {
            if (temp.includes(`:${key}:`)) countEmoji++;
            temp = temp.replace(`:${key}:`, ``);
        });
        let oneEmoji = false;
        if (temp.trim().length === 0 && countEmoji === 1) {
            oneEmoji = true;
        }
        let text = message.text;
        Object.keys(emojis).forEach(key => {
            text = replaceAll(text, `:${key}:`, `<img src='${emojis[key]}' alt='${key}' width='${oneEmoji ? 144 : ioe ? 48 : 24}' height='${oneEmoji ? 144 : ioe ? 48 : 24}' />`);
        });
        document.getElementById(`messageText-${pageKey}-${message.id}`).innerHTML = text;
        if (!message.seen && message.authorId !== me.id) {
            seeMessage(message.id, () => {
                message.seen = true;
                this.setState({ isOnlyEmoji: isOnlyEmoji });
            });
        } else {
            this.setState({ isOnlyEmoji: isOnlyEmoji });
        }
    }
    render() {
        let { message, isOnlyEmoji, prevMessage, pageKey } = this.state;
        let showName = (message.authorId !== me.id) && (!prevMessage || (prevMessage.authorId !== message.authorId));
        let isReply = (message.replyToMessageId?.length > 0 && message.replyToMessageId !== '0');
        let cornerLT = 12;
        let cornerLB = message.authorId !== me.id ? 0 : 12;
        let cornerRT = 12;
        let cornerRB = message.authorId === me.id ? 0 : 12;
        return (
            <Fade in={true}>
                <div
                    ref={this.props.wrapperRef}
                    className={me.id === message.authorId ?
                        themeId === 'DARK' ?
                            'bubble-right-dark' : 'bubble-right-light' :
                        themeId === 'DARK' ?
                            'bubble-left-dark' : 'bubble-left-light'
                    }
                    style={{
                        height: 'auto',
                        width: "auto",
                        marginBottom: 40,
                        maxWidth: 300,
                        minWidth: 112,
                        borderRadius: `${cornerLT}px ${cornerRT}px ${cornerRB}px ${cornerLB}px`,
                        position: "relative",
                        zIndex: 0,
                        paddingLeft: 8,
                        paddingRight: 8,
                        paddingBottom: (showName || isReply) ? 4 : 0,
                        paddingTop: (showName || isReply) ? 4 : 0,
                        marginLeft: message.authorId === me.id ? "auto" : 8,
                        marginRight: message.authorId === me.id ? 8 : "auto",
                        backdropFilter: isOnlyEmoji ? undefined : colors.backdrop,
                        marginTop: 8
                    }}
                    elevation={isOnlyEmoji ? 0 : 4}
                >
                    <Typography
                        variant={"caption"}
                        style={{
                            textAlign: "left", color: '#fff', fontWeight: 'bold', borderRadius: 8, marginTop: 0,
                            background: (isOnlyEmoji && showName) ? 'rgba(0, 0, 0, 0.35)' : 'transparent'
                        }}
                    >
                        {
                            showName ?
                                usersDict[message.authorId]?.firstName :
                                null
                        }
                    </Typography>
                    {
                        isReply ? (
                            <ReplyToMessage message={message} showName={showName} />
                        ) : null
                    }
                    <Typography
                        id={`messageText-${pageKey}-${message.id}`}
                        variant={"body2"}
                        style={{
                            paddingRight: 56, paddingTop: isReply ? 0 : 8,
                            textAlign: "left", color: '#fff', wordWrap: 'break-word',
                            display: 'flex', wordBreak: 'break-word', paddingBottom: 8
                        }}
                    >

                    </Typography>
                    <div style={{
                        width: 72, position: 'absolute', bottom: 0, right: 0, display: "flex",
                        background: isOnlyEmoji ? 'rgba(0, 0, 0, 0.35)' : 'transparent', paddingLeft: 8, paddingRight: 8,
                        borderRadius: message.authorId === me.id ? "16px 16px 8px 16px" : "16px 16px 16px 8px",
                    }}>
                        <Typography
                            style={{ color: '#fff', textAlign: "right", flex: 1, fontSize: 12 }}
                        >
                            {new Date(Number(message.time)).toTimeString().substring(0, 5)}
                        </Typography>
                        {
                            message.authorId === me.id ?
                                message.status === 'created' ?
                                    message.seen ?
                                        (
                                            <DoneAll
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                            <Done
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                        <Timelapse
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 2,
                                                fill: '#fff',
                                            }}
                                        />
                                    ) :
                                null
                        }
                    </div>
                </div>
            </Fade>
        );
    }
}

export class StickerMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnlyEmoji: false,
            message: props.message,
            pageKey: props.pageKey,
            prevMessage: props.prevMessage
        };
    }
    componentDidMount() {
        let { message } = this.state;
        if (!message.seen && message.authorId !== me.id) {
            seeMessage(message.id, () => {
                message.seen = true;
                this.setState({ message: message });
            });
        }
    }
    render() {
        let { message, prevMessage } = this.state;
        let showName = (message.authorId !== me.id) && (!prevMessage || (prevMessage.authorId !== message.authorId));
        let isReply = (message.replyToMessageId?.length > 0 && message.replyToMessageId !== '0');
        return (
            <Fade in={true}>
                <div
                    ref={this.props.wrapperRef}
                    style={{
                        marginBottom: 16,
                        height: 'auto',
                        width: 175,
                        position: "relative",
                        borderRadius: message.authorId === me.id ? "16px 16px 8px 16px" : "16px 16px 16px 8px",
                        zIndex: 0,
                        paddingLeft: 12,
                        paddingRight: 12,
                        marginLeft: message.authorId === me.id ? "auto" : 8,
                        marginRight: message.authorId === me.id ? 8 : "auto",
                        marginTop: 8
                    }}
                >
                    <Typography
                        variant={"caption"}
                        style={{
                            width: 'auto', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4,
                            textAlign: "left", color: '#fff', fontWeight: 'bold', borderRadius: 8, fontSize: 15,
                            background: showName ? 'rgba(0, 0, 0, 0.35)' : 'transparent', marginTop: 4
                        }}
                    >
                        {
                            showName ?
                                usersDict[message.authorId]?.firstName :
                                null
                        }
                    </Typography>
                    {
                        isReply ? (
                            <ReplyToMessage message={message} showName={showName} />
                        ) : null
                    }
                    <div style={{ width: '100%', height: '100%', paddingBottom: 16, paddingLeft: 8, paddingRight: 8 }}>
                        <LottieSticker stickerKey={message.stickerId} size={159} messageId={message.id} />
                    </div>
                    <div style={{
                        width: 72, position: 'absolute', bottom: 0, right: 0, display: "flex",
                        background: 'rgba(0, 0, 0, 0.35)', paddingLeft: 8, paddingRight: 8,
                        borderRadius: message.authorId === me.id ? "16px 16px 8px 16px" : "16px 16px 16px 8px",
                    }}>
                        <Typography
                            variant={"caption"}
                            style={{ color: '#fff', textAlign: "right", flex: 1 }}
                        >
                            {new Date(Number(message.time)).toTimeString().substring(0, 5)}
                        </Typography>
                        {
                            message.authorId === me.id ?
                                message.status === 'created' ?
                                    message.seen ?
                                        (
                                            <DoneAll
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                            <Done
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                        <Timelapse
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 2,
                                                fill: '#fff',
                                            }}
                                        />
                                    ) :
                                null
                        }
                    </div>
                </div>
            </Fade>
        );
    }
}

export class FileMessage extends Component {
    wires = [];
    doc = undefined;
    roomId = undefined;
    needUpdate = false;
    fetchDoc = async () => {
        let { message } = this.state;
        if (message.status === 'created') {
            if (message.doc) fetchView(message, this.roomId);
            else {
                message.doc = docsDictById[message.fileIds[0]];
                if (!message.doc) {
                    readDocById(message.fileIds[0], this.roomId, async doc => {
                        message.doc = doc;
                        await fetchView(message, this.roomId);
                        this.needUpdate = true;
                        this.forceUpdate();
                    });
                } else {
                    await fetchView(message, this.roomId);
                    this.needUpdate = true;
                    this.forceUpdate();
                }
            }
        }
    };
    constructor(props) {
        super(props);
        this.roomId = workspacesDictById[props.message.wid]?.roomId;
        this.state = {
            isOnlyEmoji: false,
            message: props.message,
            pageKey: props.pageKey,
            prevMessage: props.prevMessage,
            docType: props.docType,
            progress: props.progress,
            author: props.author
        };
        this.fetchDoc = this.fetchDoc.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.progress !== this.props.progress ||
            nextProps.message.meta !== nextProps.message.meta
        ) {
            return true;
        } else {
            return false;
        }
    }
    componentDidMount() {
        let { message } = this.state;
        this.fetchDoc();
        this.wires.push(subscribe(topics.MESSAGE_CREATED, ({ oldMessageId, message: msg }) => {
            if (oldMessageId === message.id) {
                this.forceUpdate();
            }
        }));
        if (!message.seen && message.authorId !== me.id) {
            seeMessage(message.id, () => {
                message.seen = true;
                this.setState({ message: message });
            });
        }
    }
    componentWillUnmount() {
        this.wires.forEach(w => {
            unsubscribe(w);
        });
    }
    render() {
        let { message, prevMessage, pageKey, docType, author, progress } = this.state;
        let showName = (message.authorId !== me.id) && (!prevMessage || (prevMessage.authorId !== message.authorId));
        let temp = Math.floor(message.doc?.duration);
        let minute = Math.floor(temp / 60);
        minute = (minute < 10 ? '0' : '') + minute;
        let second = Math.floor(temp % 60);
        second = (second < 10 ? '0' : '') + second;
        let duration = minute + ':' + second;
        let isReply = (message.replyToMessageId?.length > 0 && message.replyToMessageId !== '0')

        let cornerLT = isReply ? 8 : docType === 'audio' ? 24 : 12;
        let cornerLB = message.authorId !== me.id ? 0 : docType === 'audio' ? 24 : 12;
        let cornerRT = docType === 'audio' ? 24 : 12;
        let cornerRB = message.authorId === me.id ? 0 : docType === 'audio' ? 24 : 12;

        let mediaCornerLT = 12;
        let mediaCornerLB = message.authorId !== me.id ? 0 : 12;
        let mediaCornerRT = 12;
        let mediaCornerRB = message.authorId === me.id ? 0 : 12;

        return (
            <Fade in={true}>
                <div
                    ref={this.props.wrapperRef}
                    className={me.id === message.authorId ?
                        themeId === 'DARK' ?
                            'bubble-right-dark' : 'bubble-right-light' :
                        themeId === 'DARK' ?
                            'bubble-left-dark' : 'bubble-left-light'
                    }
                    style={{
                        marginBottom: 40,
                        height: (docType === 'audio' ? 52 : docType === 'video' ? 204 : docType === 'image' ? 204 : 56) + (isReply ? 34 : 0) + (showName ? 20 : 0),
                        width: docType === 'image' ? (message.meta?.width / message.meta?.height * 200) :
                            docType === 'video' ? (message.meta?.width / message.meta?.height * 200) :
                                docType === 'audio' ? 200 : 200,
                        minWidth: 150,
                        borderRadius: `${cornerLT}px ${cornerRT}px ${cornerRB}px ${cornerLB}px`,
                        position: "relative",
                        zIndex: 0,
                        padding: 2,
                        marginLeft: message.authorId === me.id ? "auto" : 8,
                        marginRight: message.authorId === me.id ? 8 : "auto",
                        backdropFilter: colors.backdrop,
                        marginTop: 8,
                    }}
                    elevation={4}
                >
                    {showName ? (
                        <Typography
                            variant={"caption"}
                            style={{
                                textAlign: "left", color: '#fff', fontWeight: 'bold', marginLeft: 8, marginTop: 4
                            }}
                        >
                            {
                                author?.firstName
                            }
                        </Typography>
                    ) : null}
                    {
                        isReply ? (
                            <div style={{ marginLeft: 4 }}>
                                <ReplyToMessage message={message} showName={showName} />
                            </div>
                        ) : null
                    }
                    <div
                        style={{
                            width: '100%', position: 'relative', height: '100%'
                        }}
                    >
                        {message.docType === 'image' ? (
                            <img
                                id={`message_${pageKey}_${message.id}_file_viewer`}
                                src={generatePreviewLink(message.fileIds[0], this.roomId)}
                                style={{
                                    width: '100%',
                                    height: 200,
                                    borderRadius: `${mediaCornerLT}px ${mediaCornerRT}px ${mediaCornerRB}px ${mediaCornerLB}px`,
                                }}
                                loading="lazy"
                                onClick={e => {
                                    e.stopPropagation();
                                    publish(uiEvents.OPEN_PHOTO_VIEWER, {
                                        source: generateFileLink(message.doc.id, workspacesDictById[message.wid].roomId),
                                        docId: message.doc.id,
                                        allFiles: messagesDict[message.wid].filter(m => ((m.type === 'file') && (message.docType === 'image'))).map(m => m.fileIds[0]),
                                        roomId: workspacesDictById[message.wid].roomId
                                    });
                                }}
                            />
                        ) : message.docType === 'video' ? (
                            <div
                                style={{
                                    width: '100%',
                                    height: 200,
                                    position: 'relative'
                                }}
                            >
                                <img
                                    id={`message_${pageKey}_${message.id}_file_viewer`}
                                    src={generatePreviewLink(message.fileIds[0], this.roomId)}
                                    style={{
                                        width: '100%',
                                        height: 200,
                                        borderRadius: `${mediaCornerLT}px ${mediaCornerRT}px ${mediaCornerRB}px ${mediaCornerLB}px`,
                                    }}
                                    loading="lazy"
                                />
                                {
                                    message.status === 'created' ? (
                                        <Fab style={{
                                            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                                            background: colors.semiTransparentPaper, backdropFilter: 'blur(10px)'
                                        }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                publish(uiEvents.OPEN_VIDEO_PLAYER, {
                                                    source: generateFileLink(message.doc.id, workspacesDictById[message.wid].roomId),
                                                    docId: message.doc.id
                                                });
                                            }}>
                                            <PlayArrow style={{ fill: colors.textPencil }} />
                                        </Fab>
                                    ) : null
                                }
                            </div>
                        ) : message.docType === 'audio' ?
                            message.preview !== undefined ? (
                                <div style={{ width: '100%', position: 'relative', height: 40, marginTop: isReply ? -6 : 0 }}>
                                    <Typography style={{ position: 'absolute', right: 8, top: 4, color: '#fff' }} variant={'caption'}>
                                        {duration.startsWith('N') ? 'unknown' : duration}
                                    </Typography>
                                    <WaveSurferBox
                                        waveformKey={`wavesurfer_${message.id}`}
                                        source={generateFileLink(message.fileIds[0], this.roomId)}
                                        graph={message.preview.data}
                                        docId={message.fileIds[0]}
                                        roomId={this.roomId}
                                    />
                                </div>
                            ) : null : null
                        }
                        {
                            message.status === 'pending' ?
                                docType === 'audio' ? null : (
                                    <div style={{
                                        width: 'calc(100% - 4px)', height: 'calc(100% - 4px)', position: 'absolute',
                                        left: 2, top: 2, backdropFilter: 'blur(10px)',
                                        borderRadius: message.authorId === me.id ? "16px 16px 8px 16px" : "16px 16px 16px 8px",
                                    }} />
                                ) :
                                null
                        }
                        {
                            message.status === 'pending' ? (
                                <div style={{
                                    width: '100%', height: '100%', position: 'absolute', left: 0, top: 0
                                }} >
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <div style={{
                                            padding: 8, position: 'absolute', left: '50%', top: '50%',
                                            transform: 'translate(-50%, -50%)', background: colors.semiTransparentPaper,
                                            borderRadius: '50%', width: 48, height: 48
                                        }}>
                                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                <CircularProgress variant="determinate" value={progress?.progress} style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                    {
                        message.status === 'pending' ? (
                            <Typography
                                variant={"caption"}
                                style={{
                                    position: 'absolute', zIndex: 5, marginRight: "auto", marginLeft: 0, display: "flex",
                                    background: message.docType === 'audio' ? 'transparent' : 'rgba(0, 0, 0, 0.35)',
                                    bottom: 4, width: 'auto', borderRadius: message.authorId === me.id ? "16px 16px 16px 8px" : "16px 16px 8px 16px",
                                    paddingRight: 8, paddingLeft: 8, color: '#fff'
                                }}>
                                {progress?.current} / {progress?.total}
                            </Typography>
                        ) : null
                    }
                    <div style={{
                        position: 'absolute', bottom: 0, right: 0, zIndex: 5, display: "flex",
                        background: message.docType === 'audio' ? 'transparent' : 'rgba(0, 0, 0, 0.35)',
                        marginTop: 16, width: 72, borderRadius: message.authorId === me.id ? "16px 16px 8px 16px" : "16px 16px 16px 8px",
                        paddingRight: 8, paddingLeft: 8
                    }}>
                        <Typography
                            variant={"caption"}
                            style={{ color: '#fff', textAlign: "right", flex: 1 }}
                        >
                            {new Date(Number(message.time)).toTimeString().substring(0, 5)}
                        </Typography>
                        {
                            message.authorId === me.id ?
                                message.status === 'created' ?
                                    message.seen ?
                                        (
                                            <DoneAll
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                            <Done
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                        <Timelapse
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 2,
                                                fill: '#fff',
                                            }}
                                        />
                                    ) :
                                null
                        }
                    </div>
                </div>
            </Fade>
        );
    }
}

export class WorkspaceMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: props.message,
            pageKey: props.pageKey,
            prevMessage: props.prevMessage
        };
    }
    componentDidMount() {
        let { message } = this.state;
        if (!message.seen && message.authorId !== me.id) {
            seeMessage(message.id, () => {
                message.seen = true;
                this.setState({ message: message });
            });
        }
    }
    render() {
        let { message, prevMessage } = this.state;
        let showName = (message.authorId !== me.id) && (!prevMessage || (prevMessage.authorId !== message.authorId));
        let isReply = (message.replyToMessageId?.length > 0 && message.replyToMessageId !== '0');
        let cornerLT = 12;
        let cornerLB = 12;
        let cornerRT = 12;
        let cornerRB = 12;
        return (
            <Fade in={true}>
                <div
                    ref={this.props.wrapperRef}
                    className={me.id === message.authorId ?
                        themeId === 'DARK' ?
                            'bubble-right-dark' : 'bubble-right-light' :
                        themeId === 'DARK' ?
                            'bubble-left-dark' : 'bubble-left-light'
                    }
                    style={{
                        height: 200,
                        width: 250,
                        background: 'transparent',
                        borderRadius: `${cornerLT}px ${cornerRT}px ${cornerRB}px ${cornerLB}px`,
                        position: "relative",
                        zIndex: 0,
                        marginLeft: message.authorId === me.id ? "auto" : 8,
                        marginRight: message.authorId === me.id ? 8 : "auto",
                        backdropFilter: colors.backdrop,
                        marginTop: 8,
                        marginBottom: 40,
                        padding: 0
                    }}
                >
                    <Typography
                        variant={"caption"}
                        style={{
                            textAlign: "left", color: '#fff', fontWeight: 'bold', borderRadius: 8, marginTop: 0,
                            background: 'transparent'
                        }}
                    >
                        {
                            showName ?
                                usersDict[message.authorId]?.firstName :
                                null
                        }
                    </Typography>
                    {
                        isReply ? (
                            <ReplyToMessage message={message} showName={showName} />
                        ) : null
                    }
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Paper
                            onClick={e => {
                                e.stopPropagation();
                                enterWorkspace(message.workspaceId, true);
                            }}
                            elevation={4}
                            style={{
                                borderRadius: 16, width: '100%', height: '100%',
                                background: "linear-gradient(315deg, rgba(230, 74, 25, 1) 0%, rgba(255, 87, 34, 0.5) 100%)",
                                paddingTop: 56
                            }}>
                            <Paper style={{ width: 72, height: 72, borderRadius: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
                                <Typography style={{
                                    alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
                                    position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
                                }}>
                                    W
                                </Typography>
                            </Paper>
                            <Typography style={{ color: colors.textPencil, fontSize: 14, marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{workspacesDictById[message.workspaceId]?.title}</Typography>
                        </Paper>
                    </div>
                    <div style={{
                        width: 72, position: 'absolute', bottom: 0, right: 0, display: "flex",
                        background: 'transparent', paddingLeft: 8, paddingRight: 8,
                        borderRadius: message.authorId === me.id ? "16px 16px 8px 16px" : "16px 16px 16px 8px",
                    }}>
                        <Typography
                            style={{ color: '#fff', textAlign: "right", flex: 1, fontSize: 12 }}
                        >
                            {new Date(Number(message.time)).toTimeString().substring(0, 5)}
                        </Typography>
                        {
                            message.authorId === me.id ?
                                message.status === 'created' ?
                                    message.seen ?
                                        (
                                            <DoneAll
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                            <Done
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                        <Timelapse
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 2,
                                                fill: '#fff',
                                            }}
                                        />
                                    ) :
                                null
                        }
                    </div>
                </div >
            </Fade>
        );
    }
}

export class FilespaceMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: props.message,
            pageKey: props.pageKey,
            prevMessage: props.prevMessage
        };
    }
    componentDidMount() {
        let { message } = this.state;
        if (!message.seen && message.authorId !== me.id) {
            seeMessage(message.id, () => {
                message.seen = true;
                this.setState({ message: message });
            });
        }
    }
    render() {
        let { message, prevMessage } = this.state;
        let showName = (message.authorId !== me.id) && (!prevMessage || (prevMessage.authorId !== message.authorId));
        let isReply = (message.replyToMessageId?.length > 0 && message.replyToMessageId !== '0');
        let cornerLT = 12;
        let cornerLB = 12;
        let cornerRT = 12;
        let cornerRB = 12;
        return (
            <Fade in={true}>
                <div
                    ref={this.props.wrapperRef}
                    className={me.id === message.authorId ?
                        themeId === 'DARK' ?
                            'bubble-right-dark' : 'bubble-right-light' :
                        themeId === 'DARK' ?
                            'bubble-left-dark' : 'bubble-left-light'
                    }
                    style={{
                        height: 200,
                        width: 250,
                        background: 'transparent',
                        borderRadius: `${cornerLT}px ${cornerRT}px ${cornerRB}px ${cornerLB}px`,
                        position: "relative",
                        zIndex: 0,
                        marginLeft: message.authorId === me.id ? "auto" : 8,
                        marginRight: message.authorId === me.id ? 8 : "auto",
                        backdropFilter: colors.backdrop,
                        marginTop: 8,
                        marginBottom: 40,
                        padding: 0
                    }}
                >
                    <Typography
                        variant={"caption"}
                        style={{
                            textAlign: "left", color: '#fff', fontWeight: 'bold', borderRadius: 8, marginTop: 0,
                            background: 'transparent'
                        }}
                    >
                        {
                            showName ?
                                usersDict[message.authorId]?.firstName :
                                null
                        }
                    </Typography>
                    {
                        isReply ? (
                            <ReplyToMessage message={message} showName={showName} />
                        ) : null
                    }
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <Paper
                            onClick={e => {
                                e.stopPropagation();
                                publish(uiEvents.NAVIGATE, { navigateTo: 'Filespace', filespace: filespacesDictById[message.storageId] });
                            }}
                            elevation={4}
                            style={{
                                borderRadius: 16, width: '100%', height: '100%',
                                background: "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
                                paddingTop: 56
                            }}>
                            <Paper style={{ width: 72, height: 72, borderRadius: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
                                <Typography style={{
                                    alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
                                    position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
                                }}>
                                    F
                                </Typography>
                            </Paper>
                            <Typography style={{ color: colors.textPencil, fontSize: 14, marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{filespacesDictById[message.storageId]?.title}</Typography>
                        </Paper>
                    </div>
                    <div style={{
                        width: 72, position: 'absolute', bottom: 0, right: 0, display: "flex",
                        background: 'transparent', paddingLeft: 8, paddingRight: 8,
                        borderRadius: message.authorId === me.id ? "16px 16px 8px 16px" : "16px 16px 16px 8px",
                    }}>
                        <Typography
                            style={{ color: '#fff', textAlign: "right", flex: 1, fontSize: 12 }}
                        >
                            {new Date(Number(message.time)).toTimeString().substring(0, 5)}
                        </Typography>
                        {
                            message.authorId === me.id ?
                                message.status === 'created' ?
                                    message.seen ?
                                        (
                                            <DoneAll
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                            <Done
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    marginLeft: 2,
                                                    fill: '#fff',
                                                }}
                                            />
                                        ) : (
                                        <Timelapse
                                            style={{
                                                width: 16,
                                                height: 16,
                                                marginLeft: 2,
                                                fill: '#fff',
                                            }}
                                        />
                                    ) :
                                null
                        }
                    </div>
                </div >
            </Fade>
        );
    }
}

export const DayDivider = ({ dateMillis }) => {
    return (
        <Fade in={true}>
            <div
                style={{
                    width: "100%",
                    marginBottom: 16,
                    position: 'relative',
                    zIndex: 1,
                    paddingTop: 32,
                }}
            >
                <Paper
                    style={{
                        height: 24,
                        borderRadius: 12,
                        width: 200,
                        position: "absolute",
                        backgroundColor: colors.semiTransparentPaper,
                        backdropFilter: colors.backdrop,
                        left: '50%',
                        transform: 'translate(-50%, -16px)'
                    }}
                >
                    <Typography
                        variant={"caption"}
                        style={{
                            position: "absolute",
                            left: "50%",
                            transform: "translate(-50%, +4px)",
                            textAlign: "center",
                            color: colors.textPencil,
                            width: '100%'
                        }}
                    >
                        {formatDate(dateMillis)}
                    </Typography>
                </Paper>
            </div>
        </Fade>
    );
};
