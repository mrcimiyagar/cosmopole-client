import {
  Avatar,
  Card,
  Dialog,
  Fab,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AddToQueue,
  MeetingRoom,
  PersonAdd,
  Segment,
  Settings,
  Star,
} from "@mui/icons-material";
import CSLogo from "../../data/photos/calculator.png";
import PushPinIcon from "@mui/icons-material/PushPin";
import PdfIcon from "../../data/photos/pdf.png";
import VideoSample from "../../data/photos/video-sample.png";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Zoom,
} from "@mui/material";
import React, { useEffect } from "react";
import MainTransition from "../../components/MainTransition";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { colors } from "../../config/colors";
import Folder from "@mui/icons-material/Folder";
import Task from "@mui/icons-material/Task";
import { Close, Forum, PlayArrow } from "@mui/icons-material";
import ChatSection from "../../sections/Chat";
import RoomProfile from "../RoomProfile";
import Commands from "../../components/Commands";
import CalculateIcon from '@mui/icons-material/Calculate';
import BotApplet from "../BotApplet";
import uiEvents from '../../config/ui-events.json';
import { publish } from "../../core/bus";

export let closeSpaceProfile = () => {};

export default function BotProfile(props) {
  const [open, setOpen] = React.useState(true);
  const [descShow, setDescShow] = React.useState(false);
  const [interact, setInteract] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [roomOpen, setRoomOpen] = React.useState(false);
  const [appletOpen, setAppletOpen] = React.useState(false);
  const [showToolbox, setShowToolbox] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 125);
  };
  closeSpaceProfile = () => {
    setOpen(false);
    setChatOpen(false);
    setRoomOpen(false);
  };
  useEffect(() => {
    setTimeout(() => {
      setDescShow(true);
    }, 750);
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            position: "relative",
            zIndex: 3,
            overflowX: "hidden",
          },
        }}
        fullScreen
        open={open}
        TransitionComponent={MainTransition}
      >
        <div
          style={{
            overflowY: "auto",
            width: 300,
            height: "100%",
            position: "fixed",
            right: 0,
            top: 0,
            backgroundColor: "#eee",
            padding: 16,
          }}
        >
          <div style={{marginTop: 56}} />
          <Commands actCommand={() => setShowToolbox(false)} />
          <IconButton
            style={{
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              position: "fixed",
              right: 16,
              top: 16,
            }}
            onClick={() => setShowToolbox(false)}
          >
            <Close />
          </IconButton>
        </div>
        <Paper
          elevation={6}
          style={{
            width: "100%",
            height: "100%",
            position: "fixed",
            left: 0,
            top: 0,
            borderRadius: 0,
            transform: showToolbox ? "translateX(-300px)" : "translateX(0px)",
            transition: "transform 0.5s",
          }}
        >
          <img
            alt={"logo"}
            style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              left: 0,
              top: 0,
              objectFit: "cover",
            }}
            src={CSLogo}
          />
          <Zoom in={descShow}>
            <div
              style={{
                marginLeft: 32,
                marginRight: 32,
                width: "calc(100% - 64px)",
                marginTop: window.innerWidth - 112 + "px",
              }}
            >
              <Paper
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 56,
                  backgroundColor: colors.semiTransparentPaper,
                  backdropFilter: colors.backdrop,
                  padding: 4,
                }}
              >
                <Typography
                  style={{
                    color: colors.black,
                    fontWeight: "bold",
                    fontSize: 16,
                    marginTop: 32,
                    width: "calc(100% - 64px)",
                    marginLeft: 32,
                    marginRight: 32,
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                  }}
                >
                  {"Calculator"}
                </Typography>
                <Typography
                  style={{
                    color: colors.black,
                    marginTop: 16,
                    textAlign: "center",
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
            </div>
          </Zoom>
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              left: 0,
              top: 0,
            }}
          >
            <Zoom
              in={interact}
              style={{ transitionDelay: interact ? "100ms" : "0ms" }}
            >
              <div
                style={{
                  width: 168,
                  height: 168,
                  marginTop: 112,
                  marginLeft: 16,
                }}
              >
                <Paper
                  style={{
                    padding: 8,
                    backgroundColor: colors.pen,
                    borderRadius: 12,
                    position: "relative",
                    zIndex: 5,
                    width: 40,
                    height: 40,
                  }}
                  elevation={8}
                >
                  <Folder style={{ fill: "#fff" }} />
                </Paper>
                <Paper
                  style={{
                    marginTop: -24,
                    marginLeft: 16,
                    width: "calc(100% - 16px)",
                    height: "calc(100% - 32px)",
                    position: "relative",
                    borderRadius: 16,
                    zIndex: 4,
                    backgroundColor: colors.semiTransparentPaper,
                    backdropFilter: "blur(10px)",
                  }}
                  elevation={8}
                >
                  <List dense={true}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={PdfIcon} style={{ padding: 4 }} />
                      </ListItemAvatar>
                      <ListItemText primary="Chapter 1" secondary={"1.5 MB"} />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={PdfIcon} style={{ padding: 4 }} />
                      </ListItemAvatar>
                      <ListItemText primary="Chapter 2" secondary={"3.5 MB"} />
                    </ListItem>
                  </List>
                </Paper>
                <Paper
                  elevation={8}
                  style={{
                    padding: 10,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    position: "relative",
                    zIndex: 5,
                    marginLeft: 120,
                    marginTop: -20,
                    backgroundColor: colors.pen,
                  }}
                  onClick={() => {
                    setChatOpen(true);
                  }}
                >
                  <Forum
                    style={{ fill: colors.paper, width: 20, height: 20 }}
                  />
                </Paper>
              </div>
            </Zoom>
            <Zoom
              in={interact}
              style={{ transitionDelay: interact ? "250ms" : "0ms" }}
            >
              <Paper
                elevation={8}
                style={{
                  width: 168,
                  height: 128,
                  borderRadius: 16,
                  marginTop: 56,
                  marginLeft: 56,
                  position: "relative",
                  zIndex: 4,
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 16,
                  }}
                  alt={"video"}
                  src={VideoSample}
                />
                <Fab
                  size="medium"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <PlayArrow style={{ fill: colors.pen }} />
                </Fab>
                <Paper
                  elevation={8}
                  style={{
                    padding: 10,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    position: "relative",
                    zIndex: 5,
                    marginLeft: 120,
                    marginTop: -32,
                    backgroundColor: colors.pen,
                  }}
                  onClick={() => {
                    setChatOpen(true);
                  }}
                >
                  <Forum
                    style={{ fill: colors.paper, width: 20, height: 20 }}
                  />
                </Paper>
              </Paper>
            </Zoom>
            <Zoom
              in={interact}
              style={{ transitionDelay: interact ? "400ms" : "0ms" }}
            >
              <div
                style={{
                  width: 224,
                  height: 168,
                  marginTop: 64,
                  marginLeft: 176,
                }}
              >
                <Paper
                  style={{
                    padding: 8,
                    backgroundColor: colors.pen,
                    borderRadius: 12,
                    position: "relative",
                    zIndex: 5,
                    width: 40,
                    height: 40,
                    marginLft: 12,
                  }}
                  elevation={8}
                >
                  <Task style={{ fill: "#fff" }} />
                </Paper>
                <Paper
                  style={{
                    marginTop: -24,
                    marginLeft: 16,
                    width: "calc(100% - 16px)",
                    height: "calc(100% - 32px)",
                    position: "relative",
                    borderRadius: 16,
                    zIndex: 4,
                    backgroundColor: colors.semiTransparentPaper,
                    backdropFilter: "blur(10px)",
                  }}
                  elevation={8}
                >
                  <div
                    style={{ width: "100%", paddingLeft: 24, paddingTop: 8 }}
                  >
                    <div>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Physics Exam"
                      />
                      <div style={{ display: "flex", marginLeft: 32 }}>
                        <Card
                          style={{
                            width: 32,
                            height: 4,
                            backgroundColor: "#FFA000",
                          }}
                        />
                        <Card
                          style={{
                            width: 32,
                            height: 4,
                            backgroundColor: "#00796B",
                            marginLeft: 4,
                          }}
                        />
                      </div>
                    </div>
                    <Divider style={{ marginTop: 16 }} />
                    <div>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Math Homework"
                      />
                      <div style={{ display: "flex", marginLeft: 32 }}>
                        <Card
                          style={{
                            width: 32,
                            height: 4,
                            backgroundColor: "#C2185B",
                          }}
                        />
                        <Card
                          style={{
                            width: 32,
                            height: 4,
                            backgroundColor: "#512DA8",
                            marginLeft: 4,
                          }}
                        />
                        <Card
                          style={{
                            width: 32,
                            height: 4,
                            backgroundColor: "#FFA000",
                            marginLeft: 4,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Paper>
                <Paper
                  elevation={8}
                  style={{
                    padding: 10,
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    position: "relative",
                    zIndex: 5,
                    marginLeft: 176,
                    marginTop: -20,
                    backgroundColor: colors.pen,
                  }}
                  onClick={() => {
                    setChatOpen(true);
                  }}
                >
                  <Forum
                    style={{ fill: colors.paper, width: 20, height: 20 }}
                  />
                </Paper>
              </div>
            </Zoom>
            <Zoom
              in={interact}
              style={{ transitionDelay: interact ? "400ms" : "0ms" }}
            >
              <div
                style={{
                  width: 112,
                  height: 112,
                  marginTop: -548,
                  marginLeft: 224,
                  padding: 25
                }}
              >
                <Paper
                  style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: colors.pen,
                    borderRadius: 24,
                    position: "relative",
                    zIndex: 5,
                    width: 72,
                    height: 72,
                    padding: 16
                  }}
                  onClick={() => setAppletOpen(true)}
                  elevation={8}
                >
                  <CalculateIcon style={{ fill: "#fff", width: '100%', height: '100%' }} />
                </Paper>
              </div>
            </Zoom>
          </div>
          <Toolbar
            style={{
              width: "100%",
              position: "fixed",
              top: 0,
              left: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, transparent 100%)",
            }}
          >
            <IconButton onClick={handleClose}>
              <ArrowBack style={{ fill: colors.paper }} />
            </IconButton>
            <div style={{ flex: 1 }} />
            <IconButton
              onClick={() => {
                //props.onAddToRoomSelected();
              }}
            >
              <AddToQueue style={{ fill: colors.paper }} />
            </IconButton>
          </Toolbar>
          <Fab
            style={{
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              position: "fixed",
              right: 16,
              bottom: 16,
            }}
            onClick={() => {
              if (descShow) {
                setDescShow(false);
                setTimeout(() => {
                  setInteract(true);
                }, 250);
              } else {
                setInteract(false);
                setTimeout(() => {
                  setDescShow(true);
                }, 250);
              }
            }}
          >
            {interact ? <Segment /> : <PushPinIcon />}
          </Fab>
          <Fab
            style={{
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              position: "fixed",
              right: 16 + 56 + 16,
              bottom: 16,
            }}
            onClick={() => {
              setShowToolbox(true);
            }}
          >
            <MeetingRoom />
          </Fab>
          <Paper
            style={{
              padding: 8,
              position: "fixed",
              left: 16,
              bottom: 16,
              backgroundColor: "#FFC107",
              display: "flex",
              width: "auto",
              borderRadius: 16,
            }}
            elevation={12}
          >
            <Star />
            <Typography style={{ marginLeft: 8 }}>Bot</Typography>
          </Paper>
          {showToolbox ? (
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.33)",
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 99999,
                opacity: showToolbox ? 1 : 0,
              }}
              onClick={() => setShowToolbox(false)}
            />
          ) : null}
        </Paper>
      </Dialog>
      {chatOpen ? <ChatSection destroy={() => setChatOpen(false)} /> : null}
      {roomOpen ? <RoomProfile showSwitch destroy={() => setRoomOpen(false)} /> : null}
      {appletOpen ? <BotApplet destroy={() => setAppletOpen(false)} /> : null }
    </div>
  );
}
