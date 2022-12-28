import {
  Avatar,
  createMuiTheme,
  Dialog,
  Fab,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  Add,
  ArrowBack,
  Article,
  Audiotrack,
  InsertDriveFile,
  MoreHoriz,
  OndemandVideo,
  PhotoSizeSelectActual,
  SdCard,
} from "@mui/icons-material";
import { colors, filespace_toggle_button_selected_theme } from "../../config/colors";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import FolderIcon from "@mui/icons-material/Folder";
import uiEvents from '../../config/ui-events.json';
import { publish, subscribe, unsubscribe } from "../../core/bus";
import useForceUpdate from '../../utils/ForceUpdate';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import { dbFindFolderById } from "../../core/storage/storage";
import { yellow } from "@mui/material/colors";
import { disksDict } from "../../core/memory";
import BaseSection from "../../utils/SectionEssentials";
import updates from '../../core/network/updates.json';
import { enterRoom } from "../../core/callables/auth";
import { fetchCurrentRoomId, fetchCurrentWorkspaceId } from "../../core/storage/auth";

class Filespace extends BaseSection {
  prevRoomId;
  prevWorkspaceId;
  componentDidMount() {
    super.componentDidMount();
    this.wire(updates.NEW_DISK, () => this.forceUpdate());
    this.prevRoomId = fetchCurrentRoomId();
    this.prevWorkspaceId = fetchCurrentWorkspaceId();
    enterRoom(this.props.filespace.roomId);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    enterRoom(this.prevRoomId, false, this.prevWorkspaceId);
  }
  render() {
    return this.renderWrapper(
      (
        <div
          style={{
            width: "100%",
            height: `100%`,
            position: "fixed",
            left: 0,
            top: 0,
            background: colors.paper,
            overflowY: 'hidden'
          }}
        >
          <Paper
            style={{
              borderRadius: 0,
              width: "100%",
              height: 200,
              backgroundColor: colors.semiTransparentPaper,
              backdropFilter: colors.backdrop,
            }}
          ></Paper>
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              marginTop: -96,
            }}
          >
            <div
              style={{
                width: 'auto',
                paddingLeft: 16,
                display: "flex",
                paddingBottom: 32,
                position: 'relative'
              }}
            >
              {
                this.props.filespace.disks.map(disk => {
                  return (
                    <Paper
                      onClick={() => {
                        publish(uiEvents.NAVIGATE, { navigateTo: 'Folders', folder: disk.dataFolder });
                      }}
                      elevation={12}
                      style={{
                        borderRadius: 40,
                        padding: 4,
                        width: 184,
                        minWidth: 184,
                        height: 230,
                        marginLeft: 16,
                        background:
                          "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <div
                        style={{
                          width: "calc(100% - 48px)",
                          display: "flex",
                          marginLeft: 16,
                          marginTop: 32,
                          marginRight: 16,
                        }}
                      >
                        <Paper
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            backgroundColor: colors.semiTransparentPaper,
                          }}
                        >
                          <Avatar
                            alt={"Drive Icon"}
                            style={{
                              width: "calc(100% - 8px)",
                              height: "calc(100% - 8px)",
                              backgroundColor: "#fff",
                              margin: 4,
                            }}
                          >
                            <SdCard style={{ fill: "#000", width: 40, height: 40 }} />
                          </Avatar>
                        </Paper>
                        <div style={{ flex: 1 }} />
                        <IconButton
                          style={{
                            marginTop: 8,
                          }}
                        >
                          <MoreHoriz
                            style={{
                              fill: "#fff",
                              width: 40,
                              height: 40,
                            }}
                          />
                        </IconButton>
                      </div>
                      <Typography
                        variant={"h6"}
                        style={{ color: "#fff", marginLeft: 16, marginTop: 16 }}
                      >
                        Disk {disk.title}
                      </Typography>
                      <ThemeProvider theme={filespace_toggle_button_selected_theme}>
                        <LinearProgress
                          color={"secondary"}
                          variant="determinate"
                          style={{
                            height: 8,
                            borderRadius: 4,
                            marginLeft: 16,
                            marginTop: 16,
                            marginRight: 16,
                          }}
                          value={40}
                        />
                      </ThemeProvider>
                      <div
                        style={{
                          width: "calc(100% - 32px)",
                          display: "flex",
                          marginLeft: 16,
                          marginTop: 8,
                        }}
                      >
                        <Typography style={{ color: "#fff", fontWeight: "bold" }}>
                          10 GB
                        </Typography>
                        <div style={{ flex: 1 }} />
                        <Typography style={{ color: "#fff", fontWeight: "bold" }}>
                          25 GB
                        </Typography>
                      </div>
                    </Paper>
                  );
                })
              }
            </div>
            <Paper style={{
              background: colors.semiTransparentPaper, backdropFilter: 'blur(10px)', position: 'absolute',
              top: 225, right: 0, borderRadius: '72px 0px 0px 72px', width: 72, height: 72
            }}>
              <IconButton
                onClick={() => {
                  publish(uiEvents.NAVIGATE, { navigateTo: 'CreateDiskDlg', filespaceId: this.props.filespace.id });
                }}
                style={{ width: '100%', height: '100%', borderRadius: '72px 0px 0px 72px' }}>
                <Add style={{ width: 56, height: 56, fill: colors.textPencil }} />
              </IconButton>
            </Paper>
          </div>
          <div
            style={{
              width: "100%",
              height: "auto",
              position: "absolute",
              top: 332,
              paddingLeft: 32,
              paddingRight: 32,
              paddingTop: 32,
              paddingBottom: 32,
            }}
          >
            <Typography
              variant={"h6"}
              style={{
                color: colors.textPencil,
                position: "relative",
                zIndex: 2,
                marginBottom: 16,
              }}
            >
              Categories
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper
                  onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "PhotosGallery", filespaceId: this.props.filespace.id, docType: 'image' })}
                  elevation={12}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: 168,
                    background:
                      "linear-gradient(315deg, rgba(0, 121, 107, 1) 0%, rgba(0, 150, 136, 0.5) 100%)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 32,
                  }}
                >
                  <div style={{ width: "100%", display: "flex" }}>
                    <FolderIcon
                      style={{
                        width: 72,
                        height: 72,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        fill: "rgba(0, 121, 107, 1)",
                      }}
                    />
                    <PhotoSizeSelectActual
                      style={{
                        fill: "#eee",
                        width: 28,
                        height: 28,
                        marginLeft: 40,
                        marginTop: 40,
                        position: "relative",
                      }}
                    />
                    <div style={{ flex: 1 }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#eee",
                        marginRight: 32,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      7 GB
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 24,
                      display: "flex",
                    }}
                  >
                    <PhotoSizeSelectActual style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      153 Photos
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 8,
                      display: "flex",
                    }}
                  >
                    <FolderIcon style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      3 Folders
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "PhotosGallery", filespaceId: this.props.filespace.id, docType: 'audio' })}
                  elevation={12}
                  style={{
                    width: "100%",
                    height: 168,
                    background:
                      "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 32,
                  }}
                >
                  <div style={{ width: "100%", display: "flex" }}>
                    <FolderIcon
                      style={{
                        width: 72,
                        height: 72,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        fill: "rgba(25,118,210,1)",
                      }}
                    />
                    <Audiotrack
                      style={{
                        fill: "#eee",
                        width: 28,
                        height: 28,
                        marginLeft: 40,
                        marginTop: 40,
                        position: "relative",
                      }}
                    />
                    <div style={{ flex: 1 }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#eee",
                        marginRight: 32,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      7 GB
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 24,
                      display: "flex",
                    }}
                  >
                    <Audiotrack style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      153 Audios
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 8,
                      display: "flex",
                    }}
                  >
                    <FolderIcon style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      3 Folders
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "PhotosGallery", filespaceId: this.props.filespace.id, docType: 'video' })}
                  elevation={12}
                  style={{
                    width: "100%",
                    height: 168,
                    background:
                      "linear-gradient(315deg, rgba(230, 74, 25, 1) 0%, rgba(255, 87, 34, 0.5) 100%)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 32,
                  }}
                >
                  <div style={{ width: "100%", display: "flex" }}>
                    <FolderIcon
                      style={{
                        width: 72,
                        height: 72,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        fill: "rgba(230, 74, 25, 1)",
                      }}
                    />
                    <OndemandVideo
                      style={{
                        fill: "#eee",
                        width: 28,
                        height: 28,
                        marginLeft: 40,
                        marginTop: 40,
                        position: "relative",
                      }}
                    />
                    <div style={{ flex: 1 }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#eee",
                        marginRight: 32,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      7 GB
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 24,
                      display: "flex",
                    }}
                  >
                    <OndemandVideo style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      153 Videos
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 8,
                      display: "flex",
                    }}
                  >
                    <FolderIcon style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      3 Folders
                    </Typography>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "PhotosGallery", filespaceId: this.props.filespace.id, docType: 'document' })}
                  elevation={12}
                  style={{
                    width: "100%",
                    height: 168,
                    background:
                      "linear-gradient(315deg, rgba(194, 24, 91, 1) 0%, rgba(255, 64, 129, 0.5) 100%)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 32,
                  }}
                >
                  <div style={{ width: "100%", display: "flex" }}>
                    <FolderIcon
                      style={{
                        width: 72,
                        height: 72,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        fill: "rgba(194, 24, 91, 1)",
                      }}
                    />
                    <Article
                      style={{
                        fill: "#eee",
                        width: 28,
                        height: 28,
                        marginLeft: 40,
                        marginTop: 40,
                        position: "relative",
                      }}
                    />
                    <div style={{ flex: 1 }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#eee",
                        marginRight: 32,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      7 GB
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 24,
                      display: "flex",
                    }}
                  >
                    <Article style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      153 Docs
                    </Typography>
                  </div>
                  <div
                    style={{
                      marginLeft: 24,
                      marginTop: 8,
                      display: "flex",
                    }}
                  >
                    <FolderIcon style={{ fill: "#eee" }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        fontWeight: "bold",
                        marginLeft: 8,
                        marginTop: 4,
                        color: "#eee",
                      }}
                    >
                      3 Folders
                    </Typography>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
          <div
            style={{
              width: "100%",
              height: "auto",
              position: "absolute",
              top: 386 + 168 + 168 + 112,
              paddingLeft: 32,
              paddingRight: 32,
              paddingTop: 32,
              paddingBottom: 32,
              display: 'none'
            }}
          >
            <Typography
              variant={"h6"}
              style={{
                color: colors.black,
                position: "relative",
                zIndex: 2,
                marginBottom: 16,
              }}
            >
              {"Pinned Folders"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper
                  onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "Folders" })}
                  elevation={12}
                  style={{
                    pointerEvents: 'none',
                    position: "relative",
                    width: "calc(100% - 64px)",
                    height: 144,
                    backgroundColor: "rgba(255, 193, 7, 0.5)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 32,
                  }}
                >
                  <div style={{ width: "100%", display: "flex" }}>
                    <FolderIcon
                      style={{
                        width: 72,
                        height: 72,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        fill: "rgba(245, 124, 0, 1)",
                      }}
                    />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#333",
                        marginLeft: 32 + 64,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      Exam Resources
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#333",
                        marginRight: 32,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      7 GB
                    </Typography>
                  </div>
                  <div style={{ display: "flex", marginTop: 32 }}>
                    <div
                      style={{
                        marginLeft: 24,
                        display: "flex",
                      }}
                    >
                      <InsertDriveFile style={{ fill: "#333" }} />
                      <Typography
                        variant={"body2"}
                        style={{
                          fontWeight: "bold",
                          marginLeft: 8,
                          marginTop: 4,
                          color: "#333",
                        }}
                      >
                        153 Files
                      </Typography>
                    </div>
                    <div stylee={{ flex: 1 }} />
                    <div
                      style={{
                        marginLeft: 24,
                        display: "flex",
                      }}
                    >
                      <FolderIcon style={{ fill: "#333" }} />
                      <Typography
                        variant={"body2"}
                        style={{
                          fontWeight: "bold",
                          marginLeft: 8,
                          marginTop: 4,
                          color: "#333",
                        }}
                      >
                        3 Folders
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "Folders" })}
                  elevation={12}
                  style={{
                    pointerEvents: 'none',
                    position: "relative",
                    width: "calc(100% - 64px)",
                    height: 144,
                    backgroundColor: "rgba(255, 193, 7, 0.5)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 32,
                  }}
                >
                  <div style={{ width: "100%", display: "flex" }}>
                    <FolderIcon
                      style={{
                        width: 72,
                        height: 72,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        fill: "rgba(245, 124, 0, 1)",
                      }}
                    />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#333",
                        marginLeft: 32 + 64,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      Exam Resources
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#333",
                        marginRight: 32,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      7 GB
                    </Typography>
                  </div>
                  <div style={{ display: "flex", marginTop: 32 }}>
                    <div
                      style={{
                        marginLeft: 24,
                        display: "flex",
                      }}
                    >
                      <InsertDriveFile style={{ fill: "#333" }} />
                      <Typography
                        variant={"body2"}
                        style={{
                          fontWeight: "bold",
                          marginLeft: 8,
                          marginTop: 4,
                          color: "#333",
                        }}
                      >
                        153 Files
                      </Typography>
                    </div>
                    <div stylee={{ flex: 1 }} />
                    <div
                      style={{
                        marginLeft: 24,
                        display: "flex",
                      }}
                    >
                      <FolderIcon style={{ fill: "#333" }} />
                      <Typography
                        variant={"body2"}
                        style={{
                          fontWeight: "bold",
                          marginLeft: 8,
                          marginTop: 4,
                          color: "#333",
                        }}
                      >
                        3 Folders
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  onClick={() => publish(uiEvents.NAVIGATE, { navigateTo: "Folders" })}
                  elevation={12}
                  style={{
                    pointerEvents: 'none',
                    position: "relative",
                    width: "calc(100% - 64px)",
                    height: 144,
                    backgroundColor: "rgba(255, 193, 7, 0.5)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 32,
                  }}
                >
                  <div style={{ width: "100%", display: "flex" }}>
                    <FolderIcon
                      style={{
                        width: 72,
                        height: 72,
                        position: "absolute",
                        left: 16,
                        top: 16,
                        fill: "rgba(245, 124, 0, 1)",
                      }}
                    />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#333",
                        marginLeft: 32 + 64,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      Exam Resources
                    </Typography>
                    <div style={{ flex: 1 }} />
                    <Typography
                      variant={"body2"}
                      style={{
                        color: "#333",
                        marginRight: 32,
                        marginTop: 48,
                        fontWeight: "bold",
                      }}
                    >
                      7 GB
                    </Typography>
                  </div>
                  <div style={{ display: "flex", marginTop: 32 }}>
                    <div
                      style={{
                        marginLeft: 24,
                        display: "flex",
                      }}
                    >
                      <InsertDriveFile style={{ fill: "#333" }} />
                      <Typography
                        variant={"body2"}
                        style={{
                          fontWeight: "bold",
                          marginLeft: 8,
                          marginTop: 4,
                          color: "#333",
                        }}
                      >
                        153 Files
                      </Typography>
                    </div>
                    <div stylee={{ flex: 1 }} />
                    <div
                      style={{
                        marginLeft: 24,
                        display: "flex",
                      }}
                    >
                      <FolderIcon style={{ fill: "#333" }} />
                      <Typography
                        variant={"body2"}
                        style={{
                          fontWeight: "bold",
                          marginLeft: 8,
                          marginTop: 4,
                          color: "#333",
                        }}
                      >
                        3 Folders
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </div>
          <Toolbar
            style={{
              width: "100%",
              position: "absolute",
              top: comsoToolbarHeight,
            }}
          >
            <IconButton onClick={() => this.close(true)}>
              <ArrowBack style={{ fill: colors.textPencil }} />
            </IconButton>
            <Typography
              variant={"h6"}
              style={{
                color: colors.textPencil,
                position: "relative",
                zIndex: 2,
              }}
            >
              {this.props.filespace.title}
            </Typography>
            <div style={{ flex: 1 }} />
          </Toolbar>
        </div>
      ),
      (
        <Zoom in={this.state.open}>
          <Fab
            sx={{ bgcolor: yellow[600] }}
            style={{
              position: "fixed",
              right: 24,
              bottom: 24,
              zIndex: 2
            }}
          >
            <RocketLaunchIcon />
          </Fab>
        </Zoom>
      )
    );
  }
}

export default Filespace;
