
import { Pause, PlayArrow, RecordVoiceOver, Upload } from '@mui/icons-material';
import { Fab } from '@mui/material';
import { yellow } from '@mui/material/colors';
import React, { useEffect, useRef, useState } from 'react';
import './index.css';

let timeOffset = 50, now;

export default function Recorder({ voiceRecorded, compKey }) {
    const objRef = useRef(undefined);
    const recorderRef = useRef(undefined);
    const chunksRef = useRef([]);
    const streamRef = useRef(undefined);
    const [recording, setRecording] = useState(undefined);
    const [recordedOnce, setRecordedOnce] = React.useState(false);
    const isRecording = useRef(false);
    useEffect(() => {
        if (recording === true) {
            startRecording();
        } else if (recording === false) {
            stopRecording();
        }
    }, [recording]);
    const init = () => {
        setRecording(false);
        setRecordedOnce(false);
        now = parseInt(performance.now()) / timeOffset;
        objRef.current = {};
        objRef.current.bars = [];
        chunksRef.current = [];
        objRef.current.canvas = document.getElementById(`voiceRecorderCanvas_${compKey}`);
        objRef.current.ctx = objRef.current.canvas.getContext('2d');
        objRef.current.width = window.innerWidth * 0.8;
        objRef.current.height = 48;
        objRef.current.canvas.width = objRef.current.width * window.devicePixelRatio;
        objRef.current.canvas.height = objRef.current.height * window.devicePixelRatio;
        objRef.current.canvas.style.width = objRef.current.width + 'px';
        objRef.current.canvas.style.height = objRef.current.height + 'px';
        objRef.current.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    const loop = () => {
        if (isRecording.current === true) {
            objRef.current.ctx.clearRect(0, 0, objRef.current.canvas.width, objRef.current.canvas.height);
            let max = 0;
            if (parseInt(performance.now() / timeOffset) > now) {
                now = parseInt(performance.now() / timeOffset);
                objRef.current.analyser.getFloatTimeDomainData(objRef.current.frequencyArray)
                for (var i = 0; i < objRef.current.frequencyArray.length; i++) {
                    if (objRef.current.frequencyArray[i] > max) {
                        max = objRef.current.frequencyArray[i];
                    }
                }
                var freq = Math.floor(max * 650);
                objRef.current.bars.push({
                    x: objRef.current.width,
                    y: (objRef.current.height / 2) - (freq / 2),
                    height: freq,
                    width: 3
                });
            }
            draw();
            requestAnimationFrame(loop);
        }
    }
    const draw = () => {
        for (let i = 0; i < objRef.current.bars.length; i++) {
            const bar = objRef.current.bars[i];
            objRef.current.ctx.fillStyle = `rgb(${bar.height * 2},100,222)`;
            objRef.current.ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
            bar.x = bar.x - 2;
            if (bar.x < 1) {
                objRef.current.bars.splice(i, 1)
            }
        }
    }
    const makeLink = () => {
        let blob = new Blob(chunksRef.current, { type: 'audio/ogg' });
        let url = URL.createObjectURL(blob);
        document.getElementById(`audioPreview_${compKey}`).src = url;
        voiceRecorded(blob);
    }
    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            streamRef.current.getTracks().forEach(function (track) {
                track.stop();
            });
            setRecordedOnce(true);
        }
    }
    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(s => {
            streamRef.current = s;
            recorderRef.current = new MediaRecorder(streamRef.current);
            recorderRef.current.ondataavailable = e => {
                chunksRef.current.push(e.data);
            };
            recorderRef.current.start();
            var AudioContext = window.AudioContext;
            var audioContent = new AudioContext();
            var streamSource = audioContent.createMediaStreamSource(streamRef.current);
            objRef.current.analyser = audioContent.createAnalyser();
            streamSource.connect(objRef.current.analyser);
            objRef.current.analyser.fftSize = 512;
            objRef.current.frequencyArray = new Float32Array(objRef.current.analyser.fftSize);
            loop();
        }).catch((e) => console.error(e));
    }
    useEffect(() => {
        init();
    }, []);
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <audio controls id={`audioPreview_${compKey}`} style={{ display: 'none' }} />
            <div style={{ width: '100%', display: 'flex' }}>
                <Fab size={'small'} sx={{ bgcolor: yellow[600] }} style={{ backdropFilter: 'blur(10px)' }} onClick={() => {
                    isRecording.current = !recording;
                    setRecording(!recording);
                }}>
                    {
                        recording ? <Pause /> : <RecordVoiceOver />
                    }
                </Fab>
                {
                    !recording && recordedOnce ? (
                        <Fab size={'small'} sx={{ bgcolor: yellow[600] }} style={{ marginLeft: 16, backdropFilter: 'blur(10px)' }} onClick={() => {
                            makeLink();
                            init();
                        }}>
                            <Upload />
                        </Fab>
                    ) : null
                }
            </div>
            <canvas id={`voiceRecorderCanvas_${compKey}`}></canvas>
            <div className="line-container1">
                <div className="vertical-line1" />
                <div className="dot1" />
                <div className="dot1" />
            </div>
        </div>
    );
}
