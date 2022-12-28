import React, { Component } from "react";
import { publish, subscribe, unsubscribe } from "../../core/bus";
import { generateFileLink } from "../../core/callables/file";
import { docsDictById } from "../../core/memory";
import uiEvents from '../../config/ui-events.json';
import { saveCurrentPlayingMediaId } from "../../core/storage/media";

export default class AudioPlugin extends Component {
    tokenPlayAudio = undefined;
    tokenStopAudio = undefined;
    tokenMoveAudioPosition = undefined;
    tokenSyncAudioState = undefined;
    tokenSyncAudioDuration = undefined;
    tokenSyncCurrentAudio = undefined;
    timer = undefined;
    constructor(props) {
        super(props);
        this.state = {
            docId: undefined,
            playing: false,
            position: 0,
            duration: 0,
            repeat: false
        };
        this.audioRef = React.createRef();
    }
    componentDidMount() {
        let that = this;
        const notifyAudioSync = () => {
            publish(uiEvents.ON_AUDIO_PLUGIN_STATE_CHANGED, {
                duration: Math.floor(Number(docsDictById[this.state.docId].duration)),
                position: localStorage.getItem(this.state.docId + '-progress'),
                playing: this.state.playing,
                docId: this.state.docId
            });
        };
        const notifyStopPrevAudio = () => {
            publish(uiEvents.ON_AUDIO_PLUGIN_STATE_CHANGED, {
                playing: false,
                docId: this.state.docId
            });
        };
        this.timer = setInterval(() => {
            try {
                this.setState({ position: Math.floor(this.audioRef.current.currentTime), playing: !this.audioRef.current.paused }, () => {
                    if (!this.audioRef.current.paused) {
                        localStorage.setItem(this.state.docId + '-progress', Math.floor(this.audioRef.current.currentTime));
                        notifyAudioSync();
                    }
                });
            } catch (ex) { }
        }, 250);
        this.audioRef.current.onloadeddata = function () {
            let restoredPos = localStorage.getItem(that.state.docId + '-progress');
            if (restoredPos === null || !restoredPos) {
                restoredPos = 0;
            }
            restoredPos = Number(restoredPos);
            that.audioRef.current.currentTime = restoredPos;
            that.setState({ duration: that.audioRef.current.duration, position: restoredPos }, () => {
                notifyAudioSync();
            });
        };
        this.audioRef.current.onended = function () {
            that.audioRef.current.currentTime = 0;
            if (that.state.repeat) {
                that.setState({ playing: true }, () => {
                    try {
                        that.audioRef.current?.play();
                    } catch (ex) { }
                    notifyAudioSync();
                });
            } else {
                that.setState({ playing: false, position: 0 }, () => {
                    notifyAudioSync();
                });
            }
        };
        this.tokenPlayAudio = subscribe(uiEvents.TOGGLE_REPEAT, ({ repeat }) => {
            this.setState({ repeat: repeat });
        });
        this.tokenPlayAudio = subscribe(uiEvents.PLAY_AUDIO, ({ docId }) => {
            if (this.state.docId && (docId !== this.state.docId)) {
                notifyStopPrevAudio();
            }
            if (docId) {
                saveCurrentPlayingMediaId(docId);
                this.setState({ docId: docId, playing: true }, () => {
                    try {
                        that.audioRef.current?.play();
                    } catch (ex) { }
                    notifyAudioSync();
                });
            } else {
                if (this.state.docId) {
                    this.setState({ playing: true }, () => {
                        try {
                            that.audioRef.current?.play();
                        } catch (ex) { }
                        notifyAudioSync();
                    });
                }
            }
        });
        this.tokenStopAudio = subscribe(uiEvents.STOP_AUDIO, ({ docId }) => {
            this.setState({ playing: false }, () => {
                try {
                    that.audioRef.current?.pause();
                } catch (ex) { }
                notifyAudioSync();
            });
        });
        this.tokenMoveAudioPosition = subscribe(uiEvents.MOVE_AUDIO_POSITION, ({ position, docId }) => {
            if (!docId || (this.state.docId === docId)) {
                localStorage.setItem(this.state.docId + '-progress', position);
                this.setState({ position: position });
                that.audioRef.current.currentTime = position;
                notifyAudioSync();
            }
        });
        this.tokenSyncAudioState = subscribe(uiEvents.SYNC_AUDIO_STATE, ({ docId }) => {
            publish(uiEvents.ON_AUDIO_PLUGIN_STATE_CHANGED, {
                playing: docId === this.state.docId ? this.state.playing : false,
                duration: Math.floor(Number(docsDictById[docId].duration)),
                docId: docId,
                position: localStorage.getItem(docId + '-progress')
            });
        });
    }
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        unsubscribe(this.tokenPlayAudio);
        unsubscribe(this.tokenStopAudio);
        unsubscribe(this.tokenMoveAudioPosition);
        unsubscribe(this.tokenSyncAudioState);
        unsubscribe(this.tokenSyncAudioDuration);
        unsubscribe(this.tokenSyncCurrentAudio);
    }
    render() {
        return <audio ref={this.audioRef} style={{ display: 'none' }} src={generateFileLink(this.state.docId, docsDictById[this.state.docId]?.roomIds[0])} />
    }
}
