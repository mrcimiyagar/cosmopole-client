
import './index-dark.scss';

export default function ChatDarkWallpaper() {
    return (
        <div className="background-dark">
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
