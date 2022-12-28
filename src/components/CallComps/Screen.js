
function Screen(props) {
    useEffect(() => {
        document.getElementById(props.id + "_screen").srcObject = props.stream;
    }, []);
    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <video
                autoPlay
                controls={false}
                muted
                id={props.id + "_screen"}
                style={{
                    backgroundColor: props.disabled === true ? "white" : undefined,
                    width: "100%",
                    height: "100%",
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
