import {
  Avatar,
  Box,
  Card,
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
  People,
  Settings,
} from "@mui/icons-material";
import { colors } from "../../config/colors";
import { publish, subscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { enterRoom, enterTower, enterWorkspace } from "../../core/callables/auth";
import generatePage from "../../utils/PageGenerator";
import { blogsDict, filespacesDict, me, roomsDict, usersDict, workspacesDict } from "../../core/memory";
import { blue, green, grey, purple, red, yellow } from "@mui/material/colors";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import { createBlock } from "../../core/callables/block";
import useLongPress from "../../utils/LongPress";
import SpacesGrid from "../../components/SpacesGrid";
import topics from '../../core/events/topics.json';
import { dbFetchMMyMemberships, dbFetchRoomMemberships } from "../../core/storage/spaces";
import useForceUpdate from "../../utils/ForceUpdate";
import { readUserById } from "../../core/callables/users";
import BaseSection from "../../utils/SectionEssentials";
import updates from '../../core/network/updates.json';

let WorkspaceItem = ({ workspace }) => {
  const onLongPress = () => {
    const roomId = fetchCurrentRoomId();
    createBlock(0, 0, 2, 2, JSON.stringify({ type: 'workspace', workspaceId: workspace.id }));
  };
  const onClick = () => {
    enterWorkspace(workspace.id, true);
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

let BlogItem = ({ blog }) => {
  const onLongPress = () => {
    const roomId = fetchCurrentRoomId();
    createBlock(0, 0, 2, 2, JSON.stringify({ type: 'blog', blogId: blog.id }));
  };
  const onClick = () => {
    publish(uiEvents.NAVIGATE, { navigateTo: 'Blog', blog: blog });
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

let FilespaceItem = ({ filespace }) => {
  const onLongPress = () => {
    const roomId = fetchCurrentRoomId();
    createBlock(0, 0, 2, 2, JSON.stringify({ type: 'filespace', filespaceId: filespace.id }));
  };
  const onClick = () => {
    publish(uiEvents.NAVIGATE, { navigateTo: 'Filespace', filespace: filespace });
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

let UserItem = ({ userId, room }) => {
  const [user, setUser] = React.useState(usersDict[userId]);
  React.useEffect(() => {
    if (!user) {
      readUserById(userId, u => {
        setUser(u);
      });
    }
  }, []);
  if (!user) {
    return null;
  }
  let avatarBackColor = user.avatarBackColor;
  return (
    <Grid item xs={3}>
      <div style={{ width: '100%', height: 128, position: 'relative' }} onClick={e => {
        e.stopPropagation();
        e.preventDefault();
        publish(uiEvents.CLOSE_DRAWER_MENU, {});
        publish(uiEvents.NAVIGATE, { navigateTo: 'UserProfile', user: user });
      }}>
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
                {user.firstName?.substring(0, 1).toUpperCase()}
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
          {me.id === user.id ? 'me' : user.firstName}
        </Typography>
        <Typography style={{ fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center', color: colors.textPencil }}>human</Typography>
        <Fab size={'small'} sx={{ bgcolor: yellow[800] }} style={{ top: 0, right: -16, position: 'absolute' }} onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          publish(uiEvents.CLOSE_DRAWER_MENU, {});
          publish(uiEvents.NAVIGATE, { navigateTo: 'Permissions', user: user, room: room });
        }}>
          <Settings />
        </Fab>
      </div>
    </Grid>
  );
};

let PeopleMenu = ({ room }) => {
  const [members, setMembers] = React.useState([]);
  useEffect(() => {
    dbFetchRoomMemberships(fetchCurrentRoomId()).then(ms => {
      setMembers(ms);
    });
  }, []);
  return (
    <Box
      sx={{ width: '100%', height: 400 }}
      role="presentation"
    >
      <Card style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 100, height: 6, borderRadius: 3, backgroundColor: 'grey', top: 12 }} />
      <Typography style={{ paddingLeft: 24, paddingTop: 32, fontWeight: 'b0ld', color: colors.textPencil }} variant={'h6'}>
        People in the room
      </Typography>
      <Grid container spacing={3} style={{ padding: 24 }}>
        <UserItem userId={me.id} />
        {
          members.map(member => {
            return (
              <UserItem room={room} userId={member.userId} />
            );
          })
        }
        <Grid item xs={12}>
          <div style={{ height: 48, width: '100%' }} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default class Room extends BaseSection {
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
    this.wire(topics.WORKSPACE_CREATED, () => this.forceUpdate());
    this.wire(topics.FILESPACE_CREATED, () => this.forceUpdate());
    this.wire(topics.BLOG_CREATED, () => this.forceUpdate());
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
        height: '100%',
        zIndex: 2,
        position: 'absolute',
        left: 0,
        top: 0
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
                  {room.title}
                </Typography>
                <Typography
                  style={{
                    textAlign: "left",
                    color: colors.textPencil,
                  }}
                  variant={"subtitle2"}
                >
                  room
                </Typography>
              </div>
              <IconButton onClick={() => {
                publish(uiEvents.OPEN_DRAWER_MENU, {
                  view: <PeopleMenu room={room} />,
                  openDrawer: true
                });
              }}>
                <People style={{ fill: colors.textPencil }} />
              </IconButton>
              <div style={{ width: 40, height: 40 }} />
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
                      {workspacesDict[room.id].map((workspace, index) => (<WorkspaceItem key={'room_workspaces_list_' + index} workspace={workspace} />))}
                      <Grid item xs={12}>
                        <div style={{ height: 48, width: '100%' }} />
                      </Grid>
                    </Grid>
                  </div>
                ) : page === 2 ?
                  (
                    <div style={{ width: '100%', marginLeft: -1 }}>
                      <Grid container spacing={3} style={{ marginTop: 64, padding: 24 }}>
                        {filespacesDict[room.id].map((filespace, index) => (<FilespaceItem key={'room_filespaces_list_' + index} filespace={filespace} />))}
                        <Grid item xs={12}>
                          <div style={{ height: 48, width: '100%' }} />
                        </Grid>
                      </Grid>
                    </div>
                  ) :
                  (
                    <div style={{ width: '100%', marginLeft: -1 }}>
                      <Grid container spacing={3} style={{ marginTop: 64, padding: 24 }}>
                        {blogsDict[room.id].map((blog, index) => (<BlogItem key={'room_blogs_list_' + index} blog={blog} />))}
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
