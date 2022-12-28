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

export default function MiniFileItem({ docId, tag, filespace, all }) {
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
        <Paper style={{ width: "100%", height: window.innerWidth / 4 - 16, textAlign: 'center', borderRadius: 16 }} elevation={4}>
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
                <div style={{ width: '100%', height: `100%`, borderRadius: 16, position: 'relative' }}>
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
