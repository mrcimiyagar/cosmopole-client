
import { useEffect } from "react";
import hark from "hark";

export default function Audio(props) {
    useEffect(() => {
        if (props.id !== "me") {
            document.getElementById(props.id + "_audio").srcObject = props.stream;
        }
        if (props.stream !== undefined) {
            var options = {};
            var speechEvents = hark(props.stream, options);
            speechEvents.on("speaking", function () {
                let elem = document.getElementById("audio_state_" + props.id);
                if (elem !== null) {
                    elem.style.backgroundColor = "#00ccff";
                }
            });
            speechEvents.on("stopped_speaking", function () {
                let elem = document.getElementById("audio_state_" + props.id);
                if (elem !== null) {
                    elem.style.backgroundColor = "white";
                }
            });
        }
    }, []);
    return <audio autoPlay id={props.id + "_audio"} />;
}
