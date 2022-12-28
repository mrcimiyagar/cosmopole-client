import React, { useEffect, useState } from "react";
import "./index.css";
import Waveform from "react-audio-waveform";
import { Fab } from "@mui/material";
import { Pause, PlayArrow, Repeat } from "@mui/icons-material";
import { colors } from "../../config/colors";
import { saveCurrentPlayingMediaId } from '../../core/storage/media';

export function MediaPlayerWaveSurferBox({ source, docId, graph }) {
  console.log(localStorage.getItem(docId + '-progress'));
  const [pos, setPos] = React.useState(localStorage.getItem(docId + '-progress') !== null ? Number(localStorage.getItem(docId + '-progress')) : 0);
  const [dur, setDur] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [repeat, setRepeat] = useState(false);
  useEffect(() => {
    let audioEl = document.getElementById("audioController" + docId);
    audioEl.onloadeddata = function () {
      setDur(audioEl.duration);
      audioEl.currentTime = pos;
    };
    audioEl.onended = function () {
      audioEl.currentTime = 0;
    };
    let timer = setInterval(() => {
      try {
        if (!audioEl.paused) localStorage.setItem(docId + '-progress', audioEl.currentTime);
        setPos(
          audioEl.currentTime
        );
        setPlaying(
          !audioEl.paused
        );
      } catch (ex) { }
    }, 250);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ width: "100%", height: 'auto' }}>
      <audio
        id={"audioController" + docId}
        src={source}
        style={{ display: "none" }}
        loop={repeat}
      />
      <div style={{ width: "calc(100% - 96px)", marginRight: 16, marginTop: 4 }}>
        <Waveform
          barWidth={4}
          peaks={graph}
          height={56}
          pos={pos}
          duration={dur}
          onClick={(sec) => {
            setPos(sec);
            try {
              document.getElementById("audioController" + docId).currentTime = sec;
            } catch (ex) { console.error(ex); }
          }}
          color="#cc00cc"
          progressGradientColors={[
            [0, "#aa00aa"],
            [1, "#aa00aa"],
          ]}
        />
      </div>
      <div style={{ width: '100%', height: '100%', marginTop: 32, textAlign: 'center' }}>
        <Fab
          style={{ backgroundColor: colors.accent, width: 48, height: 48, marginLeft: 8, marginRight: 8, marginTop: 8 }}
          onClick={() => {
            try {
              if (playing) {
                document.getElementById("audioController" + docId).pause();
              } else {
                document.getElementById("audioController" + docId).play();
                saveCurrentPlayingMediaId(docId);
              }
            } catch (ex) { }
          }}
        >
          {playing ? <Pause /> : <PlayArrow />}
        </Fab>
        <Fab
          style={{ backgroundColor: colors.accent, width: 48, height: 48, marginLeft: 8, marginRight: 8, marginTop: 8 }}
          onClick={() => {
            setRepeat(!repeat)
          }}
        >
          <Repeat style={{ opacity: repeat ? 1 : 0.5 }} />
        </Fab>
      </div>
    </div>
  );
}
