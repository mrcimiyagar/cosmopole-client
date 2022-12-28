import {
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  ArrowBack,
} from "@mui/icons-material";
import { colors } from "../../config/colors";
import PhotosTimeline from "../../components/PhotosTimeline";
import { publish } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import { docsDictById, filespacesDictById } from "../../core/memory";
import { generatePreviewLink } from "../../core/callables/file";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import MiniFileItem from '../../components/MiniFileItem';

let fileIds = [];
let docsClusterList = [];
let docsKeyList = [];

let TimelineSection = ({ docs, filespaceId, tag }) => {
  return (
    <Grid container spacing={1} style={{ width: 'calc(100% - 48px)', position: 'relative', marginLeft: 8, marginRight: 32, marginTop: 72, height: 200 }}>
      {docs.map(doc => {
        return (
          <Grid item xs={3}>
            <Paper style={{ width: '100%', height: window.innerWidth / 4 - 16, borderRadius: 16 }}>
              <MiniFileItem docId={doc.id} tag={tag} filespace={filespacesDictById[filespaceId]} all={fileIds} />
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}

let lookForFiles = folder => {
  fileIds = fileIds.concat(folder.fileIds);
  for (let i = 0; i < folder.folders.length; i++) {
    lookForFiles(folder.folders[i]);
  }
};

export default function Media({ filespaceId, docType, tag }) {
  const roomId = fetchCurrentRoomId();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      publish(uiEvents.BACK, {});
    }, 250);
  };
  useEffect(() => {
    fileIds = [];
    let disks = filespacesDictById[filespaceId].disks;
    for (let i = 0; i < disks.length; i++) {
      lookForFiles(disks[i].dataFolder);
    }
    let tempDict = {};
    for (let i = 0; i < fileIds.length; i++) {
      let doc = docsDictById[fileIds[i]];
      if (doc.fileType === docType) {
        let clusterKey = Math.floor(doc.time / 8.64e7);
        if (!tempDict[clusterKey]) tempDict[clusterKey] = [];
        tempDict[clusterKey].push(doc);
      }
    }
    docsKeyList = Object.keys(tempDict).sort();
    docsClusterList = docsKeyList.map(dayKey => tempDict[dayKey]);
    setTimeout(() => {
      setOpen(true);
    });
  }, []);
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
        overflowY: 'auto',
        overflowX: 'hidden',
        transform: open ? `translateX(0px)` : `translateX(300px)`,
        opacity: open ? 1 : 0,
        transition: 'transform 0.25s, opacity 0.25s'
      }}>
        <Paper
          elevation={6}
          style={{
            borderRadius: "24px 24px 0px 0px",
            height: `calc(100% - 56px - ${comsoToolbarHeight}px)`,
            width: "100%",
            position: "fixed",
            left: 0,
            top: 56 + comsoToolbarHeight,
            overflowY: 'auto',
            overflowX: 'hidden',
            display: 'flex',
            backgroundColor: colors.paper
          }}
        >
          <div style={{ width: '100%' }}>
            {
              docsClusterList.map(cluster => {
                return (
                  <div>
                    <TimelineSection docs={cluster} filespaceId={filespaceId} tag={tag} />
                    <div style={{ width: '100%', height: 64 }} />
                  </div>
                );
              })
            }
          </div>
          <PhotosTimeline days={docsKeyList} />
        </Paper>
        <Toolbar
          style={{
            width: "100%",
            position: "absolute",
            top: comsoToolbarHeight,
            backdropFilter: colors.backdrop
          }}
        >
          <IconButton onClick={handleClose}>
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
            {docType}s
          </Typography>
          <div style={{ flex: 1 }} />
        </Toolbar>
      </div>
    </div>
  );
}
