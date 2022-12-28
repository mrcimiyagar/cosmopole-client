import {
  AllOut,
  ArrowBack,
  CallEnd,
  Videocam,
  Mic,
  Screenshot,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Fab,
  Grid,
  IconButton,
  Paper,
  Typography,
  Zoom,
} from "@mui/material";
import * as React from "react";
import { colors } from "../../config/colors";
import { publish, subscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import updates from '../../core/network/updates.json';
import {
  joinCall, leaveCall, turnAudioOff, turnScreenOff, turnVideoOff
} from '../../core/callables/call';
import { enterRoom } from "../../core/callables/auth";
import topics from '../../core/events/topics.json';
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import { dbSaveCallToHistory } from "../../core/storage/calls";
import PeopleIcon from '@mui/icons-material/People';
import { me, usersDict } from "../../core/memory";
import { readUserById } from "../../core/callables/users";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { Peer } from "peerjs";
import config from '../../core/config.json';
import BaseDialog from "../../utils/DialogEssentials";
import BaseComponent from "../../utils/ComponentEssentials";

let peer;

var ICE_SERVERS = [
  {
    url: 'stun:5.9.211.126:3478'
  },
  {
    url: 'turn:5.9.211.126:3478',
    username: 'guest',
    credential: 'somepassword',
  }
]

let users = {};
let connections = {};

let videoInCalls = {};
let screenInCalls = {};
let audioInCalls = {};

let videoOutCalls = {};
let screenOutCalls = {};
let audioOutCalls = {};

let videoStreams = {};
let screenStreams = {};
let audioStreams = {};
let videoOn = false;
let screenOn = false;
let audioOn = false;
let myVideoStream = undefined;
let myScreenStream = undefined;
let myAudioStream = undefined;
let startTime = undefined;
let extOpen = false;
let timerInterval = undefined;
let bigUserId = undefined;
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

class UserItem extends React.Component {
  user = undefined;
  componentDidMount() {
    let { userId } = this.props;
    this.user = usersDict[userId];
    if (!this.user) {
      readUserById(userId, u => {
        this.user = u;
        this.forceUpdate();
      });
    } else {
      this.forceUpdate();
    }
  }
  render() {
    if (!this.user) return null;
    let avatarBackColor = this.user.avatarBackColor;
    return (
      <Grid item xs={3}>
        <div style={{ width: '100%', height: 128, position: 'relative' }}>
          <div
            style={{
              width: '100%', height: 'calc(100% - 48px)',
              paddingTop: (window.innerWidth / 3 - 16) / 2 - 64 + 'px'
            }}>
            <Paper style={{ width: 72, height: 72, borderRadius: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
              <Avatar style={{ width: '100%', height: '100%' }} sx={{
                bgcolor:
                  avatarBackColor < 2 ? blue[400] :
                    avatarBackColor < 4 ? purple[400] :
                      avatarBackColor < 6 ? red[400] :
                        avatarBackColor < 8 ? green[400] :
                          yellow[600]
              }}>
                <Typography style={{
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#fff',
                  position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
                }}>
                  {this.user?.firstName?.substring(0, 1).toUpperCase()}
                </Typography>
              </Avatar>
            </Paper>
          </div>
          <Typography
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              marginTop: 4,
              width: '100%',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              color: colors.textPencil
            }}>
            {me.id === this.user?.id ? 'me' : this.user?.firstName}
          </Typography>
          <Typography style={{ color: colors.textPencil, fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>Speaker</Typography>
        </div>
      </Grid>
    );
  }
};
class PeopleMenu extends BaseComponent {
  componentDidMount() {
    this.wire(uiEvents.UPDATE_CALL_PEOPLE_LIST, this.forceUpdate);
  }
  render() {
    return (
      <Box
        sx={{ width: '100%', height: 400 }}
        role="presentation"
      >
        <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, backgroundColor: 'grey', top: 12 }} />
        <Typography style={{ color: colors.textPencil, paddingLeft: 24, paddingTop: 32, fontWeight: 'b0ld' }} variant={'h6'}>
          People in the call
        </Typography>
        <Grid container spacing={3} style={{ padding: 24 }}>
          <UserItem userId={me.id} />
          {
            Object.keys(users).map(userId => {
              return (
                <UserItem userId={userId} />
              );
            })
          }
          <Grid item xs={12}>
            <div style={{ height: 48, width: '100%' }} />
          </Grid>
        </Grid>
      </Box>
    );
  }
};
class PeerAudio extends React.Component {
  constructor(props) {
    super(props);
    this.audioRef = React.createRef();
  }
  componentDidMount() {
    let { id, stream } = this.props;
    if (this.audioRef.current) {
      this.audioRef.current.srcObject = stream;
    }
  }
  render() {
    let { id, stream } = this.props;
    if (id === me.id) {
      return null;
    }
    return (
      <div key={id} style={{ display: 'none' }}>
        <audio ref={this.audioRef} controls autoPlay />
      </div>
    );
  }
}
class PeerVideo extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }
  componentDidMount() {
    this.videoRef.current.srcObject = this.props.stream;
  }
  render() {
    return (
      <Paper key={this.props.id} style={{ position: 'relative', marginRight: 16, width: 150, height: 150, background: 'transparent', borderRadius: 16, border: (me.id === this.props.id ? `3px solid ${colors.primary}` : undefined) }} elevation={8}>
        <video
          onClick={() => {
            let oldEye = document.getElementById('call_video_box_eye_' + bigUserId);
            oldEye && (oldEye.style.display = 'none');
            bigUserId = this.props.id;
            let newEye = document.getElementById('call_video_box_eye_' + bigUserId);
            newEye && (newEye.style.display = 'block');
            document.getElementById('me-video').srcObject = videoStreams[this.props.id];
            document.getElementById('me-screen').srcObject = screenStreams[this.props.id];
          }}
          ref={this.videoRef}
          style={{ width: '100%', height: '100%', borderRadius: 16 }}
          autoPlay
        />
        {
          <Avatar id={'call_video_box_eye_' + this.props.id} style={{
            display: (bigUserId === this.props.id) ? 'block' : 'none',
            width: 32, height: 32, backgroundColor: '#0a5', position: 'absolute',
            right: 8, top: 8
          }}>
            <Visibility style={{ fill: '#fff' }} />
          </Avatar>
        }
      </Paper>
    )
  }
}
class PeerEmpty extends React.Component {
  render() {
    let { id } = this.props;
    return (
      <Paper style={{ position: 'relative', marginRight: 16, width: 150, height: 150, background: colors.semiPaper, borderRadius: 16, border: (me.id === id ? `3px solid ${colors.primary}` : undefined) }} elevation={8}>
        <div
          onClick={() => {
            bigUserId = id;
            document.getElementById('me-video').srcObject = videoStreams[id];
            document.getElementById('me-screen').srcObject = screenStreams[id];
          }}
          style={{ width: '100%', height: '100%', borderRadius: 16, paddingTop: 56 }}
        >
          <Typography variant={'caption'} style={{ fontWeight: 'bold', width: '100%', textAlign: 'center' }}>
            {usersDict[id]?.firstName}
          </Typography>
        </div>
        {
          bigUserId === id ? (
            <Avatar style={{ width: 32, height: 32, backgroundColor: '#0a5', position: 'absolute', right: 8, top: 8 }}>
              <Visibility style={{ fill: '#fff' }} />
            </Avatar>
          ) : null
        }
      </Paper>
    );
  }
}

export default class CallNew extends BaseDialog {
  constructor(props) {
    super(props);
    this.workspaceRef = React.createRef();
    this.userRef = React.createRef();
    this.titleRef = React.createRef();
    this.loadedRef = React.createRef(false);
    this.state = {
      timer: '00:00',
      maximizeBtnHidden: false,
      peopleMaximize: false,
    };
    this.close = this.close.bind(this);
    this.exit = this.exit.bind(this);
    this.startVideo = this.startVideo.bind(this);
    this.endVideo = this.endVideo.bind(this);
    this.startScreen = this.startScreen.bind(this);
    this.endScreen = this.endScreen.bind(this);
    this.startAudio = this.startAudio.bind(this);
    this.endAudio = this.endAudio.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.toggleScreen = this.toggleScreen.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
    this.callWithAudioStream = this.callWithAudioStream.bind(this);
    this.callWithVideoStream = this.callWithVideoStream.bind(this);
    this.callWithScreenStream = this.callWithScreenStream.bind(this);
  }

  exit() {
    leaveCall();
    clearInterval(timerInterval);
    Object.values(videoInCalls).forEach(call => {
      call?.close();
    });
    Object.values(screenInCalls).forEach(call => {
      call?.close();
    });
    Object.values(audioInCalls).forEach(call => {
      call?.close();
    });
    Object.values(videoOutCalls).forEach(call => {
      call?.close();
    });
    Object.values(screenOutCalls).forEach(call => {
      call?.close();
    });
    Object.values(audioOutCalls).forEach(call => {
      call?.close();
    });
    Object.values(connections).forEach(connection => {
      connection?.close();
    });
    users = {};
    connections = {};
    videoInCalls = {};
    screenInCalls = {};
    audioInCalls = {};
    videoOutCalls = {};
    screenOutCalls = {};
    audioOutCalls = {};
    this.endVideo();
    this.endScreen();
    this.endAudio();
    videoOn = false; screenOn = false; audioOn = false;
    myVideoStream = undefined; myScreenStream = undefined; myAudioStream = undefined;
    videoStreams = {}; screenStreams = {}; audioStreams = {};
    publish(uiEvents.STOP_ALL_FLOATING_VIDEOS, {});
  };

  startVideo() {
    let that = this;
    navigator.getUserMedia(
      {
        video: {
          width: 300,
          height: 300
        }
      },
      function (stream) {
        console.log('Access granted to video/video');
        myVideoStream = stream;
        videoStreams[me.id] = stream;
        videoOn = true;
        document.getElementById('me-video').srcObject = myVideoStream;
        Object.values(connections).forEach(conn => {
          if (conn) {
            that.callWithVideoStream(conn.peer);
          }
        });
      },
      function () {
        console.log('Access denied for video/video')
        alert(
          'You chose not to provide access to the camera/microphone.',
        )
      },
    );
  }

  endVideo() {
    if (myVideoStream !== undefined) {
      myVideoStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    videoOn = false;
    delete videoStreams[me.id];
    document.getElementsByName('me-video').srcObject = undefined;
    this.forceUpdate();
    turnVideoOff();
  }

  toggleVideo() {
    if (!videoOn) {
      this.startVideo();
    } else {
      this.endVideo();
    }
  }

  startScreen() {
    let that = this;
    navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: {
        width: { ideal: 800, max: 800 },
        height: { ideal: 400, max: 400 }
      }
    }).then(function (stream) {
      console.log('Access granted to screen/screen');
      myScreenStream = stream;
      screenStreams[me.id] = stream;
      screenOn = true;
      document.getElementById('me-screen').srcObject = myScreenStream;
      Object.values(connections).forEach(conn => {
        if (conn) {
          that.callWithScreenStream(conn.peer);
        }
      });
    },
      function () {
        console.log('Access denied for screen/screen')
        alert(
          'You chose not to provide access to the screenshare.',
        )
      },
    );
  }

  endScreen() {
    if (myScreenStream !== undefined) {
      myScreenStream.getVideoTracks().forEach((track) => {
        track.stop()
      });
    }
    screenOn = false;
    delete screenStreams[me.id];
    turnScreenOff();
  }

  toggleScreen() {
    if (!screenOn) {
      this.startScreen();
    } else {
      this.endScreen();
    }
  }

  callWithAudioStream(peerId) {
    let that = this;
    if (myAudioStream) {
      console.log('calling', peerId, 'with audio');
      let call = peer.call(peerId, myAudioStream, { metadata: { type: 'audio' } });
      audioOutCalls[peerId] = call;
      call.on('close', () => {
        delete audioOutCalls[peerId];
        delete audioStreams[peerId];
        that.forceUpdate();
      });
      call.on("stream", (remoteStream) => {
        console.log('received stream audio');
        audioStreams[peerId] = remoteStream;
        that.forceUpdate();
      });
      call.on('error', err => {
        console.log(err);
      });
    } else {
      console.log('cant call', peerId, 'because audio stream is empty');
    }
  }

  callWithVideoStream(peerId) {
    let that = this;
    if (myVideoStream) {
      console.log('calling', peerId, 'with video');
      let call = peer.call(peerId, myVideoStream, { metadata: { type: 'video' } });
      videoOutCalls[peerId] = call;
      call.on('close', () => {
        delete videoOutCalls[peerId];
        delete videoStreams[peerId];
        that.forceUpdate();
      });
      call.on("stream", (remoteStream) => {
        console.log('received stream video');
        videoStreams[peerId] = remoteStream;
        that.forceUpdate();
      });
      call.on('error', err => {
        console.log(err);
      });
    } else {
      console.log('cant call', peerId, 'because video stream is empty');
    }
  }

  callWithScreenStream(peerId) {
    let that = this;
    if (myScreenStream) {
      console.log('calling', peerId, 'with screen');
      let call = peer.call(peerId, myScreenStream, { metadata: { type: 'screen' } });
      screenOutCalls[peerId] = call;
      call.on('close', () => {
        delete screenOutCalls[peerId];
        delete screenStreams[peerId];
        that.forceUpdate();
      });
      call.on("stream", (remoteStream) => {
        console.log('received stream screen');
        screenStreams[peerId] = remoteStream;
        that.forceUpdate();
      });
      call.on('error', err => {
        console.log(err);
      });
    } else {
      console.log('cant call', peerId, 'because audio stream is empty');
    }
  }

  startAudio() {
    let that = this;
    navigator.getUserMedia(
      {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      },
      function (stream) {
        console.log('Access granted to audio/audio');
        myAudioStream = stream;
        audioStreams[me.id] = stream;
        audioOn = true;
        Object.values(connections).forEach(conn => {
          if (conn) {
            that.callWithAudioStream(conn.peer);
          }
        });
      },
      function () {
        console.log('Access denied for audio/audio')
        alert(
          'You chose not to provide access to the camera/microphone.',
        )
      },
    );
  }

  endAudio() {
    if (myAudioStream !== undefined) {
      myAudioStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    audioOn = false;
    delete audioStreams[me.id];
    turnAudioOff();
  }

  toggleAudio() {
    if (!audioOn) {
      this.startAudio();
    } else {
      this.endAudio();
    }
  }

  close() {
    extOpen = false;
    super.close();
  }

  componentDidMount() {
    let that = this;
    const { workspaceRef, userRef, titleRef, loadedRef } = that;
    const startTimer = () => {
      timerInterval = setInterval(() => {
        let currentTime = new Date();
        let diff = currentTime - startTime;
        let timervalue = millisToMinutesAndSeconds(diff);
        if (timervalue.startsWith('N')) {
          that.setState({ timer: '00:00' });
        } else {
          that.setState({ timer: timervalue });
        }
      }, 1000);
    }

    const openCall = () => {
      dbSaveCallToHistory(workspaceRef.current.id);
      enterRoom(workspaceRef.current.roomId, false, workspaceRef.current.id);
    }

    peer = new Peer(me.id, {
      host: config.CALL_PEERER,
      port: 443,
      secure: true,
      path: '/myapp',
      config: { iceServers: ICE_SERVERS }
    });
    peer.on("connection", (conn) => {
      console.log('connection created : ', conn.peer);
      connections[conn.peer] = conn;
      conn.on("open", () => {
        console.log('connection opened to ', conn.peer);
        that.callWithVideoStream(conn.peer);
        that.callWithScreenStream(conn.peer);
        that.callWithAudioStream(conn.peer);
      }, (err) => {
        console.error("Failed to get local stream", err);
      });
    });
    peer.on("call", (call) => {
      console.log('received call from', call.peer, 'of type', call.metadata.type);
      if (call.metadata.type === 'video') {
        videoInCalls[call.peer] = call;
        call.answer(myVideoStream);
        call.on("stream", (remoteStream) => {
          videoStreams[call.peer] = remoteStream;
          that.forceUpdate();
        });
        call.on('error', err => {
          console.log(err);
        });
      } else if (call.metadata.type === 'screen') {
        screenInCalls[call.peer] = call;
        call.answer(myScreenStream);
        call.on("stream", (remoteStream) => {
          screenStreams[call.peer] = remoteStream;
          that.forceUpdate();
        });
        call.on('error', err => {
          console.log(err);
        });
      } else if (call.metadata.type === 'audio') {
        audioInCalls[call.peer] = call;
        call.answer(myAudioStream);
        call.on("stream", (remoteStream) => {
          audioStreams[call.peer] = remoteStream;
          that.forceUpdate();
        });
        call.on('error', err => {
          console.log(err);
        });
      }
    });
    peer.on('open', () => {
      if (extOpen) {
        bigUserId = me.id;
        joinCall();
      }
      console.log('connection to peer server opened');
      subscribe(updates.ON_USER_JOIN, ({ userId }) => {
        console.log(userId, 'joined');
        if (userId !== me.id) {
          users[userId] = true;
          that.forceUpdate();
          connections[userId] = peer.connect(userId);
        }
      });
      subscribe(updates.ON_USERS_SYNC, ({ userIds }) => {
        console.log('syncing call users...');
        userIds.forEach(userId => {
          users[userId] = true;
          if (userId !== me.id) {
            console.log('connecting to', userId);
            connections[userId] = peer.connect(userId);
          }
        });
      });
      subscribe(updates.ON_VIDEO_TURN_OFF, ({ userId }) => {
        if (userId !== me.id) {
          console.log(userId, 'turned off video');
          delete videoStreams[userId];
          that.forceUpdate();
        }
      });
      subscribe(updates.ON_SCREEN_TURN_OFF, ({ userId }) => {
        if (userId !== me.id) {
          console.log(userId, 'turned off screen');
          delete screenStreams[userId];
          that.forceUpdate();
        }
      });
      subscribe(updates.ON_AUDIO_TURN_OFF, ({ userId }) => {
        if (userId !== me.id) {
          console.log(userId, 'turned off audio');
          delete audioStreams[userId];
          that.forceUpdate();
        }
      });
      subscribe(updates.ON_USER_LEAVE, ({ userId }) => {
        console.log(userId, 'left');
        if (userId !== me.id) {
          connections[userId]?.close();
          delete connections[userId];
          videoInCalls[userId]?.close();
          delete videoInCalls[userId];
          screenInCalls[userId]?.close();
          delete screenInCalls[userId];
          audioInCalls[userId]?.close();
          delete audioInCalls[userId];
          videoOutCalls[userId]?.close();
          delete videoOutCalls[userId];
          screenOutCalls[userId]?.close();
          delete screenOutCalls[userId];
          audioOutCalls[userId]?.close();
          delete audioOutCalls[userId];
          delete videoStreams[userId];
          delete screenStreams[userId];
          delete audioStreams[userId];
          delete users[userId];
          that.forceUpdate();
        }
      });
    });

    this.wire(uiEvents.OPEN_CALL, ({ user, workspace }) => {
      this.open();
      if (workspace && workspaceRef.current) {
        if (workspace.id !== workspaceRef.current.id) {
          if (window.confirm('you are already in another call. if you join this call, your current call will be ended. would you like to do so ?')) {

            this.exit();

            workspaceRef.current = undefined;
            this.setState({ timer: '00:00' });
            startTimer();

            workspaceRef.current = workspace;
            userRef.current = user;

            extOpen = true;
            startTime = new Date();
            openCall();
          } else {
            this.close();
          }
        } else {
          extOpen = true;
        }
      } else if (workspace && !workspaceRef.current) {

        workspaceRef.current = workspace;
        userRef.current = user;

        extOpen = true;
        startTime = new Date();
        startTimer();
        openCall();

      } else if (!workspace && workspaceRef.current) {
        extOpen = true;
      } else if (!workspace && !workspaceRef.current) {
        this.close();
      }
      setTimeout(() => {
        try {
          if (user) {
            titleRef.current.innerHTML = user.firstName + ' ' + user.lastName;
          } else {
            titleRef.current.innerHTML = workspace.title;
          }
        } catch (ex) { }
      }, 500);
    });

    subscribe(topics.ENTERED_WORKSPACE, () => {
      if (extOpen) {
        bigUserId = me.id;
        joinCall();
      }
    });
  }

  render() {
    let { peopleMaximize, maximizeBtnHidden, timer } = this.state;
    let user = this.userRef.current;
    let workspace = this.workspaceRef.current;
    return this.renderWrapper(
      <div style={{ width: '100%', height: '100%' }}>
        <div
          style={{
            width: "100%",
            position: "absolute",
            top: comsoToolbarHeight + 8,
            display: 'flex'
          }}
        >
          <IconButton onClick={this.close} style={{ marginLeft: 16 }}>
            <ArrowBack style={{ fill: colors.textPencil }} />
          </IconButton>
          <div
            style={{
              flex: 1
            }}
          >
            <Typography ref={this.titleRef} style={{ color: colors.textPencil }}>
              {
                (user !== undefined && user !== null) ?
                  (user.firstName + ' ' + user.lastName) :
                  workspace?.title
              }
            </Typography>
            <Typography variant={"caption"} style={{ color: colors.textPencil }}>{timer}</Typography>
          </div>
        </div>
        <Paper
          elevation={8}
          style={{
            position: "relative",
            width: "100%",
            height: `calc(100% - 56px - ${comsoToolbarHeight}px - 8px)`,
            marginTop: 56 + comsoToolbarHeight,
            borderRadius: "24px 24px 0px 0px",
            background: colors.paper
          }}
        >
          <video controls={false} id="me-video" style={{ display: videoStreams[bigUserId] ? 'block' : 'none', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px 24px 0px 0px' }} autoplay="true"></video>
          <Paper id="me-screen-container" elevation={8} style={{
            borderRadius: 12, position: 'absolute',
            left: 16, bottom: 32 + 150 + 88, display: screenStreams[bigUserId] ? 'block' : 'none', width: 'calc(100% - 32px)', height: 250,
            background: 'transparent'
          }}>
            <video controls={false} id="me-screen" style={{ opacity: 0.75, borderRadius: 12, width: '100%', height: '100%', objectFit: 'fill' }} autoplay="true"></video>
            <Zoom in={screenStreams[bigUserId]}>
              <Fab
                size="medium"
                sx={{
                  bgcolor: yellow[600]
                }}
                style={{
                  marginTop: -48 - 16,
                  float: 'right',
                  marginRight: 16
                }}
                onClick={() => {
                  if (screenStreams[bigUserId]) {
                    publish(uiEvents.CREATE_FLOATING_VIDEO, { stream: screenStreams[bigUserId], type: 'screen' });
                  }
                }}
              >
                <PictureInPictureIcon />
              </Fab>
            </Zoom>
          </Paper>
          <div
            style={{
              width: "100%",
              height: peopleMaximize ? 'calc(100% - 132px)' : (150 + 16 + 16),
              overflowX: "auto",
              position: "fixed",
              left: 0,
              bottom: 0,
              zIndex: 7,
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              zIndex: 10,
              transition: 'height 0.5s'
            }}
          >
            <div id="people" style={{
              width: 'calc(100% - 32px)', marginTop: peopleMaximize ? 48 : 16, marginLeft: 16,
              marginRight: 16, textAlign: 'center', display: 'flex', flexWrap: 'wrap'
            }}>
              {
                Object.keys(users).map(userId => {
                  if (userId === 'undefined') {
                    return null;
                  } else if (videoStreams[userId] && screenStreams[userId]) {
                    return (<PeerVideo id={userId} currentBigUserId={bigUserId} stream={videoStreams[userId]} />);
                  } else if (videoStreams[userId] && !screenStreams[userId]) {
                    return (<PeerVideo id={userId} currentBigUserId={bigUserId} stream={videoStreams[userId]} />);
                  } else if (!videoStreams[userId] && screenStreams[userId]) {
                    return (<PeerVideo id={userId} currentBigUserId={bigUserId} stream={screenStreams[userId]} />);
                  } else if (!videoStreams[userId] && !screenStreams[userId]) {
                    return (<PeerEmpty id={userId} currentBigUserId={bigUserId} />);
                  }
                })
              }
              {Object.keys(audioStreams).map(id =>
                <PeerAudio id={id} stream={audioStreams[id]} />
              )}
            </div>
          </div>
        </Paper>
        <Zoom in={!maximizeBtnHidden}>
          <Fab
            size="medium"
            style={{
              backdropFilter: colors.backdrop,
              position: "fixed",
              right: 24,
              bottom: peopleMaximize ? undefined : (150 + 16 + 16 - 24),
              top: peopleMaximize ? 108 : undefined,
            }}
            onClick={() => {
              this.setState({ maximizeBtnHidden: true });
              setTimeout(() => {
                this.setState({ peopleMaximize: !peopleMaximize });
              }, 150);
              setTimeout(() => {
                this.setState({ maximizeBtnHidden: false });
              }, 700);
            }}
            sx={{ bgcolor: yellow[600] }}
          >
            {peopleMaximize ? <CloseFullscreenIcon /> : <AllOut />}
          </Fab>
        </Zoom>
        <Zoom in={!maximizeBtnHidden}>
          <Fab
            size="medium"
            style={{
              backgroundColor: colors.primary,
              backdropFilter: colors.backdrop,
              position: "fixed",
              left: 16,
              bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
              top: peopleMaximize ? 108 : undefined,
            }}
            onClick={() => this.toggleScreen()}
          >
            <Screenshot style={{ fill: colors.fabIcon }} />
          </Fab>
        </Zoom>
        <Zoom in={!maximizeBtnHidden}>
          <Fab
            size="medium"
            style={{
              backgroundColor: colors.primary,
              backdropFilter: colors.backdrop,
              position: "fixed",
              left: 16 + 48 + 8,
              bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
              top: peopleMaximize ? 108 : undefined,
            }}
            onClick={() => this.toggleVideo()}
          >
            <Videocam style={{ fill: colors.fabIcon }} />
          </Fab>
        </Zoom>
        <Zoom in={!maximizeBtnHidden}>
          <Fab
            size="medium"
            style={{
              backgroundColor: colors.primary,
              backdropFilter: colors.backdrop,
              position: "fixed",
              left: 16 + 48 + 8 + 48 + 8,
              bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
              top: peopleMaximize ? 108 : undefined,
            }}
            onClick={() => this.toggleAudio()}
          >
            <Mic style={{ fill: colors.fabIcon }} />
          </Fab>
        </Zoom>
        <Zoom in={!maximizeBtnHidden}>
          <Fab
            size="medium"
            sx={{
              bgcolor: red[600]
            }}
            style={{
              position: "fixed",
              left: 16 + 48 + 8 + 48 + 8 + 48 + 8,
              bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
              top: peopleMaximize ? 108 : undefined,
            }}
            onClick={() => {
              this.exit();
              this.workspaceRef.current = undefined;
              this.workspaceRef.current = undefined;
              this.userRef.current = undefined;
              extOpen = false;
              this.setState({ timer: '00:00' });
              this.close();
            }}
          >
            <CallEnd style={{ fill: '#fff' }} />
          </Fab>
        </Zoom>
        <Zoom in={!maximizeBtnHidden}>
          <Fab
            size="medium"
            sx={{
              bgcolor: yellow[600]
            }}
            style={{
              position: "fixed",
              left: 16 + 48 + 8 + 48 + 8 + 48 + 8 + 8 + 48,
              bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
              top: peopleMaximize ? 108 : undefined,
            }}
            onClick={() => {
              publish(uiEvents.OPEN_DRAWER_MENU, {
                view: <PeopleMenu videoPeers={users} />,
                openDrawer: true
              });
            }}
          >
            <PeopleIcon />
          </Fab>
        </Zoom>
        <Zoom in={!peopleMaximize && videoStreams[bigUserId]}>
          <Fab
            size="medium"
            sx={{
              bgcolor: yellow[600]
            }}
            style={{
              position: "fixed",
              right: 24,
              top: 56 + 24 + comsoToolbarHeight,
            }}
            onClick={() => {
              if (videoStreams[bigUserId]) {
                publish(uiEvents.CREATE_FLOATING_VIDEO, { stream: videoStreams[bigUserId], type: 'video' });
              }
            }}
          >
            <PictureInPictureIcon />
          </Fab>
        </Zoom>
      </div>
    );
  }
}
