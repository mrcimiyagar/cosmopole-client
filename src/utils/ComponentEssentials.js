import React from "react";
import { subscribe, unsubscribe } from "../core/bus";

export default class BaseComponent extends React.Component {
    wires = [];
    constructor(props) {
        super(props);
        this.state = {
            updateTrigger: false
        };
    }
    update() {
        this.setState({ updateTrigger: !this.state.updateTrigger });
    }
    wire(topic, action) {
        this.wires.push(subscribe(topic, action));
    }
    componentWillUnmount() {
        this.wires.forEach(w => {
            unsubscribe(w);
        });
    }
    shouldComponentUpdate(newProps, newState) {
        if (newState.updateTrigger !== this.state.updateTrigger) {
            return true;
        } else {
            return false;
        }
    }
}
