
import React, { useRef, useEffect } from "react";
import { Rive, Layout } from "rive-js";

function Animation({ asset, className, animation, fit, alignment }) {
    const canvas = useRef(null);
    const animationContainer = useRef(null);
    let rive = useRef(null);
    useEffect(() => {
        rive.current = new Rive({
            src: asset,
            canvas: canvas.current,
            layout: new Layout({ fit: "cover", alignment: "center" }),
            autoplay: true
        });
        return () => rive.current.stop();
    }, [asset, fit, alignment]);

    return (
        <div ref={animationContainer} className={className}>
            <canvas ref={canvas} width="500" height="500" />
        </div>
    );
}

export default Animation;
