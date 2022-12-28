import {
  Dialog,
  Divider,
  Fab,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Wallpaper from "../../data/photos/profile-background.webp";
import { Add, ArrowBack, Description, Folder, PlayArrow } from "@mui/icons-material";
import { colors } from "../../config/colors";
import MainTransition from "../../components/MainTransition";
import FoldersToggleButtons from "../../components/FoldersToggleButtons";
import DataToggleButtons from "../../components/DataToggleButtons";
import FolderIcon from "@mui/icons-material/Folder";
import {
  InsertDriveFile,
} from "@mui/icons-material";
import PdfIcon from '../../data/photos/pdf.png';
import { publish, unsubscribe } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import useForceUpdate from '../../utils/ForceUpdate';
import { dbFindFolderById } from "../../core/storage/storage";
import { dbFetchDocById } from "../../core/storage/file";
import { yellow } from "@mui/material/colors";
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import { downloadAudioCover, downloadPreview, generateFileLink } from "../../core/callables/file";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import BaseSection from "../../utils/SectionEssentials";
import { docsDictById } from "../../core/memory";
import MiniFileItem from '../../components/MiniFileItem';
import updates from '../../core/network/updates.json';

let FileItem = ({ docId, tag, filespace, all }) => {
  const forceUpdate = useForceUpdate();
  const [preview, setPreview] = React.useState(undefined);
  const [cover, setCover] = React.useState(undefined);
  let doc = docsDictById[docId];
  useEffect(() => {
    if (doc) {
      downloadPreview(doc.fileType, doc.id, fetchCurrentRoomId(), res => {
        if (doc.fileType === 'image' || doc.fileType === 'video') {
          let imageUrl = URL.createObjectURL(res);
          document.getElementById(`storage_${tag}_${doc.id}_file_viewer`).src = imageUrl;
          setPreview(res);
        } else if (doc.fileType === 'audio') {
          if (res !== undefined) {
            setPreview(res);
          }
        }
      });
      if (doc.fileType === 'audio') {
        downloadAudioCover(doc.id, fetchCurrentRoomId(), res => {
          let imageUrl = URL.createObjectURL(res);
          document.getElementById('storage_file_audio_cover_' + docId).src = imageUrl;
          setCover(res);
        });
      }
    }
  }, [doc]);
  return (
    <Paper style={{ width: "100%", height: window.innerWidth / 3 - 16, textAlign: 'center', borderRadius: 16 }} elevation={4}>
      {doc?.fileType === 'image' ? (
        <img id={`storage_${tag}_${docId}_file_viewer`} style={{
          width: '100%', height: '100%', objectFit: 'fill', borderRadius: 16
        }} onClick={() => {
          publish(uiEvents.OPEN_PHOTO_VIEWER, {
            source: generateFileLink(doc.id, filespace.roomId),
            docId: doc.id,
            allFiles: all,
            roomId: filespace.roomId
          });
        }} />
      ) : doc?.fileType === 'video' ? (
        <div style={{ width: '100%', height: `100%`, borderRadius: 16 }}>
          <img id={`storage_${tag}_${docId}_file_viewer`} style={{
            width: '100%', height: '100%', objectFit: 'fill', borderRadius: 16
          }} />
          <Fab size={'medium'} style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            background: colors.semiTransparentPaper, backdropFilter: colors.backdrop
          }} onClick={() => {
            publish(uiEvents.OPEN_VIDEO_PLAYER, {
              source: generateFileLink(doc.id, filespace.roomId),
              docId: doc.id
            });
          }}>
            <PlayArrow style={{ fill: colors.textPencil }} />
          </Fab>
        </div>
      ) : doc?.fileType === 'audio' ? (
        <div style={{
          display: preview !== undefined ? 'block' : 'none', width: '100%', position: 'relative',
          height: '100%', borderRadius: 16
        }}>
          <img id={'storage_file_audio_cover_' + docId} style={{
            display: (cover && cover.type.startsWith('image/')) ? 'block' : 'none', borderRadius: 16,
            zIndex: 1, width: '100%', height: '100%', objectFit: 'fill'
          }} />
        </div>
      ) : null
      }
    </Paper >
  );
}

export default class Folders extends BaseSection {
  constructor(props) {
    super(props);
    this.state = {
      fileOrFolder: 'all'
    };
  }
  componentDidMount() {
    super.componentDidMount();
    this.wire(updates.NEW_FOLDER, () => this.forceUpdate());
    this.wire(updates.NEW_FILE, () => this.forceUpdate());
  }
  render() {
    let { folder } = this.props;
    let { fileOrFolder, tag } = this.state;
    return this.renderWrapper(
      <div
        style={{
          width: "100%",
          height: `calc(100% - ${comsoToolbarHeight}px)`,
          position: "relative",
          marginTop: comsoToolbarHeight,
          zIndex: 3
        }}
      >
        <Toolbar
          style={{
            width: "100%",
            backdropFilter: colors.backdrop
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
            {folder.disk ? folder.disk.title : folder?.title}
          </Typography>
        </Toolbar>
        <Paper
          elevation={6}
          style={{
            background: colors.paper,
            borderRadius: "24px 24px 0px 0px",
            height: `calc(100% - 28px - ${comsoToolbarHeight}px)`,
            width: "100%",
            position: 'relative',
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex"
          }}
        >
          {fileOrFolder === 'folder' ?
            (
              <div
                style={{
                  width: `calc(100% - 32px)`,
                  height: "auto",
                  position: "relative",
                  marginLeft: 16,
                  marginTop: 16,
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 56,
                  paddingBottom: 16,
                  borderRadius: 8
                }}
              >
                <Grid container spacing={1}>
                  {
                    folder.folders.map((folder, i) => {
                      return (
                        <Grid item xs={6}>
                          <Paper
                            onClick={() => {
                              publish(uiEvents.NAVIGATE, { navigateTo: 'Folders', folder });
                            }}
                            style={{
                              position: "relative",
                              width: "100%",
                              padding: 16,
                              borderRadius: 8,
                              background: '#f9cdad'
                            }}
                          >
                            <div style={{ width: "100%", display: "flex" }}>
                              <FolderIcon
                                style={{
                                  width: 48,
                                  height: 48,
                                  position: "absolute",
                                  left: 16,
                                  top: 22,
                                  fill: "rgba(245, 124, 0, 1)",
                                }}
                              />
                              <div style={{
                                marginLeft: 64,
                                marginTop: 16,
                                display: 'flex',
                                width: '100%'
                              }}>
                                <div>
                                  <Typography
                                    variant={"subtitle"}
                                    style={{
                                      color: '#000'
                                    }}
                                  >
                                    {folder.title}
                                  </Typography>
                                  <Typography style={{ flex: 1 }}>
                                  </Typography>
                                  <Typography
                                    variant={"caption"}
                                    style={{
                                      color: '#000'
                                    }}
                                  >
                                    7 GB
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            {
                              i < (folder.folders.length - 1) ? (
                                <Divider style={{ backgroundColor: '#fff', marginTop: 16, marginBottom: 8 }} />
                              ) : null
                            }
                          </Paper>
                        </Grid>
                      );
                    })
                  }
                </Grid>
              </div>
            ) : fileOrFolder === 'file' ?
              (
                <div
                  style={{
                    width: '100%',
                    height: "auto",
                    position: "absolute",
                    top: 40,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 32,
                    paddingBottom: 16,
                  }}
                >
                  <Grid container style={{ width: '100%' }} spacing={1}>
                    {
                      folder?.fileIds.map(fileId => {
                        return (
                          <Grid item xs={4}>
                            <div
                              style={{
                                position: "relative",
                                width: "100%"
                              }}
                            >
                              <FileItem docId={fileId} tag={tag} filespace={folder.filespace} all={folder?.fileIds} />
                            </div>
                          </Grid>
                        );
                      })
                    }
                  </Grid>
                </div>
              ) : fileOrFolder === 'image' ?
              (
                <div
                  style={{
                    width: '100%',
                    height: "auto",
                    position: "absolute",
                    top: 40,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 32,
                    paddingBottom: 16,
                  }}
                >
                  <Grid container style={{ width: '100%' }} spacing={1}>
                    {
                      folder?.fileIds.filter(fileId => {
                        return (docsDictById[fileId]?.fileType === 'image');
                      }).map(fileId => {
                        return (
                          <Grid item xs={4}>
                            <div
                              style={{
                                position: "relative",
                                width: "100%"
                              }}
                            >
                              <FileItem docId={fileId} tag={tag} filespace={folder.filespace} all={folder?.fileIds} />
                            </div>
                          </Grid>
                        );
                      })
                    }
                  </Grid>
                </div>
              ) : fileOrFolder === 'audio' ?
              (
                <div
                  style={{
                    width: '100%',
                    height: "auto",
                    position: "absolute",
                    top: 40,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 32,
                    paddingBottom: 16,
                  }}
                >
                  <Grid container style={{ width: '100%' }} spacing={1}>
                    {
                      folder?.fileIds.filter(fileId => {
                        return (docsDictById[fileId]?.fileType === 'audio');
                      }).map(fileId => {
                        return (
                          <Grid item xs={4}>
                            <div
                              style={{
                                position: "relative",
                                width: "100%"
                              }}
                            >
                              <FileItem docId={fileId} tag={tag} filespace={folder.filespace} all={folder?.fileIds} />
                            </div>
                          </Grid>
                        );
                      })
                    }
                  </Grid>
                </div>
              ) : fileOrFolder === 'video' ?
              (
                <div
                  style={{
                    width: '100%',
                    height: "auto",
                    position: "absolute",
                    top: 40,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 32,
                    paddingBottom: 16,
                  }}
                >
                  <Grid container style={{ width: '100%' }} spacing={1}>
                    {
                      folder?.fileIds.filter(fileId => {
                        return (docsDictById[fileId]?.fileType === 'video');
                      }).map(fileId => {
                        return (
                          <Grid item xs={4}>
                            <div
                              style={{
                                position: "relative",
                                width: "100%"
                              }}
                            >
                              <FileItem docId={fileId} tag={tag} filespace={folder.filespace} all={folder?.fileIds} />
                            </div>
                          </Grid>
                        );
                      })
                    }
                  </Grid>
                </div>
              ) : (
                <div
                  style={{
                    width: `calc(100% - 32px)`,
                    height: "auto",
                    position: "absolute",
                    top: 56,
                    left: 16,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 16,
                    paddingBottom: 16,
                    borderRadius: 8
                  }}
                >
                  <Typography style={{ marginTop: 8, color: colors.textPencil }}>Folders</Typography>
                  <Grid container spacing={1} style={{ marginTop: 2 }}>
                    {
                      folder.folders.map((folder, i) => {
                        return (
                          <Grid item xs={6}>
                            <Paper
                              onClick={() => {
                                publish(uiEvents.NAVIGATE, { navigateTo: 'Folders', folder });
                              }}
                              style={{
                                position: "relative",
                                width: "100%",
                                padding: 16,
                                borderRadius: 8,
                                background: '#f9cdad'
                              }}
                            >
                              <div style={{ width: "100%", display: "flex" }}>
                                <FolderIcon
                                  style={{
                                    width: 48,
                                    height: 48,
                                    position: "absolute",
                                    left: 16,
                                    top: 22,
                                    fill: "rgba(245, 124, 0, 1)",
                                  }}
                                />
                                <div style={{
                                  marginLeft: 64,
                                  marginTop: 16,
                                  display: 'flex',
                                  width: '100%'
                                }}>
                                  <div>
                                    <Typography
                                      variant={"subtitle"}
                                      style={{
                                        color: '#000'
                                      }}
                                    >
                                      {folder.title}
                                    </Typography>
                                    <Typography style={{ flex: 1 }}>
                                    </Typography>
                                    <Typography
                                      variant={"caption"}
                                      style={{
                                        color: '#000'
                                      }}
                                    >
                                      7 GB
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                              {
                                i < (folder.folders.length - 1) ? (
                                  <Divider style={{ backgroundColor: '#fff', marginTop: 16, marginBottom: 8 }} />
                                ) : null
                              }
                            </Paper>
                          </Grid>
                        );
                      })
                    }
                  </Grid>
                  <Typography style={{ marginTop: 32, color: colors.textPencil }}>Documents</Typography>
                  <Grid container style={{ width: '100%', marginTop: 2 }} spacing={1}>
                    {
                      folder?.fileIds.map(fileId => {
                        return (
                          <Grid item xs={3}>
                            <div
                              style={{
                                position: "relative",
                                width: "100%"
                              }}
                            >
                              <MiniFileItem docId={fileId} tag={tag} filespace={folder.filespace} all={folder?.fileIds} />
                            </div>
                          </Grid>
                        );
                      })
                    }
                  </Grid>
                  <div style={{ width: '100%', height: 112 }} />
                </div>
              )
          }
          <Fab variant={'extended'} style={{ position: 'fixed', right: 24, bottom: 24 }} sx={{ bgcolor: yellow[600] }} onClick={() => {
            publish(uiEvents.NAVIGATE, { navigateTo: 'CreateFolderDlg', folderId: folder.id });
          }}>
            <Add />
            <Folder />
          </Fab>
          <Fab variant={'extended'} style={{ position: 'fixed', right: 24 + 80 + 16, bottom: 24 }} sx={{ bgcolor: yellow[600] }} onClick={() => {
            publish(uiEvents.NAVIGATE, { navigateTo: 'CreateFileDlg', folderId: folder.id });
          }}>
            <Add />
            <Description />
          </Fab>
          <div style={{ width: '100%', justifyContent: 'center', display: 'flex', position: 'fixed', left: 0, top: comsoToolbarHeight + 56 + 16 }}>
            <FoldersToggleButtons updateFileOrFolder={tabKey => this.setState({ fileOrFolder: tabKey })} />
          </div>
        </Paper>
      </div>
    );
  }
}
