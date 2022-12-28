
import { ArrowBack, Delete, Edit } from '@mui/icons-material';
import { Fab, IconButton, Toolbar } from '@mui/material';
import { createReactEditorJS } from 'react-editor-js';
import { EDITOR_JS_TOOLS } from '../../components/EditorJsTools';
import { colors, themeId } from '../../config/colors';
import generatePage from '../../utils/PageGenerator';
import uiEvents from '../../config/ui-events.json';
import { deletePost, readPostById, updateSection } from '../../core/callables/blog';
import { publish, subscribe } from '../../core/bus';
import { downloadPreview } from '../../core/callables/file';
import { fetchCurrentRoomId } from '../../core/storage/auth';
import React, { useEffect } from 'react';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { socket } from '../../core/network/socket';
import useForceUpdate from '../../utils/ForceUpdate';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import BaseSection from '../../utils/SectionEssentials';
import edjsParser from 'editorjs-parser';
import { yellow } from '@mui/material/colors';
import topics from '../../core/events/topics.json';

const parser = new edjsParser();

let data = undefined;
let markup = undefined;

export default class Post extends BaseSection {
  tokenSectionUpdated = undefined;
  constructor(props) {
    super(props);
    data = undefined;
    markup = undefined;
    this.postContentRef = React.createRef();
  }
  componentDidMount() {
    super.componentDidMount();
    let { post, tag } = this.props;
    this.wire(topics.SECTION_UPDATED, ({ postId, wholeData }) => {
      if (postId === post.id) {
        if (!wholeData?.blocks === undefined) {
          wholeData = { blocks: [] };
        }
        data = wholeData;
        markup = parser.parse(data);
        console.log(markup);
        this.postContentRef.current.innerHTML = markup;
        this.forceUpdate();
      }
    });
    downloadPreview('image', post.coverId, fetchCurrentRoomId(), res => {
      var objectURL = URL.createObjectURL(res);
      document.getElementById(`postHeader_${tag}`).src = objectURL;
    });
    readPostById(post.id, post => {
      if (post?.data?.blocks === undefined) {
        post.data = { blocks: [] };
      }
      data = post.data;
      markup = parser.parse(data);
      this.postContentRef.current.innerHTML = markup;
    });
  }
  render() {
    let that = this;
    let { post, tag } = this.props;
    return this.renderWrapper(
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 3, background: colors.paper, overflowY: 'auto' }}>
          <div style={{ position: 'fixed', left: 0, top: 0, background: 'linear-gradient(180deg, #000000 0%, transparent 100%)', width: '100%', height: 112 }} />
          <Toolbar style={{ width: '100%', marginTop: comsoToolbarHeight + 8, position: 'fixed', left: 0, top: 0 }}>
            <IconButton onClick={() => this.close(true)}>
              <ArrowBack style={{ fill: '#fff' }} />
            </IconButton>
            <div style={{ flex: 1 }} />
            <IconButton onClick={() => {
              publish(uiEvents.NAVIGATE, {
                navigateTo: 'CreatePostDlg', blogId: post.blogId, post: post,
                updateParentDataSource: (ds) => {
                  post = ds;
                  this.forceUpdate();
                }
              });
            }}>
              <Edit style={{ fill: '#fff' }} />
            </IconButton>
            <IconButton onClick={() => {
              if (window.confirm('Do you want to delete this post ?')) {
                deletePost(post.id, () => {
                  this.close(true);
                });
              }
            }}>
              <Delete style={{ fill: '#fff' }} />
            </IconButton>
            <div style={{ width: 40, height: 40 }} />
          </Toolbar>
          <img
            id={`postHeader_${tag}`}
            style={{
              width: "100%",
              height: 300,
              objectFit: "fill"
            }}
            alt={"post-header"}
          />
          <div ref={this.postContentRef} style={{ backgroundColor: colors.floatingCard, width: '100%', height: 'auto', position: 'absolute', top: 300, left: 0, padding: 16 }}>

          </div>
        </div>
        <Fab sx={{ bgcolor: yellow[600] }} style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => {
          publish(uiEvents.NAVIGATE, { navigateTo: 'PostEditor', post: post });
        }}>
          <Edit />
        </Fab>
      </div>
    );
  }
}
