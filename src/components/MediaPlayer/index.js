
import React, { useEffect } from 'react';
import { Paper } from '@mui/material';
import { MediaPlayerWaveSurferBox } from '../MediaPlayerWavesurfer';
import { fetchCurrentPlayingMediaId } from '../../core/storage/media';
import { fetchCurrentRoomId } from '../../core/storage/auth';
import { downloadPreview, generateFileLink } from '../../core/callables/file';
import { dbFetchDocById } from '../../core/storage/file';

export default function MediaPlayer() {
    const [preview, setPreview] = React.useState(undefined);
    const [playingDoc, setPlayingDoc] = React.useState(undefined)
    useEffect(() => {
        dbFetchDocById(fetchCurrentPlayingMediaId()).then(doc => {
            setPlayingDoc(doc);
            downloadPreview(doc.fileType, doc.id, fetchCurrentRoomId(), res => {
                if (res !== undefined) {
                    setPreview(res);
                }
            });
        });
    }, []);
    return playingDoc !== undefined && preview !== undefined ? (
        <div style={{ width: '100%', height: '100%' }}>
            <MediaPlayerWaveSurferBox
                docId={fetchCurrentPlayingMediaId()}
                source={generateFileLink(fetchCurrentPlayingMediaId(), fetchCurrentRoomId())}
                graph={preview.data}
            />
        </div>
    ) : null;
}
