
import React, { useEffect } from 'react'
import Lottie from 'react-lottie';
import coreConfig from '../../core/config.json';
import { playWithEmoji } from '../../core/callables/emoji';
import { subscribe, unsubscribe } from '../../core/bus';
import uiEvents from '../../config/ui-events.json';

const LottieStickerRive = ({ size }) => {
    return <object data="rive.html" width={size} height={size}></object>
}

export default function LottieSticker({ stickerKey, size, clickCallback, messageId }) {
    const [playing, setPlaying] = React.useState(true);
    useEffect(() => {
        let tokenEmojiPlayed = subscribe(uiEvents.PLAY_WITH_EMOJI, ({ message }) => {
            if (message.id === messageId) {
                setPlaying(true);
            }
        });
        return () => {
            unsubscribe(tokenEmojiPlayed);
        }
    }, []);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        path: `${coreConfig.WEB_APP}/stickers/${stickerKey}`,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    return (
        <div style={{ borderRadius: size / 2, width: size, height: size }}>
            <Lottie
                style={{ borderRadius: size / 2, position: 'relative', zIndex: 1 }}
                options={defaultOptions}
                height={size}
                width={size}
                isPaused={!playing}
                isStopped={!playing}
                eventListeners={[
                    {
                        eventName: 'complete',
                        callback: () => {
                            //setPlaying(false);
                        }
                    }
                ]}
            />
            <div id={'message_sticker_' + messageId} style={{ width: size, height: size, borderRadius: size / 2, position: 'relative', marginTop: -size, zIndex: 2 }}
                onClick={() => {
                    if (clickCallback === undefined && messageId) {
                        playWithEmoji(messageId);
                    } else
                        clickCallback();
                }} />
        </div>
    );
}
