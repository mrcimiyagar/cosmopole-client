import { Add, ArrowBack, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Chip,
  Fab,
  IconButton,
  Paper,
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
import { comsoToolbarHeight } from "../../components/CosmoToolbar";
import BlogPost from "../../components/BlogPost";
import { postsDict } from "../../core/memory";
import { yellow } from "@mui/material/colors";
import BaseSection from "../../utils/SectionEssentials";
import topics from '../../core/events/topics.json';
import FeedPost from "../../components/FeedPost";
import updates from '../../core/network/updates.json';

export default class Blog extends BaseSection {
  componentDidMount() {
    super.componentDidMount();
    this.wire(topics.BLOG_UPDATED, () => this.forceUpdate());
    this.wire(topics.POST_CREATED, () => this.forceUpdate());
    this.wire(topics.POST_UPDATED, () => this.forceUpdate());
    this.wire(updates.NEW_POST, () => this.forceUpdate());
  }
  render() {
    let { blog } = this.props;
    return this.renderWrapper(
      <div style={{ width: '100%', height: `calc(100% - ${comsoToolbarHeight}px)`, position: 'fixed', left: 0, top: comsoToolbarHeight, overflow: 'hidden' }}>
        <div style={{
          width: '100%',
          height: 72,
          position: 'absolute',
          left: 0,
          top: 0,
          background: colors.semiTransparentPaper,
          backdropFilter: 'blur(10px)'
        }}>
          <Toolbar
            style={{
              width: "100%",
              position: "absolute",
              top: 0,
            }}
          >
            <IconButton onClick={() => this.close(true)}>
              <ArrowBack style={{ fill: colors.textPencil }} />
            </IconButton>
            <Typography style={{ flex: 1, color: colors.textPencil }}>{blog?.title}</Typography>
            <IconButton onClick={() => {
              publish(uiEvents.NAVIGATE, { navigateTo: 'CreateBlogDlg', blog: blog });
            }}>
              <Edit style={{ fill: colors.textPencil }} />
            </IconButton>
            <IconButton onClick={() => {
              if (window.confirm('Do you want to delete this blog ?')) {
                deleteBlog(blog.id, () => {
                  this.close(true);
                });
              }
            }}>
              <Delete style={{ fill: colors.textPencil }} />
            </IconButton>
            <div style={{ width: 40, height: 40 }} />
          </Toolbar>
        </div>
        <Paper
          elevation={0}
          style={{
            backgroundColor: colors.semiPaper,
            position: "relative",
            width: "100%",
            height: `calc(100% - 56px)`,
            marginTop: 56,
            borderRadius: "24px 24px 0px 0px",
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
              paddingLeft: 8,
              paddingRight: 8,
              borderRadius: '24px 24px 0px 0px',
              overflowX: 'auto',
              background: colors.paper
            }}
            elevation={2}
          >
            <Chip label="Covid" color="primary" style={{ marginLeft: 8 }} />
            <Chip label="Covid" color="primary" style={{ marginLeft: 8 }} />
            <Chip label="Covid" color="primary" style={{ marginLeft: 8 }} />
          </Paper>
          <Box style={{ width: '100%', height: 'calc(100% - 40px)', overflowY: 'auto', borderRadius: '24px 24px 0px 0px' }}>
            {postsDict[blog?.id]?.map((post, index) => (<FeedPost post={post} />))}
            <div style={{ width: '100%', height: 112 }} />
          </Box>
          <Fab style={{ position: 'fixed', bottom: 24, right: 24 }}
            sx={{ bgcolor: yellow[600] }}
            onClick={() => {
              publish(uiEvents.NAVIGATE, { navigateTo: 'CreatePostDlg', blogId: blog.id });
            }}>
            <Add />
          </Fab>
        </Paper>
      </div>
    );
  }
}
