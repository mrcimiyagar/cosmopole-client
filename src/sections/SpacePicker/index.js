import {
  Box,
  Divider,
  Fab,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  Add,
  ArrowBack,
  ChatBubble,
  Edit,
} from "@mui/icons-material";
import { colors } from "../../config/colors";
import { publish, subscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { enterRoom, enterTower, enterWorkspace } from "../../core/callables/auth";
import generatePage from "../../utils/PageGenerator";
import { blogsDict, blogsDictById, filespacesDict, filespacesDictById, roomsDict, workspacesDict, workspacesDictById } from "../../core/memory";
import { grey, yellow } from "@mui/material/colors";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import { createBlock } from "../../core/callables/block";
import useLongPress from "../../utils/LongPress";
import SpacesGrid from "../../components/SpacesGrid";
import topics from '../../core/events/topics.json';
import { createWorkspace } from "../../core/callables/spaces";
import { createStorageMessage, createWorkspaceMessage } from "../../core/callables/messenger";
import BaseSection from "../../utils/SectionEssentials";
import updates from '../../core/network/updates.json';

let WorkspaceItem = ({ workspace, close }) => {
  const onLongPress = () => {

  };
  const onClick = () => {
    close();
    createWorkspaceMessage('workspace shared with you...', workspace.id, '0', '0', '0');
  }
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
  return (
    <Grid item xs={4}>
      <div style={{ marginLeft: -6, width: window.innerWidth / 3 - 20 + 'px', height: 176, position: 'relative' }}>
        <Paper
          {...longPressEvent}
          elevation={8}
          style={{
            borderRadius: 16, width: '100%', height: 'calc(100% - 48px)',
            background: "linear-gradient(315deg, rgba(230, 74, 25, 1) 0%, rgba(255, 87, 34, 0.5) 100%)",
            paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
          }}>
          <Paper style={{ width: 72, height: 72, borderRadius: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
            <Typography style={{
              alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
              position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
            }}>
              W
            </Typography>
          </Paper>
        </Paper>
        <Typography style={{ color: colors.textPencil, fontSize: 14, marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{workspace.title}</Typography>
        <Typography style={{ color: colors.textPencil, fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>10 People</Typography>
        <Typography style={{ color: colors.textPencil, fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>10 Bots</Typography>
      </div>
    </Grid>
  );
};

let BlogItem = ({ blog, close }) => {
  const onLongPress = () => {

  };
  const onClick = () => {
    close();
    publish(uiEvents.SPACE_PICKED, { type: 'blog', blog: blog });
  }
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
  return (
    <Grid item xs={4}>
      <div style={{ marginLeft: -6, width: window.innerWidth / 3 - 20 + 'px', height: 176, position: 'relative' }}>
        <Paper
          {...longPressEvent}
          elevation={8}
          style={{
            borderRadius: 16, width: '100%', height: 'calc(100% - 48px)',
            background:
              "linear-gradient(315deg, rgba(0, 121, 107, 1) 0%, rgba(0, 150, 136, 0.5) 100%)",
            paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
          }}>
          <Paper style={{ width: 72, height: 72, borderRadius: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
            <Typography style={{
              alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
              position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
            }}>
              B
            </Typography>
          </Paper>
        </Paper>
        <Typography style={{ color: colors.textPencil, fontSize: 14, marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{blog.title}</Typography>
        <Typography style={{ color: colors.textPencil, fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>10 Posts</Typography>
      </div>
    </Grid>
  );
}

let FilespaceItem = ({ filespace, close }) => {
  const onLongPress = () => {

  };
  const onClick = () => {
    close();
    createStorageMessage('filespace shared with you...', filespace.id, '0', '0', '0');
  }
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
  return (
    <Grid item xs={4}>
      <div style={{ marginLeft: -6, width: window.innerWidth / 3 - 20 + 'px', height: 176, position: 'relative' }}>
        <Paper
          {...longPressEvent}
          elevation={8}
          style={{
            borderRadius: 16, width: '100%', height: 'calc(100% - 48px)',
            background:
              "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
            paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
          }}>
          <Paper style={{ width: 72, height: 72, borderRadius: '50%', marginLeft: 'auto', marginRight: 'auto', position: 'relative' }}>
            <Typography style={{
              alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
              position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
            }}>
              F
            </Typography>
          </Paper>
        </Paper>
        <Typography style={{ color: colors.textPencil, fontSize: 14, marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{filespace.title}</Typography>
        <Typography style={{ color: colors.textPencil, fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>5 Disks</Typography>
      </div>
    </Grid>
  );
}

export default class SpacePicker extends BaseSection {
  prevRoomId;
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      editMode: false
    };
  }
  componentDidMount() {
    super.componentDidMount();
    let { room } = this.props;
    this.prevRoomId = fetchCurrentRoomId();
    enterRoom(room.id);
    this.wire(updates.NEW_WORKSPACE, () => this.forceUpdate());
    this.wire(updates.NEW_FILESPACE, () => this.forceUpdate());
    this.wire(updates.NEW_BLOG, () => this.forceUpdate());
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    enterRoom(this.prevRoomId);
  }
  render() {
    let { room } = this.props;
    let { page, editMode } = this.state;
    return this.renderWrapper(
      <div style={{
        width: '100%',
        height: '100%'
      }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <div
            style={{
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
              height: 80 + comsoToolbarHeight,
            }}
          >
            <Toolbar style={{ transform: `translateY(${comsoToolbarHeight}px)` }}>
              <IconButton onClick={() => {
                this.close(true);
              }}>
                <ArrowBack style={{ fill: colors.textPencil }} />
              </IconButton>
              <Paper
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background:
                    "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
                }}
              >
                <Typography style={{ color: '#fff', textAlign: 'center', fontSize: 20, fontWeight: 'bold', paddingTop: 6 }}>{room.title.substring(0, 1).toUpperCase()}</Typography>
              </Paper>
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
                  Pick a space from {room.title}
                </Typography>
                <Typography
                  style={{
                    textAlign: "left",
                    color: colors.textPencil,
                  }}
                  variant={"subtitle2"}
                >
                  room space picker
                </Typography>
              </div>
            </Toolbar>
          </div>
          <Paper
            elevation={6}
            style={{
              borderRadius: "24px 24px 0px 0px",
              height: `calc(100% - 56px - ${comsoToolbarHeight}px)`,
              width: "100%",
              position: "fixed",
              left: 0,
              top: 56 + comsoToolbarHeight,
              background: colors.paper,
              overflowY: 'auto'
            }}
          >
            <ToggleButtonGroup
              color="primary"
              value={page}
              exclusive
              style={{
                position: 'fixed',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: colors.paper,
                zIndex: 7,
                marginTop: 32,
                borderRadius: 8

              }}
              onChange={(event, newPage) => {
                this.setState({ page: newPage });
              }}
            >
              <ToggleButton value={1} style={{ color: page === 1 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '16px 0px 0px 16px' }}>Workspaces</ToggleButton>
              <ToggleButton value={2} style={{ color: page === 2 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold' }}>Filespaces</ToggleButton>
              <ToggleButton value={3} style={{ color: page === 3 ? colors.primary : colors.textPencil, fontSize: 11, fontWeight: 'bold', borderRadius: '0px 16px 16px 0px' }}>Blogs</ToggleButton>
            </ToggleButtonGroup>
            {page === 0 ?
              (
                <SpacesGrid editMode={editMode} />
              ) : page === 1 ?
                (
                  <div style={{ width: '100%', marginLeft: -1 }}>
                    <Grid container spacing={3} style={{ marginTop: 64, padding: 24 }}>
                      {Object.values(workspacesDictById).map((workspace, index) => (<WorkspaceItem close={() => this.close(true)} key={'room_workspaces_list_' + index} workspace={workspace} />))}
                      <Grid item xs={12}>
                        <div style={{ height: 48, width: '100%' }} />
                      </Grid>
                    </Grid>
                  </div>
                ) : page === 2 ?
                  (
                    <div style={{ width: '100%', marginLeft: -1 }}>
                      <Grid container spacing={3} style={{ marginTop: 64, padding: 24 }}>
                        {Object.values(filespacesDictById).map((filespace, index) => (<FilespaceItem close={() => this.close(true)} key={'room_filespaces_list_' + index} filespace={filespace} />))}
                        <Grid item xs={12}>
                          <div style={{ height: 48, width: '100%' }} />
                        </Grid>
                      </Grid>
                    </div>
                  ) :
                  (
                    <div style={{ width: '100%', marginLeft: -1 }}>
                      <Grid container spacing={3} style={{ marginTop: 64, padding: 24 }}>
                        {Object.values(blogsDictById).map((blog, index) => (<BlogItem close={() => this.close(true)} key={'room_blogs_list_' + index} blog={blog} />))}
                        <Grid item xs={12}>
                          <div style={{ height: 48, width: '100%' }} />
                        </Grid>
                      </Grid>
                    </div>
                  )
            }
            <Fab sx={{
              bgcolor: yellow[600]
            }}
              style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => {
                if (page === 0) {
                  this.setState({ editMode: !editMode });
                } else if (page === 1) {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'CreateWorkspaceDlg' });
                } else if (page === 2) {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'CreateFilespaceDlg' });
                } else if (page === 3) {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'CreateBlogDlg' });
                }
              }}>
              {page === 0 ? <Edit /> : <Add />}
            </Fab>
            <Fab sx={{
              bgcolor: yellow[600]
            }}
              style={{ position: 'fixed', bottom: 24, right: 24 + 56 + 16 }} onClick={() => {
                publish(uiEvents.NAVIGATE, { navigateTo: 'Chat', workspaceId: workspacesDict[room.id].filter(w => w.title === 'main workspace')[0].id });
              }}>
              <ChatBubble />
            </Fab>
          </Paper>
        </div >
      </div >
    );
  }
}
