import React from "react";
import { publish, subscribe, unsubscribe } from "../core/bus";
import uiEvents from '../config/ui-events.json';
import { colors } from "../config/colors";

export default class BaseSection extends React.Component {
    wires = [];
    wire(topic, action) {
        this.wires.push(subscribe(topic, action));
    }
    close(destruct) {
        this.setState({ open: false });
        if (destruct) {
            publish(uiEvents.BACK, {});
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.wire = this.wire.bind(this);
        this.close = this.close.bind(this);
        this.renderWrapper = this.renderWrapper.bind(this);
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ open: true });
        });
        this.wire(uiEvents.ACT_BACK_ANIMATION, ({ tag }) => {
            if (this.props.tag === tag) this.close(true);
        });
    }
    componentWillUnmount() {
        this.wires.forEach(w => {
            unsubscribe(w);
        });
    }
    renderWrapper(children, middleOnes) {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    zIndex: 3
                }}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    transform: this.state.open ? `translateX(0px)` : `translateX(300px)`,
                    opacity: this.state.open ? 1 : 0,
                    transition: 'transform 0.25s, opacity 0.25s'
                }}>
                    {children}
                </div>
                {middleOnes}
            </div>
        );
    }
}
