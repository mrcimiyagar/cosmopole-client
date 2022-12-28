import { Add, ArrowBack, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Chip,
  Fab,
  IconButton,
  Paper,
  Skeleton,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { colors } from "../../config/colors";
import Wallpaper from "../../data/photos/profile-background.webp";
import { publish } from "../../core/bus";
import uiEvents from '../../config/ui-events.json';
import { deleteBlog } from "../../core/callables/blog";
import generatePage from '../../utils/PageGenerator';
import { comsoToolbarHeight } from "../CosmoToolbar";
import BlogPost from "../BlogPost";
import { postsDict, postsDictById } from "../../core/memory";
import { yellow } from "@mui/material/colors";
import BaseSection from "../../utils/SectionEssentials";
import topics from '../../core/events/topics.json';
import FeedPost from "../FeedPost";

export default class NavFeed extends BaseSection {
  componentDidMount() {
    super.componentDidMount();
    this.wire(topics.BLOG_UPDATED, () => this.forceUpdate());
    this.wire(topics.POST_CREATED, () => this.forceUpdate());
    this.wire(topics.POST_UPDATED, () => this.forceUpdate());
  }
  render() {
    let { dbLoaded } = this.props;
    return this.renderWrapper(
      <div style={{ width: '100%', height: `100%`, position: 'fixed', left: 0, top: 0, background: colors.semiPaper }}>
        <div style={{
          width: '100%',
          height: 72,
          position: 'absolute',
          left: 0,
          top: 0,
          background: colors.paper,
          overflowX: 'hidden'
        }}>
          <Toolbar
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
            }}
          >
            <Typography style={{ flex: 1, color: colors.textPencil, paddingLeft: 32 }}>Feed</Typography>
            <div style={{ width: 40, height: 40 }} />
          </Toolbar>
        </div>
        <div
          elevation={0}
          style={{
            position: "relative",
            width: "100%",
            height: `calc(100% - 48px)`,
            marginTop: 48,
          }}
        >
          <Paper
            style={{
              width: "100%",
              display: "flex",
              position: "relative",
              zIndex: 6,
              paddingTop: 8,
              paddingBottom: 8,
              paddingRight: 8,
              overflowX: 'auto',
              background: colors.semiTransparentPaper,
              borderRadius: 0
            }}
            elevation={4}
          >
            <Chip label="Covid" color="primary" style={{ marginLeft: 8, height: 24 }} />
            <Chip label="Covid" color="primary" style={{ marginLeft: 8, height: 24 }} />
            <Chip label="Covid" color="primary" style={{ marginLeft: 8, height: 24 }} />
          </Paper>
          {
            dbLoaded ? (
              <Box style={{ width: '100%', height: 'calc(100% - 40px)', overflowY: 'auto' }}>
                {Object.values(postsDictById).map((post, index) => (<FeedPost post={post} />))}
                <div style={{ width: '100%', height: 112 }} />
              </Box>
            ) : (
              <div style={{ width: '100%', marginTop: 48 }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s, index) => (
                  <div key={'nav_eye_skeleton_' + index} style={{ width: 'calc(100% - 80px)', height: 'auto', display: 'flex', paddingLeft: 32, marginTop: index === 0 ? -16 : 32 }}>
                    <Skeleton animation={"wave"} variant={"circular"} height={56} width={56} />
                    <div style={{ width: 'calc(100% - 64px)', marginLeft: 16, marginTop: 16 }}>
                      <Skeleton animation={"wave"} height={10} style={{ marginBottom: 6, width: '100%' }} />
                      <Skeleton animation={"wave"} height={10} width="60%" />
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
