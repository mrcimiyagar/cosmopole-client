
import { findValueByPrefix } from '../../utils/ArrayTool';
import Video from './Video';
import React, { useEffect } from 'react';
import { Card, Paper } from '@mui/material';

export default function MediaBox(props) {
    let vs = findValueByPrefix(props.videos, props.id + "_video");
    let ss = findValueByPrefix(props.screens, props.id + "_screen");

    let [title, setTitle] = React.useState("");

    useEffect(() => {
        setTitle('temp user');
    }, []);

    if (props.shownVideos[props.id] === true) {
        return (
            <Paper
                id={props.id}
                style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 16,
                    padding: 4
                }}
                onClick={props.onClick}
            >
                <Paper style={{
                    width: '100%', height: '100%', borderRadius: 16
                }}>
                    <Video
                        name={title}
                        id={props.id}
                        stream={vs !== undefined ? vs.value : undefined}
                        onClick={props.onClick}
                    />
                </Paper>
            </Paper>
        );
    } else {
        return (
            <Paper
                id={props.id}
                style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: 16,
                    padding: 4
                }}
                onClick={props.onClick}
            >
                <Paper style={{
                    width: '100%', height: '100%', borderRadius: 16
                }}>
                    <Video
                        name={title}
                        id={props.id}
                        disabled={true}
                        stream={vs !== undefined ? vs.value : undefined}
                        onClick={props.onClick}
                    />
                </Paper>
            </Paper>
        );
    }
}
