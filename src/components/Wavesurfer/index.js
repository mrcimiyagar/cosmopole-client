import React, { useEffect, useRef } from "react";
import "./index.css";
import Waveform from "react-audio-waveform";
import { Card, IconButton } from "@mui/material";
import { Pause, PlayArrow } from "@mui/icons-material";
import { generateCoverLink } from "../../core/callables/file";
import uiEvents from '../../config/ui-events.json';
import { publish, subscribe, unsubscribe } from "../../core/bus";

export function WaveSurferBox({ docId: di, roomId, graph, waveformKey }) {
  const [playing, setPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const docIdRef = useRef(di);
  let docId = docIdRef.current;
  useEffect(() => {
    let tokenAudioPluginStateChanged = subscribe(uiEvents.ON_AUDIO_PLUGIN_STATE_CHANGED, ({ duration: dur, docId: di, position: pos, playing: pl }) => {
      if (di === docId) {
        if (dur !== undefined) {
          setDuration(dur);
        }
        if (pos !== undefined) {
          setPosition(pos);
        }
        if (pl !== undefined) {
          setPlaying(pl);
        }
      }
    });
    publish(uiEvents.SYNC_AUDIO_STATE, { docId });
    return () => {
      unsubscribe(tokenAudioPluginStateChanged);
    };
  }, []);
  return (
    <div style={{ width: "100%", height: '100%', display: "flex" }}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <Card style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 4, marginRight: 4, marginTop: 4, position: 'relative' }}>
        {
          graph ? (
            <img
              src={generateCoverLink(docId, roomId)}
              id={'wavesurfer_audio_cover_' + waveformKey}
              style={{
                zIndex: 1,
                width: '100%',
                height: '100%',
                borderRadius: 20,
                position: 'absolute',
                left: 0,
                top: 0,
                objectFit: 'fill',
              }}
            />
          ) : null
        }
        <div style={{ zIndex: 2, position: 'absolute', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.35)' }} />
        <IconButton
          style={{ width: '100%', height: '100%', borderRadius: 20, postiion: 'absolute', zIndex: 3 }}
          onClick={e => {
            if (playing) {
              publish(uiEvents.STOP_AUDIO, { docId });
            } else {
              publish(uiEvents.PLAY_AUDIO, { docId });
            }
          }}
        >
          {playing ? <Pause style={{ fill: '#fff' }} /> : <PlayArrow style={{ fill: '#fff' }} />}
        </IconButton>
      </Card>
      <div style={{ width: "calc(100% - 96px)", marginTop: 10 }}>
        <Waveform
          key={waveformKey}
          barWidth={4}
          peaks={graph}
          height={32}
          pos={position}
          duration={duration}
          onClick={(sec) => {
            publish(uiEvents.MOVE_AUDIO_POSITION, { position: sec, docId });
          }}
          color="#fff"
          progressGradientColors={[
            [0, "#ccc"],
            [1, "#ccc"],
          ]}
        />
      </div>
    </div>
  );
}
