import { Add, Delete } from "@mui/icons-material";
import { Avatar, Fab, IconButton, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Avatar1 from "../../data/photos/avatar-1.png";
import Avatar2 from "../../data/photos/avatar-2.png";
import Avatar3 from "../../data/photos/avatar-3.png";
import Avatar4 from "../../data/photos/avatar-4.png";
import AllOut from '@mui/icons-material/AllOut';
import { setupScrollListenerForContainer } from '../../utils/ScrollHelper';
import './index.css';
import useForceUpdate from "../../utils/ForceUpdate";
import { createBlock, deleteBlock, readBlocks, updateBlock } from '../../core/callables/block';
import { publish, subscribe } from "../../core/bus";
import topics from '../../core/events/topics.json';
import { unsubscribe } from "../../core/bus";
import { dbFindWorkspaceById } from "../../core/storage/spaces";
import { fetchCurrentRoomId } from "../../core/storage/auth";
import { dbFindBlogById } from "../../core/storage/blog";
import uiEvents from '../../config/ui-events.json';
import { enterWorkspace } from "../../core/callables/auth";
import { dbFindFilespaceById } from "../../core/storage/storage";
import { blocksDict } from "../../core/memory";

const colorsArr = [
  "linear-gradient(315deg, rgba(25,118,210, 1) 33%, rgba(3,168,244, 0.75) 100%)",
  "linear-gradient(315deg, rgba(230, 74, 25, 1) 33%, rgba(255, 87, 34, 0.75) 100%)",
  "linear-gradient(315deg, rgba(0, 121, 107, 1) 33%, rgba(0, 150, 136, 0.75) 100%)",
  "linear-gradient(315deg, rgba(81, 45, 168, 1) 33%, rgba(103, 58, 183, 0.75) 100%)",
  "linear-gradient(315deg, rgba(245, 124, 0, 1) 33%, rgba(255, 152, 0, 0.75) 100%)",
  "linear-gradient(315deg, rgba(194, 24, 91, 1) 33%, rgba(233, 30, 99, 0.75) 100%)"
];

let WorkspaceItem = ({ workspaceId, w, h }) => {
  const forceUpdate = useForceUpdate();
  const [workspace, setWorkspace] = React.useState({});
  useEffect(() => {
    dbFindWorkspaceById(workspaceId).then(ws => {
      setWorkspace(ws);
      forceUpdate();
    });
  }, []);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Paper
        onClick={() => {
          enterWorkspace(workspaceId, true);
        }}
        style={{
          width: '100%', height: 'calc(100% - 30px)',
          background: "linear-gradient(315deg, rgba(230, 74, 25, 1) 0%, rgba(255, 87, 34, 0.5) 100%)",
          paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
        }}>
        <Paper style={{
          width: 72, height: 72, borderRadius: '50%',
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
        }}>
          <Typography style={{
            alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
            position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
          }}>
            W
          </Typography>
        </Paper>
        <Typography
          style={{
            position: 'absolute', right: 8, bottom: 8, fontSize: 12, color: '#fff'
          }}>
          {workspace?.title}
        </Typography>
      </Paper>
    </div>
  );
};

let BlogItem = ({ blogId, w, h }) => {
  const forceUpdate = useForceUpdate();
  const [blog, setBlog] = React.useState({});
  useEffect(() => {
    dbFindBlogById(blogId).then(bl => {
      setBlog(bl);
      forceUpdate();
    });
  }, []);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Paper
        onClick={() => {
          publish(uiEvents.NAVIGATE, { navigateTo: 'Blog', blog: blog });
        }}
        style={{
          width: '100%', height: 'calc(100% - 30px)',
          background:
            "linear-gradient(315deg, rgba(0, 121, 107, 1) 0%, rgba(0, 150, 136, 0.5) 100%)",
          paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
        }}>
        <Paper style={{
          width: 72, height: 72, borderRadius: '50%',
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
        }}>
          <Typography style={{
            alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
            position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
          }}>
            B
          </Typography>
        </Paper>
        <Typography
          style={{
            position: 'absolute', right: 8, bottom: 8, fontSize: 12, color: '#fff'
          }}>
          {blog?.title}
        </Typography>
      </Paper>
    </div>
  );
};

let FilespaceItem = ({ filespaceId, w, h }) => {
  const forceUpdate = useForceUpdate();
  const [filespace, setFilespace] = React.useState({});
  useEffect(() => {
    dbFindFilespaceById(filespaceId).then(fi => {
      setFilespace(fi);
      forceUpdate();
    });
  }, []);
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Paper
        onClick={() => {
          publish(uiEvents.NAVIGATE, { navigateTo: 'Filespace', filespace: filespace });
        }}
        style={{
          width: '100%', height: 'calc(100% - 30px)',
          background:
            "linear-gradient(315deg, rgba(25,118,210,1) 0%, rgba(3,168,244,0.5) 100%)",
          paddingTop: (window.innerWidth / 3 - 16) / 2 - 32 + 'px'
        }}>
        <Paper style={{
          width: 72, height: 72, borderRadius: '50%',
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'
        }}>
          <Typography style={{
            alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontWeight: 'bold', fontSize: 22, color: '#666',
            position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', left: '50%'
          }}>
            F
          </Typography>
        </Paper>
        <Typography
          style={{
            position: 'absolute', right: 8, bottom: 8, fontSize: 12, color: '#fff'
          }}>
          {filespace?.title}
        </Typography>
      </Paper>
    </div>
  );
};

const blockColors = [];

for (let i = 0; i < 6; i++) {
  for (let j = 0; j < 6; j++) {
    blockColors.push(colorsArr[i % 2 === 0 ? j : (5 - j)]);
  }
}

export default function SpacesGrid({ editMode }) {
  const forceUpdate = useForceUpdate();
  const [gridKey, setGridKey] = React.useState(Math.random());
  useEffect(() => {
    setupScrollListenerForContainer('spacesScrollContainer', '[workspaceId]');
  }, []);
  useEffect(() => {
    let newGridKey = Math.random();
    setGridKey(newGridKey);
  }, [editMode]);
  return (
    <div
      id={'spacesScrollContainer'}
      style={{
        width: "100%",
        height: "calc(100% - 96px)",
        overflow: "auto",
        marginTop: 96
      }}
    >
      <ReactGridLayout
        key={gridKey}
        className={'layout'}
        cols={6}
        rowHeight={Math.floor(window.innerWidth / 6) - 4}
        width={window.innerWidth}
        margin={[4, 4]}
        style={{ height: 2000 }}
        onResizeStop={(layout, oldItem, newItem, placeholder, e, element) => {
          blocksDict[fetchCurrentRoomId()].forEach(block => {
            if (block.id === newItem.i) {
              block.width = newItem.w;
              block.height = newItem.h;
              block.x = newItem.x;
              block.y = newItem.y;
              forceUpdate();
            }
          });
          updateBlock(newItem.i, newItem.x, newItem.y, newItem.w, newItem.h);
        }}
        onDragStop={(layout, oldItem, newItem, placeholder, e, element) => {
          blocksDict[fetchCurrentRoomId()].forEach(block => {
            if (block.id === newItem.i) {
              block.width = newItem.w;
              block.height = newItem.h;
              block.x = newItem.x;
              block.y = newItem.y;
              forceUpdate();
            }
          });
          updateBlock(newItem.i, newItem.x, newItem.y, newItem.w, newItem.h);
        }}
        onLayoutChange={layout => {
          layout.forEach(newItem => {
            updateBlock(newItem.i, newItem.x, newItem.y, newItem.w, newItem.h);
          });
        }}
      >
        {
          blocksDict[fetchCurrentRoomId()]?.map(b => {
            let data;
            try {
              data = JSON.parse(b.data);
            } catch (ex) { }
            if (data !== undefined && data.type === 'workspace') {
              return (
                <div
                  key={b.id}
                  data-grid={{
                    x: b.x,
                    y: b.y,
                    w: b.width,
                    h: b.height,
                    static: !editMode,
                    minW: 2,
                    minH: 2,
                    maxW: 6,
                    maxH: 6
                  }}
                >
                  <WorkspaceItem workspaceId={data.workspaceId} w={b.width} h={b.height} />
                </div>
              );
            } else if (data !== undefined && data.type === 'blog') {
              return (
                <div
                  key={b.id}
                  data-grid={{
                    x: b.x,
                    y: b.y,
                    w: b.width,
                    h: b.height,
                    static: !editMode,
                    minW: 2,
                    minH: 2,
                    maxW: 6,
                    maxH: 6
                  }}
                >
                  <BlogItem blogId={data.blogId} w={b.width} h={b.height} />
                </div>
              );
            } else if (data !== undefined && data.type === 'filespace') {
              return (
                <div
                  key={b.id}
                  data-grid={{
                    x: b.x,
                    y: b.y,
                    w: b.width,
                    h: b.height,
                    static: !editMode,
                    minW: 2,
                    minH: 2,
                    maxW: 6,
                    maxH: 6
                  }}
                >
                  <FilespaceItem filespaceId={data.filespaceId} w={b.width} h={b.height} />
                </div>
              );
            } else {
              return (
                <div
                  key={b.id}
                  data-grid={{
                    x: b.x,
                    y: b.y,
                    w: b.width,
                    h: b.height,
                    static: !editMode,
                    minW: 2,
                    minH: 2,
                    maxW: 6,
                    maxH: 6
                  }}
                >
                  <Paper
                    elevation={0}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.35)',
                      borderRadius: 4,
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <IconButton style={{ width: '100%', height: '100%' }} onClick={() => {
                      if (window.confirm('Do you want to delete this block ?')) {
                        deleteBlock(b.id);
                      }
                    }}>
                      <Delete />
                    </IconButton>
                  </Paper>
                </div>
              );
            }
          })
        }
      </ReactGridLayout>
    </div >
  );
}
