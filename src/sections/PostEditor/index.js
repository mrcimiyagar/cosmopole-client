
import { ArrowBack, Delete, Edit } from '@mui/icons-material';
import { IconButton, Toolbar } from '@mui/material';
import { createReactEditorJS } from 'react-editor-js';
import { EDITOR_JS_TOOLS } from '../../components/EditorJsTools';
import { colors, themeId } from '../../config/colors';
import generatePage from '../../utils/PageGenerator';
import uiEvents from '../../config/ui-events.json';
import { deletePost, readPostById, updateSection } from '../../core/callables/blog';
import { publish } from '../../core/bus';
import { downloadPreview } from '../../core/callables/file';
import { fetchCurrentRoomId } from '../../core/storage/auth';
import React, { useEffect } from 'react';
import DragDrop from 'editorjs-drag-drop';
import Undo from 'editorjs-undo';
import { socket } from '../../core/network/socket';
import useForceUpdate from '../../utils/ForceUpdate';
import { comsoToolbarHeight } from '../../components/CosmoToolbar';
import BaseSection from '../../utils/SectionEssentials';

function diff(obj1, obj2) {
    const result = {};
    if (Object.is(obj1, obj2)) {
        return undefined;
    }
    if (!obj2 || typeof obj2 !== 'object') {
        return obj2;
    }
    if (Array.isArray(obj2)) result.__type__ = 'array';
    Object.keys(obj1 || {}).concat(Object.keys(obj2 || {})).forEach(key => {
        if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
            if (obj2[key] === undefined) {
                result[key] = { __deleted__: true };
            } else {
                result[key] = obj2[key];
            }
        }
        if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
            const value = diff(obj1[key], obj2[key]);
            if (value !== undefined) {
                result[key] = value;
            }
        }
    });
    return result;
}

const ReactEditorJS = createReactEditorJS();

let saveTimeoutHolder;
let data = undefined;
let firstSyncTry = true;

function repairThemeBasedTextColor() {
    var div = document.querySelectorAll(".ce-paragraph");
    for (var i = 0; i < div.length; i++) {
        if (!div[i].style.color) {
            if (themeId === 'DARK') {
                div[i].style.color = "rgb(255, 255, 255)";
            } else {
                div[i].style.color = "rgb(60, 60, 60)";
            }
        }
    }
}

function savePostData(d, postId) {
    console.log('updates', d);
    let differences = diff(data, d);
    updateSection(differences, postId, d);
    data = d;
}

export default class PostEditor extends BaseSection {
    handleReady() {
        const editor = this.editorCore.current._editorJS;
        new Undo({ editor });
        new DragDrop(editor);
        repairThemeBasedTextColor();
    }
    handleInitialize(instance) {
        this.editorCore.current = instance;
    }
    constructor(props) {
        super(props);
        data = undefined;
        this.editorCore = React.createRef(null);
        this.handleInitialize = this.handleInitialize.bind(this);
        this.handleReady = this.handleReady.bind(this);
    }
    componentDidMount() {
        super.componentDidMount();
        let { post, tag } = this.props;
        downloadPreview('image', post.coverId, fetchCurrentRoomId(), res => {
            var objectURL = URL.createObjectURL(res);
            document.getElementById(`postHeader_${tag}`).src = objectURL;
        });
        readPostById(post.id, post => {
            if (post.data) {
                data = post.data;
                this.forceUpdate();
            }
        });
    }
    componentWillUnmount() {
        let { post, tag } = this.props;
        if (saveTimeoutHolder) {
            clearTimeout(saveTimeoutHolder);
            saveTimeoutHolder = undefined;
        }
        this.editorCore.current.save().then(d => {
            savePostData(d, post.id);
            saveTimeoutHolder = undefined;
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
                    <div style={{ backgroundColor: colors.floatingCard, width: '100%', height: 'auto', position: 'absolute', top: 300, left: 0, padding: 16 }}>
                        {
                            data !== undefined ? (
                                <ReactEditorJS
                                    onReady={this.handleReady}
                                    onInitialize={this.handleInitialize}
                                    defaultValue={data}
                                    style={{ width: '100%', height: 'auto' }}
                                    tools={EDITOR_JS_TOOLS}
                                    onChange={() => {
                                        if (firstSyncTry) {
                                            firstSyncTry = false;
                                        } else {
                                            repairThemeBasedTextColor();
                                            if (saveTimeoutHolder) {
                                                clearTimeout(saveTimeoutHolder);
                                            }
                                            saveTimeoutHolder = setTimeout(() => {
                                                that.editorCore.current.save().then(d => {
                                                    savePostData(d, post.id);
                                                    saveTimeoutHolder = undefined;
                                                });
                                            }, 2500);
                                        }
                                    }} />
                            ) : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
