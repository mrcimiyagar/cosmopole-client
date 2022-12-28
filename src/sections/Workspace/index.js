import {
  AppBar,
  Avatar,
  Card,
  Checkbox,
  Dialog,
  Divider,
  Fab,
  Fade,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import React from "react";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Search from "@mui/icons-material/Search";
import Add from "@mui/icons-material/Add";
import { colors } from "../../config/colors";
import AllOut from "@mui/icons-material/AllOut";
import VideoCallSampleMe from "../../data/photos/video-call-sample-me.png";
import VideoCallSampleYou from "../../data/photos/video-call-sample-you.png";
import ScreemshareSample from "../../data/photos/screenshare-sample.png";
import Folder from "@mui/icons-material/Folder";
import Task from "@mui/icons-material/Task";

import TriangleIcon from '@mui/icons-material/ChangeHistory';
import RectangleIcon from '@mui/icons-material/Crop54';
import OvalIcon from '@mui/icons-material/PanoramaFishEye';
import PencilIcon from '@mui/icons-material/DriveFileRenameOutline';
import BrushIcon from '@mui/icons-material/Brush';
import LineIcon from '@mui/icons-material/Timeline';
import MoveIcon from '@mui/icons-material/PanTool';
import TextFieldsIcon from '@mui/icons-material/TextFields';

import {
  CallEnd,
  Chat,
  Close,
  Delete,
  Mic,
  OndemandVideo,
  PlayArrow,
  Poll,
  Redo,
  Screenshot,
  Slideshow,
  Undo,
  Videocam,
} from "@mui/icons-material";
import PdfIcon from "../../data/photos/pdf.png";
import ClassIcon from "../../data/photos/class.png";
import { Box } from "@mui/system";
import VideoSample from "../../data/photos/video-sample.png";
import ClosedCaption from "@mui/icons-material/ClosedCaption";
import ChatSection from "../Chat";
import styled from "@emotion/styled";
import DataObjectIcon from "@mui/icons-material/DataObject";
import BarChartIcon from "@mui/icons-material/BarChart";
import TaskIcon from "@mui/icons-material/Task";
import PollIcon from "@mui/icons-material/Poll";
import People from "../../data/photos/video-call-sample-me.png";
import { Whiteboard } from '../../components/Whiteboard';
import generatePage from "../../utils/PageGenerator";
import { fetchCurrentWorkspaceId } from "../../core/storage/auth";
import { workspacesDictById } from "../../core/memory";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import uiEvents from '../../config/ui-events.json';
import { publish } from "../../core/bus";
import BaseSection from "../../utils/SectionEssentials";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  textAlign: "center",
  width: 60,
  height: 60,
  borderRadius: 16,
}));

const NewNote = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  textAlign: "center",
  width: 60,
  height: 60,
}));

export let closeWorkspace = () => { };

export default class Workspace extends BaseSection {
  workspace;
  constructor(props) {
    super(props);
    this.state = {
      toolboxOpen: false,
      toolId: undefined,
      color: '#000',
      showWorkers: false,
      chatOpen: false,
      chatCompKey: Math.random(),
      preChatOpenChange: false
    };
  }
  render() {
    let { toolboxOpen,
      toolId,
      color,
      showWorkers,
      chatOpen,
      chatCompKey,
      preChatOpenChange
    } = this.state;
    let {
      user
    } = this.props;
    let workspaceAvatarColor = workspacesDictById[fetchCurrentWorkspaceId()].avatarBackColor;
    return this.renderWrapper(
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <Fade
          in={toolboxOpen}
          timeout={500}>
          <div
            style={{
              padding: 16,
              position: "fixed",
              right: 0,
              top: 0,
              width: 300,
              height: "100%",
              background: colors.paper
            }}
          >
            <IconButton
              style={{ position: "absolute", right: 16 }}
              onClick={() => this.setState({ toolboxOpen: false })}
            >
              <Close />
            </IconButton>
            <Typography variant="h5">Bots</Typography>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              style={{ marginTop: 16 }}
            >
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#1976D2", marginBottom: 32 }}>
                  <DataObjectIcon
                    style={{ fill: "#fff", margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Codes
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#00796B" }}>
                  <BarChartIcon
                    style={{ fill: "#fff", margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Chart
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#FFA000" }}>
                  <TaskIcon
                    style={{ fill: "#fff", margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Task
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#E64A19" }}>
                  <PollIcon
                    style={{ fill: "#fff", margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Poll
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#303F9F", marginBottom: 32 }}>
                  <Slideshow
                    style={{ fill: "#fff", margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Slide
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#512DA8" }}>
                  <OndemandVideo
                    style={{ fill: "#fff", margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Video
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#7B1FA2" }}>
                  <Folder
                    style={{ fill: "#fff", margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    Files
                  </Typography>
                </Item>
              </Grid>
              <Grid item xs={3}>
                <Item style={{ backgroundColor: "#689F38" }}>
                  <AllOut
                    style={{ fill: colors.textPencil, margin: "auto", marginTop: 18 }}
                  />
                  <Typography
                    variant={"subtitle2"}
                    style={{ width: "100%", marginTop: 16 }}
                  >
                    More
                  </Typography>
                </Item>
              </Grid>
            </Grid>
            <Typography variant="h5" style={{ marginTop: 32, marginBottom: 16 }}>
              People{" "}
              <Typography variant={"caption"} style={{ color: "#333" }}>
                (250 users)
              </Typography>
            </Typography>
            <div style={{ display: "flex" }}>
              <Avatar
                alt={"people"}
                src={People}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  border: `${colors.paper} 4px solid`,
                }}
              />
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <Avatar
                  alt={"people"}
                  src={People}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    border: `${colors.paper} 4px solid`,
                    marginLeft: -28,
                  }}
                />
              ))}
              <Avatar
                alt={"more"}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  border: `${colors.paper} 4px solid`,
                  marginLeft: -28,
                }}
              >
                <AllOut style={{ fill: colors.textPencil }} />
              </Avatar>
            </div>
            <Typography variant="h5" style={{ marginTop: 32 }}>
              New note
            </Typography>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              style={{ marginTop: 16 }}
            >
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#1976D2", marginBottom: 16 }}
                ></NewNote>
              </Grid>
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#00796B" }}
                ></NewNote>
              </Grid>
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#FFA000" }}
                ></NewNote>
              </Grid>
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#E64A19" }}
                ></NewNote>
              </Grid>
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#E64A19", marginBottom: 16 }}
                ></NewNote>
              </Grid>
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#FFA000" }}
                ></NewNote>
              </Grid>
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#00796B" }}
                ></NewNote>
              </Grid>
              <Grid item xs={3}>
                <NewNote
                  elevation={12}
                  style={{ backgroundColor: "#1976D2" }}
                ></NewNote>
              </Grid>
            </Grid>
          </div>
        </Fade>
        <Paper
          elevation={6}
          style={{
            position: "relative",
            borderRadius: 0,
            width: "100%",
            height: "100%",
            transform: `translateX(${toolboxOpen ? -300 : 0}px)`,
            transition: "transform 0.5s",
            background: colors.semiTransparentPaper,
            backdropFilter: colors.backdrop
          }}
        >
          <AppBar
            style={{
              position: "fixed",
              left: 0,
              top: comsoToolbarHeight,
              width: 300,
              height: 56,
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              borderRadius: "0px 0px 24px 0px",
            }}
          >
            <Toolbar>
              <IconButton onClick={this.close}>
                <ArrowBack style={{ fill: colors.textPencil }} />
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
                alt={user !== undefined ? (user.firstName + ' ' + user.lastName) : this.workspace !== undefined ? this.workspace.title : '-'}
                style={{ width: 40, height: 40 }}
              >
                {
                  workspacesDictById[fetchCurrentWorkspaceId()]?.title.substring(0, 1).toUpperCase()
                }
              </Avatar>
              <Typography
                style={{ color: colors.textPencil, marginLeft: 8 }}
              >
                {
                  workspacesDictById[fetchCurrentWorkspaceId()]?.title
                }
              </Typography>
              <IconButton style={{ marginLeft: 'auto', marginRight: 0 }}>
                <Search style={{ fill: colors.textPencil }} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "fixed",
              left: 0,
              top: 0,
              overflowY: "auto",
            }}
          >
            <div style={{ width: '100%', height: '100%', position: 'absolute', left: 0, top: 0 }}>
              <Whiteboard toolId={toolId} color={color} />
            </div>
            <Zoom in={showWorkers} style={{ transitionDelay: showWorkers ? "500ms" : "0ms" }}>
              <Paper
                elevation={8}
                style={{
                  width: 136,
                  height: 168,
                  borderRadius: 16,
                  marginTop: -8,
                  marginLeft: 288,
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
                  src={VideoCallSampleMe}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 8,
                    transform: "translateX(-50%)",
                    display: "flex",
                  }}
                >
                  <Fab
                    size="small"
                    style={{
                      marginRight: 8,
                      backgroundColor: colors.textPencil,
                    }}
                  >
                    <Screenshot style={{ fill: colors.paper }} />
                  </Fab>
                  <Fab
                    size="small"
                    style={{
                      backgroundColor: colors.textPencil,
                    }}
                  >
                    <Mic style={{ fill: colors.paper }} />
                  </Fab>
                  <Fab
                    size="small"
                    style={{
                      marginLeft: 8,
                      backgroundColor: colors.textPencil,
                    }}
                  >
                    <Videocam style={{ fill: colors.paper }} />
                  </Fab>
                </div>
              </Paper>
            </Zoom>
            <Zoom in={showWorkers} style={{ transitionDelay: showWorkers ? "650ms" : "0ms" }}>
              <div
                style={{
                  width: 112,
                  height: 168,
                }}
              >
                <Paper
                  elevation={8}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    marginTop: -64,
                    marginLeft: 96,
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
                    src={VideoCallSampleYou}
                  />
                  <Fab
                    color={"secondary"}
                    size="small"
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: 8,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <CallEnd style={{ fill: colors.paper }} />
                  </Fab>
                </Paper>
              </div>
            </Zoom>
            <Zoom in={showWorkers} style={{ transitionDelay: showWorkers ? "800ms" : "0ms" }}>
              <div
                style={{
                  width: 227,
                  height: 168,
                  marginLeft: 144,
                  marginTop: -32,
                }}
              >
                <Paper
                  elevation={8}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    display: "flex",
                    position: "relative",
                    zIndex: 5,
                    backgroundColor: colors.semiTransparentPaper,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <img
                    src={VideoCallSampleYou}
                    style={{
                      borderRadius: "16px 0px 0px 16px",
                      objectFit: "cover",
                      width: "calc(50% - 2px)",
                      height: "100%",
                    }}
                    alt={"call-sample-you"}
                  />
                  <div
                    style={{
                      width: 2,
                      height: "100%",
                      backgroundColor: "lightgray",
                    }}
                  />
                  <img
                    src={ScreemshareSample}
                    style={{
                      borderRadius: "0px 16px 16px 0px",
                      objectFit: "cover",
                      width: "50%",
                      height: "100%",
                    }}
                    alt={"screenshare-sample"}
                  />
                  <Fab
                    color={"secondary"}
                    size="small"
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: 8,
                      transform: "translateX(-50%)",
                    }}
                  >
                    <CallEnd style={{ fill: colors.paper }} />
                  </Fab>
                </Paper>
              </div>
            </Zoom>
            <Zoom
              in={showWorkers}
              style={{ transitionDelay: showWorkers ? "1100ms" : "0ms" }}
            >
              <div
                style={{
                  width: 224,
                  height: 224,
                  marginTop: 16,
                  marginLeft: 180,
                }}
              >
                <Paper
                  sx={{ bgcolor: yellow[600] }}
                  style={{
                    padding: 8,
                    borderRadius: 12,
                    position: "relative",
                    zIndex: 5,
                    width: 40,
                    height: 40,
                    marginLft: 12,
                  }}
                  elevation={8}
                >
                  <Poll style={{ fill: "#fff" }} />
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
                        <Avatar src={ClassIcon} style={{ padding: 4 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary="Presentation 1"
                        secondary={<LinearProgressWithLabel value={15} />}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={ClassIcon} style={{ padding: 4 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary="Presentation 2"
                        secondary={<LinearProgressWithLabel value={55} />}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={ClassIcon} style={{ padding: 4 }} />
                      </ListItemAvatar>
                      <ListItemText
                        primary="Presentation 3"
                        secondary={<LinearProgressWithLabel value={30} />}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </div>
            </Zoom>
            <Zoom
              in={showWorkers}
              style={{ transitionDelay: showWorkers ? "1250ms" : "0ms" }}
            >
              <div
                style={{
                  width: 168,
                  height: 168,
                  marginTop: -16,
                  marginLeft: 16,
                }}
              >
                <Paper
                  sx={{ bgcolor: yellow[600] }}
                  style={{
                    padding: 8,
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
              </div>
            </Zoom>
            <Zoom
              in={showWorkers}
              style={{ transitionDelay: showWorkers ? "1400ms" : "0ms" }}
            >
              <Paper
                elevation={8}
                style={{
                  width: 168,
                  height: 128,
                  borderRadius: 16,
                  marginTop: -312,
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
                  <PlayArrow style={{ fill: colors.textPencil }} />
                </Fab>
              </Paper>
            </Zoom>
            <Zoom
              in={showWorkers}
              style={{ transitionDelay: showWorkers ? "1550ms" : "0ms" }}
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
                  sx={{ bgcolor: yellow[600] }}
                  style={{
                    padding: 8,
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
              </div>
            </Zoom>
            <Fade
              in={showWorkers}
              style={{ transitionDelay: showWorkers ? "1700ms" : "0ms" }}
            >
              <div
                style={{
                  position: "fixed",
                  left: 96,
                  top: 196 + 96,
                  zIndex: 10,
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 2,
                    backgroundColor: "#666",
                    transform: "rotate(+22.5deg)",
                  }}
                />
              </div>
            </Fade>
            <Zoom
              in={showWorkers}
              style={{ transitionDelay: showWorkers ? "1700ms" : "0ms" }}
            >
              <div
                style={{
                  width: 224,
                  height: 112,
                  marginTop: -684,
                  marginLeft: 12,
                  position: "relative",
                  zIndex: 11,
                }}
              >
                <Paper
                  sx={{ bgcolor: yellow[600] }}
                  style={{
                    padding: 8,
                    borderRadius: 12,
                    position: "relative",
                    zIndex: 5,
                    width: 40,
                    height: 40,
                  }}
                  elevation={8}
                >
                  <ClosedCaption style={{ fill: "#fff" }} />
                </Paper>
                <Paper
                  style={{
                    marginTop: -24,
                    marginLeft: 16,
                    width: "calc(100% - 16px)",
                    height: "calc(100% - 32px)",
                    position: "relative",
                    borderRadius: 16,
                    backgroundColor: colors.semiTransparentPaper,
                    backdropFilter: "blur(10px)",
                  }}
                  elevation={8}
                >
                  <div
                    style={{ width: "100%", paddingLeft: 24, paddingTop: 24 }}
                  >
                    <Typography variant="caption" style={{ width: "100%" }}>
                      Hi Kasper. I need help in designing my home...
                    </Typography>
                  </div>
                </Paper>
              </div>
            </Zoom>
          </div>
          <Paper
            style={{
              position: "fixed",
              right: 0,
              bottom: 0,
              width: 300,
              height: 64,
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              borderRadius: "24px 0px 0px 0px",
            }}
            elevation={8}
          >
            <Toolbar style={{ paddingTop: 8 }}>
              <Fab style={{ backgroundColor: colors.paper }} size={"small"}>
                <AllOut style={{ fill: colors.textPencil }} />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginLeft: 8,
                }}
                size={"small"}
                onClick={() => {
                  this.setState({ color: '#303F9F' });
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#303F9F",
                    borderRadius: 20,
                  }}
                />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginLeft: 8,
                }}
                size={"small"}
                onClick={() => {
                  this.setState({ color: '#C2185B' });
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#C2185B",
                    borderRadius: 20,
                  }}
                />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginLeft: 8,
                }}
                size={"small"}
                onClick={() => {
                  this.setState({ color: '#FFA000' });
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#FFA000",
                    borderRadius: 20,
                  }}
                />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginLeft: 8,
                }}
                size={"small"}
                onClick={() => {
                  this.setState({ color: '#00796B' });
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#00796B",
                    borderRadius: 20,
                  }}
                />
              </Fab>
              <Fab
                style={{
                  padding: 4,
                  backgroundColor: colors.paper,
                  marginLeft: 8,
                }}
                size={"small"}
                onClick={() => {
                  this.setState({ color: '#512DA8' });
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 32,
                    backgroundColor: "#512DA8",
                    borderRadius: 20,
                  }}
                />
              </Fab>
            </Toolbar>
          </Paper>
          <Paper
            elevation={8}
            style={{
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              maxHeight: 500,
              padding: 8,
              width: 56,
              borderRadius: "0px 24px 24px 0px",
              position: "fixed",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'pencil' })}
            >
              <PencilIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => publish(uiEvents.DELETE_SELECTION_WHITEBOARD, {})}
            >
              <Delete
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'brush' })}
            >
              <BrushIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'text' })}
            >
              <TextFieldsIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'rect' })}
            >
              <RectangleIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'triangle' })}
            >
              <TriangleIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'oval' })}
            >
              <OvalIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'line' })}
            >
              <LineIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5,
                marginBottom: 8
              }}
              size={"small"}
              onClick={() => this.setState({ toolId: 'dragger' })}
            >
              <MoveIcon
                style={{
                  width: "calc(100% - 10px)",
                  height: "calc(100% - 10px)",
                  fill: colors.textPencil
                }}
              />
            </Fab>
          </Paper>
          <Paper
            elevation={8}
            style={{
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              padding: 8,
              width: 48,
              borderRadius: "24px 0px 0px 24px",
              position: "fixed",
              right: 0,
              top: 144,
            }}
          >
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => publish(uiEvents.REDO_WHITEBOARD, {})}
            >
              <Redo style={{ fill: colors.textPencil }} />
            </Fab>
            <Fab
              style={{
                backgroundColor: colors.paper,
                marginTop: 8,
                marginBottom: 8,
                padding: 5
              }}
              size={"small"}
              onClick={() => publish(uiEvents.UNDO_WHITEBOARD, {})}
            >
              <Undo style={{ fill: colors.textPencil }} />
            </Fab>
          </Paper>
          <Fab
            sx={{ bgcolor: yellow[600] }}
            style={{
              backdropFilter: colors.backdrop,
              position: "fixed",
              right: 16,
              bottom: 16 + 64,
            }}
            onClick={() => this.setState({ toolboxOpen: true })}
          >
            <Add style={{ fill: colors.paper }} />
          </Fab>
          <Fab
            sx={{ bgcolor: yellow[600] }}
            style={{
              backdropFilter: colors.backdrop,
              position: "fixed",
              right: 16,
              bottom: 16 + 64 + 16 + 56,
            }}
            onClick={() => {
              this.setState({ preChatOpenChange: true, chatOpen: true });
            }}
          >
            <Chat style={{ fill: colors.paper }} />
          </Fab>
          {toolboxOpen ? (
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.33)",
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 99999,
                opacity: toolboxOpen ? 1 : 0,
              }}
              onClick={() => this.setState({ toolboxOpen: false })}
            />
          ) : null}
        </Paper>
        {
          chatOpen ? (
            <div style={{ width: '100%', height: '100%', position: 'fixed', left: 0, bottom: 0 }}>
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div style={{
                  width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, backgroundColor: '#000',
                  opacity: preChatOpenChange ? 0.35 : 0, transition: 'opacity 250ms'
                }} />
                <ChatSection
                  key={chatCompKey}
                  tag={chatCompKey}
                  sheet={true}
                  workspaceId={fetchCurrentWorkspaceId()}
                  onSheetHide={() => {
                    this.setState({ preChatOpenChange: false });
                  }}
                  onSheetClose={() => {
                    this.setState({ chatOpen: false });
                  }} />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}
