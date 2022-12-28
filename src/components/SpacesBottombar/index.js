import * as React from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ViewInAr from "@mui/icons-material/ViewInAr";
import Group from "@mui/icons-material/Group";
import { Fab, Grid, Paper, ToggleButton, ToggleButtonGroup, Toolbar } from "@mui/material";
import {
  AccountBalanceWallet,
  Add,
  AdminPanelSettings,
  Forum,
  Home,
  RocketLaunch,
  Search,
  Settings,
  Workspaces,
} from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AudioWidget from '../AudioWidget';
import { publish } from '../../core/bus/index';
import uiEvents from '../../config/ui-events.json';
import mirrorEvents from '../../core/mirrors/mirror-events.json';
import useForceUpdate from "../../utils/ForceUpdate";
import { blocks, blogs, currentRoom, filespaces, signalBlogs, signalFilespaces, signalRooms, signalTowers, signalWorkspaces, wireSignal, workspaces } from '../../core/mirrors';
import { fetchCurrentRoomId, fetchCurrentTowerId } from "../../core/storage/auth";
import { enterWorkspace } from "../../core/callables/auth";
import { dbFindTowerById } from "../../core/storage/spaces";
import useLongPress from '../../utils/LongPress';
import { createBlock } from "../../core/callables/block";
import EmailIcon from '@mui/icons-material/Email';
import { colors } from "../../config/colors";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: colors.semiTransparentPaper,
  backdropFilter: "blur(10px)",
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: colors.semiTransparentPaper,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: 16,
}));

let WorkspaceItem = ({ workspace, setOpen }) => {
  const onLongPress = () => {
    const roomId = fetchCurrentRoomId();
    createBlock(0, blocks(roomId).length, 2, 2, JSON.stringify({ type: 'workspace', workspaceId: workspace.id }));
  };
  const onClick = () => {
    setOpen(false);
    enterWorkspace(workspace.id, true);
  }
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
  return (
    <Grid item xs={4}>
      <div style={{ marginLeft: -4, width: window.innerWidth / 3 - 16 + 'px', height: window.innerWidth / 3 - 16 + 48 + 32 + 'px', position: 'relative' }}>
        <Paper
          {...longPressEvent}
          elevation={8}
          style={{
            borderRadius: 16, width: '100%', height: window.innerWidth / 3 - 16 + 'px',
            background: "linear-gradient(315deg, rgba(230, 74, 25, 1) 0%, rgba(255, 87, 34, 0.5) 100%)",
            paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
          }}>
          <Paper style={{ width: 64, height: 64, borderRadius: '50%', padding: 16, marginLeft: 'auto', marginRight: 'auto' }}>
            <Typography style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666' }}>W</Typography>
          </Paper>
        </Paper>
        <Typography style={{ marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{workspace.title}</Typography>
        <Typography style={{ fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>10 People</Typography>
        <Typography style={{ fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>10 Bots</Typography>
      </div>
    </Grid>
  );
};

let BlogItem = ({ blog, setOpen }) => {
  const onLongPress = () => {
    const roomId = fetchCurrentRoomId();
    createBlock(0, blocks(roomId).length, 2, 2, JSON.stringify({ type: 'blog', blogId: blog.id }));
  };
  const onClick = () => {
    setOpen(false);
    publish(uiEvents.NAVIGATE, { navigateTo: 'Blog', blog: blog });
  }
  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);
  return (
    <Grid item xs={4}>
      <div style={{ marginLeft: -4, width: window.innerWidth / 3 - 16 + 'px', height: window.innerWidth / 3 - 16 + 48 + 8 + 'px', position: 'relative' }}>
        <Paper
          {...longPressEvent}
          elevation={8}
          style={{
            borderRadius: 16, width: '100%', height: window.innerWidth / 3 - 16 + 'px',
            background:
              "linear-gradient(315deg, rgba(0, 121, 107, 1) 0%, rgba(0, 150, 136, 0.5) 100%)",
            paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
          }}>
          <Paper style={{ width: 64, height: 64, borderRadius: '50%', padding: 16, marginLeft: 'auto', marginRight: 'auto' }}>
            <Typography style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666' }}>B</Typography>
          </Paper>
        </Paper>
        <Typography style={{ marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{blog.title}</Typography>
        <Typography style={{ fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>10 Posts</Typography>
      </div>
    </Grid>
  );
}

function SpacesBottombar({ window, open, setOpen, openMediaPlayer }) {
  const [page, setPage] = React.useState(0);
  let forceUpdate = useForceUpdate();
  const container = window !== undefined ? () => window.document.body : undefined;
  React.useEffect(() => {
    let wireWorkspaces = wireSignal(mirrorEvents.WORKSPACES, forceUpdate);
    let wireFilespaces = wireSignal(mirrorEvents.FILESPACES, forceUpdate);
    let wireBlogs = wireSignal(mirrorEvents.BLOGS, forceUpdate);
    return () => {
      wireWorkspaces.cut();
      wireFilespaces.cut();
      wireBlogs.cut();
    };
  }, []);
  React.useEffect(() => {
    if (open) {
      
    }
  }, [open]);
  return (
    <Root stlye={{ position: "relative" }}>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        swipeAreaWidth={32}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          style: {
            height: 500,
            background: 'transparent',
            boxShadow: 'none'
          },
        }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            top: -24,
            visibility: "visible",
            right: 0,
            left: 0,
            height: 64
          }}
        >
          <Puller style={{ backgroundColor: "#333" }}
            onClick={() => {
              setOpen(true);
            }}
          />
          <Toolbar style={{ marginTop: 16 }}>
            <ViewInAr />
            <Typography
              sx={{ p: 2, color: "text.secondary" }}
              style={{ marginLeft: -8 }}
            >
              53 Shortcuts
            </Typography>
            <div style={{ flex: 1 }} />
            <Typography
              sx={{ p: 2, color: "text.secondary" }}
              style={{ marginRight: -8 }}
            >
              157 Users
            </Typography>
            <Group />
          </Toolbar>
        </StyledBox>
        <StyledBox
          style={{
            marginTop: 40,
            height: "100%",
            backgroundColor: colors.semiTransparentPaper,
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={page}
            exclusive
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: colors.paper,
              zIndex: 7,
              marginTop: 32,
              borderRadius: 8

            }}
            onChange={(event, newPage) => {
              setPage(newPage);
            }}
          >
            <ToggleButton value={0} style={{ fontSize: 11, fontWeight: 'bold' }}>Shortcuts</ToggleButton>
            <ToggleButton value={1} style={{ fontSize: 11, fontWeight: 'bold' }}>Workspaces</ToggleButton>
            <ToggleButton value={2} style={{ fontSize: 11, fontWeight: 'bold' }}>Filespaces</ToggleButton>
            <ToggleButton value={3} style={{ fontSize: 11, fontWeight: 'bold' }}>Blogs</ToggleButton>
          </ToggleButtonGroup>
          <div style={{ width: '100%', height: '100%', overflowY: 'auto', position: 'relative', zIndex: 6, paddingLeft: 16, paddingRight: 16 }}>
            <div style={{ width: '100%', height: 16 }} />
            {page === 0 ?
              (
                <Grid container spacing={2} style={{ marginTop: 64 }}>
                  <Grid item xs={8}>
                    <Item
                      onClick={() => {
                        setOpen(false);
                        publish(uiEvents.NAVIGATE, { navigateTo: 'Explore' });
                      }}
                      style={{ height: 112, paddingTop: 32 }}
                    >
                      <Search />
                      <h4 style={{ marginTop: 8 }}>Explore</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item
                      onClick={() => {
                        setOpen(false);
                        publish(uiEvents.NAVIGATE, { navigateTo: 'ChatsList' });
                      }}
                      style={{ height: 112, paddingTop: 32 }}
                    >
                      <Forum />
                      <h4 style={{ marginTop: 8 }}>Community</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item style={{ height: 112, paddingTop: 32 }}
                      onClick={() => {
                        setOpen(false);
                        publish(uiEvents.NAVIGATE, { navigateTo: 'Settings' });
                      }}>
                      <Settings />
                      <h4 style={{ marginTop: 8 }}>Settings</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={8}>
                    <Item
                      style={{ height: 112, paddingTop: 32 }}
                      onClick={() => {
                        setOpen(false);
                        dbFindTowerById(fetchCurrentTowerId()).then(tower => {
                          publish(uiEvents.NAVIGATE, { navigateTo: 'SpaceProfile', tower: tower });
                        });
                      }}
                    >
                      <Workspaces />
                      <h4 style={{ marginTop: 8 }}>Space Info</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={8}>
                    <Item
                      style={{ height: 112, paddingTop: 32 }}
                      onClick={() => {
                        setOpen(false);
                        publish(uiEvents.OPEN_ROOMS_LIST, {});
                      }}
                    >
                      <RocketLaunch />
                      <h4 style={{ marginTop: 8 }}>Switch Room</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item style={{ height: 112, paddingTop: 32 }}
                      onClick={() => {
                        setOpen(false);
                        publish(uiEvents.NAVIGATE, { navigateTo: 'Wallet' });
                      }}>
                      <AccountBalanceWallet />
                      <h4 style={{ marginTop: 8 }}>Bank</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item style={{ height: 112, paddingTop: 32 }}>
                      <Home />
                      <h4 style={{ marginTop: 8 }}>My Home</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item
                      onClick={() => {
                        setOpen(false);
                        publish(uiEvents.NAVIGATE, { navigateTo: 'UserProfile' });
                      }}
                      style={{ height: 112, paddingTop: 32 }}
                    >
                      <AccountCircle />
                      <h4 style={{ marginTop: 8 }}>My Profile</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={4}>
                    <Item style={{ height: 112, paddingTop: 32 }}>
                      <AdminPanelSettings />
                      <h4 style={{ marginTop: 8 }}>Control Panel</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={12}>
                    <AudioWidget openMediaPlayer={openMediaPlayer} closeMenuCallback={() => setOpen(false)} />
                  </Grid>
                  <Grid item xs={4}>
                    <Item
                      onClick={() => {
                        setOpen(false);
                        setTimeout(() => {
                          publish(uiEvents.NAVIGATE, { navigateTo: 'UserInvites' });
                        }, 250);
                      }}
                      style={{ height: 112, paddingTop: 32 }}
                    >
                      <EmailIcon />
                      <h4 style={{ marginTop: 8 }}>My Invites</h4>
                    </Item>
                  </Grid>
                  <Grid item xs={12}>
                    <div style={{ height: 48, width: '100%' }} />
                  </Grid>
                </Grid>
              ) : page === 1 ?
                (
                  <Grid container spacing={2} style={{ marginTop: 64 }}>
                    {workspaces(currentRoom.id).map(workspace => (<WorkspaceItem workspace={workspace} setOpen={setOpen} />))}
                    <Grid item xs={12}>
                      <div style={{ height: 48, width: '100%' }} />
                    </Grid>
                  </Grid>
                ) : page === 2 ?
                  (
                    <Grid container spacing={2} style={{ marginTop: 64 }}>
                      {filespaces(currentRoom.id).map(filespace => {
                        return (
                          <Grid item xs={4}>
                            <div style={{ marginLeft: -4, width: window.innerWidth / 3 - 16 + 'px', height: window.innerWidth / 3 - 16 + 48 + 8 + 'px', position: 'relative' }}>
                              <Paper
                                onClick={() => {
                                  setOpen(false);
                                  setTimeout(() => {
                                    publish(uiEvents.NAVIGATE, { navigateTo: 'Filespace', filespaceId: filespace.id });
                                  }, 250);
                                }}
                                elevation={8} style={{
                                  borderRadius: 16, width: '100%', height: window.innerWidth / 3 - 16 + 'px',
                                  background: "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
                                  paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
                                }}>
                                <Paper style={{ width: 64, height: 64, borderRadius: '50%', padding: 16, marginLeft: 'auto', marginRight: 'auto' }}>
                                  <Typography style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666' }}>F</Typography>
                                </Paper>
                              </Paper>
                              <Typography style={{ marginTop: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>{filespace.title}</Typography>
                              <Typography style={{ fontSize: 12, width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>10 Drives</Typography>
                            </div>
                          </Grid>
                        );
                      })}
                      <Grid item xs={12}>
                        <div style={{ height: 48, width: '100%' }} />
                      </Grid>
                    </Grid>
                  ) :
                  (
                    <Grid container spacing={2} style={{ marginTop: 64 }}>
                      {blogs(currentRoom.id).map(blog => (<BlogItem blog={blog} setOpen={setOpen} />))}
                      <Grid item xs={12}>
                        <div style={{ height: 48, width: '100%' }} />
                      </Grid>
                    </Grid>
                  )
            }
          </div>
          {page === 1 || page === 2 || page === 3 ? (
            <Fab style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => {
              setOpen(false);
              setTimeout(() => {
                if (page === 1) {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'CreateWorkspaceDlg' });
                } else if (page === 2) {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'CreateFilespaceDlg' });
                } else if (page === 3) {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'CreateBlogDlg' });
                }
              }, 250);
            }}>
              <Add />
            </Fab>) : null}
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

SpacesBottombar.propTypes = {
  window: PropTypes.func,
};

export default SpacesBottombar;
