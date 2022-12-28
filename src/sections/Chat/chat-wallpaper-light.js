
import './index-light.scss';

export default function ChatLightWallpaper() {
    return (
        <div className="background-light">
            {
                (() => {
                    let particles = [];
                    for (let i = 0; i < 25; i++) {
                        particles.push(<span></span>);
                    }
                    return particles;
                })()
            }
        </div>
    );
}
