
import { useEffect } from 'react';

export default function Video(props) {
    useEffect(() => {
        let video = document.getElementById(props.id + "_video");
        video.srcObject = props.stream;
    }, []);
    return (
        <div style={{
            width: "100%", height: "100%", position: "relative",
            borderRadius: 16
        }}>
            <video
                autoPlay
                controls={false}
                muted
                id={props.id + "_video"}
                style={{
                    backgroundColor: props.disabled === true ? "white" : undefined,
                    width: "100%",
                    height: "100%",
                    borderRadius: 16,
                    objectFit: 'cover'
                }}
                onClick={props.onClick}
            />
            {props.disabled === true ? (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            borderRadius: 40,
                            padding: 32,
                            fontSize: 20,
                        }}
                    >
                        {props.name.charAt(0)}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
