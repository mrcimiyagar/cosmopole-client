import { useEffect, useRef } from "react";
import { subscribe, unsubscribe, publish } from "../core/bus";
import React from "react";
import uiEvents from '../config/ui-events.json';
import { checkElementAvailable } from "./UiAttacher";
import { setupScrollListenerForContainer } from "./ScrollHelper";
import { isGettingBack } from "../App";
import useForceUpdate from "./ForceUpdate";
import { Dialog } from "@mui/material";
import MainTransition from "../components/MainTransition";

let loaded = {};

function Component({ ui, onClose, onCreated, onAttaching, setupDefaults, props, sheet, extendHide, noContainer, extOpen }) {
    const forceUpdate = useForceUpdate();
    const [open, setOpen] = React.useState(isGettingBack === false ? props.transitionFlag : isGettingBack);
    const wires = React.useRef({});
    const memory = React.useRef({});
    const funcs = React.useRef({ forceUpdate });
    const loaded = React.useRef(false);
    const wire = (topic, callback) => {
        let token = subscribe(topic, data => {
            if (callback !== undefined) {
                callback(data);
            }
        });
        wires.current[token] = true;
    };
    const close = () => {
        onClose({ props, memory: memory.current, funcs: funcs.current });
        setOpen(false);
        setTimeout(() => {
            publish(uiEvents.BACK, {});
        }, 250);
    };
    const hide = () => {
        onClose({ props, memory: memory.current, funcs: funcs.current });
        setOpen(false);
        extendHide();
    };
    setupDefaults({
        fill: (unitKey, defaultValue) => {
            if (memory.current[unitKey] === undefined) {
                memory.current[unitKey] = defaultValue;
            }
        },
        memory: memory.current,
        forceUpdate
    });
    useEffect(() => {
        if (extOpen) {
            setOpen(true);
            props.activateTransition();
        }
    }, [extOpen]);
    useEffect(() => {
        if (!noContainer) {
            setOpen(true);
            props.activateTransition();
        }
        setTimeout(() => {
            if (loaded[props.tag]) return;
            loaded[props.tag] = true;
            onCreated({
                wire,
                memory: memory.current,
                props,
                funcs: funcs.current,
                forceUpdate
            });
            onAttaching({
                attachScrollbarToElement: (elementId, tag, persistent) => {
                    checkElementAvailable(elementId + '_' + props.tag, () => {
                        setupScrollListenerForContainer(elementId, tag, persistent, () => { });
                    });
                }
            });
            forceUpdate();
        });
        return () => {
            Object.keys(wires.current).forEach(w => {
                unsubscribe(w);
            });
        };
    }, []);
    if (noContainer) {
        return (
            <Dialog
                fullScreen
                open={open}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 3
                }}
            >
                {ui({ memory: memory.current, funcs: funcs.current, close, forceUpdate, props, hide })}
            </Dialog>
        );
    } else {
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
                    transform: open ? (sheet ? `translateY(0px)` : `translateX(0px)`) : (sheet ? `translateY(400px)` : `translateX(300px)`),
                    opacity: open ? 1 : 0,
                    transition: 'transform 0.25s, opacity 0.25s'
                }}>
                    {ui({ memory: memory.current, funcs: funcs.current, close, forceUpdate, props, hide })}
                </div>
            </div>
        );
    }
}

export default function generatePage({ ui, onClose, onCreated, onAttaching, setupDefaults, props, sheet, extendHide, noContainer, extOpen }) {
    return Component({ ui, onClose, onCreated, onAttaching, setupDefaults, props, sheet, extendHide, noContainer, extOpen });
}
