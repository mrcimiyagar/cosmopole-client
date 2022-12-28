import React from "react";
import { subscribe, unsubscribe } from "../core/bus";
import { colors } from "../config/colors";
import { Dialog } from "@mui/material";

export default class BaseDialog extends React.Component {
    wires = [];
    wire(topic, action) {
        this.wires.push(subscribe(topic, action));
    }
    open() {
        this.setState({ open: true });
    }
    close() {
        this.setState({ open: false });
    }
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }
    componentWillUnmount() {
        this.wires.forEach(w => {
            unsubscribe(w);
        });
    }
    renderWrapper(children) {
        return (
            <Dialog
                keepMounted
                fullScreen
                open={this.state.open}
                PaperProps={{
                    style: {
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        background: colors.semiTransparentPaper,
                        backdropFilter: colors.backdrop
                    }
                }}
            >
                {children}
            </Dialog >
        );
    }
}
