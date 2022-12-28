
import { useEffect, useRef } from "react";
import { fabric } from 'fabric';
import useForceUpdate from '../../utils/ForceUpdate';
import { addWhiteboardObject, fetchWhiteboardObjects, modifyWhiteboardObject, removeWhiteboardObject } from "../../core/callables/whiteboard";
import { subscribe, unsubscribe } from "../../core/bus";
import updates from '../../core/network/updates.json';
import uiEvents from '../../config/ui-events.json';

let myObjects = {};
let otherObjects = {};
let drawingObj = undefined;
let mouseDownX1, mouseDownY1;
let currentToolId;
let history = [];
let future = [];

const evs = {
    ADDED: 1,
    MODIFED: 2,
    REMOVED: 3
};

let dontReact = false;

export function Whiteboard({ toolId: tid, color }) {

    let forceUpdate = useForceUpdate();

    const colorRef = useRef(color);

    const canvas = useRef(null);
    const getCanvas = () => {
        return canvas.current;
    }

    var removeSelectedObjects = function () {
        var selected = getCanvas().getActiveObjects();
        if (selected) {
            if (window.confirm('Delete selected objects ?')) {
                dontReact = false;
                getCanvas().remove(...selected);
                history.push({ objs: selected, type: 'removedBulk' });
            }
            getCanvas().renderAll();
        }
    }

    let disableAllSelectionAbillities = () => {
        getCanvas().selection = false;
        getCanvas().getObjects().forEach(obj => {
            obj.set('selectable', false);
        });
    }

    let enableAllSelectionAbillities = () => {
        getCanvas().selection = true;
        getCanvas().getObjects().forEach(obj => {
            obj.set('selectable', true);
        });
    }

    useEffect(() => {
        colorRef.current = color;
        if (currentToolId === 'pencil' || currentToolId === 'brush') {
            if (getCanvas()) {
                getCanvas().freeDrawingBrush.color = color;
            }
        }
    }, [color]);

    useEffect(() => {
        if (getCanvas() !== null) {
            if (['line', 'rect', 'oval', 'triangle', 'text'].includes(tid)) {
                disableAllSelectionAbillities();
                getCanvas().isDrawingMode = false;
                currentToolId = tid;
            } else if (tid === 'eraser') {
                disableAllSelectionAbillities();
                getCanvas().isDrawingMode = true;
                getCanvas().freeDrawingBrush.color = '#fff';
                getCanvas().freeDrawingBrush.width = 20;
                currentToolId = tid;
            } else if (tid === 'pencil') {
                disableAllSelectionAbillities();
                getCanvas().isDrawingMode = true;
                getCanvas().freeDrawingBrush.color = color;
                getCanvas().freeDrawingBrush.width = 1;
                currentToolId = tid;
            } else if (tid === 'brush') {
                disableAllSelectionAbillities();
                getCanvas().isDrawingMode = true;
                getCanvas().freeDrawingBrush.color = color;
                getCanvas().freeDrawingBrush.width = 25;
                currentToolId = tid;
            } else if (tid === 'dragger') {
                enableAllSelectionAbillities();
                getCanvas().isDrawingMode = false;
                currentToolId = tid;
            } else {
                disableAllSelectionAbillities();
                getCanvas().isDrawingMode = true;
                currentToolId = tid;
            }
        }
    }, [tid]);

    useEffect(() => {

        canvas.current = new fabric.Canvas('whiteboard', {
            backgroundColor: "transparent",
            renderOnAddRemove: true,
        });

        let tokenUndo = subscribe(uiEvents.UNDO_WHITEBOARD, () => {
            let item = history.pop();
            console.log(history);
            if (item) {
                future.push(item);
                if (item.type === 'added') {
                    dontReact = true;
                    getCanvas().remove(item.obj);
                } else if (item.type === 'removed') {
                    dontReact = true;
                    getCanvas().add(item.obj);
                } else if (item.type === 'removedBulk') {
                    item.objs.forEach(obj => {
                        dontReact = true;
                        getCanvas().add(obj);
                    });
                }
                getCanvas().renderAll();
            }
        });

        let tokenRedo = subscribe(uiEvents.REDO_WHITEBOARD, () => {
            let item = future.pop();
            console.log(future);
            if (item) {
                history.push(item);
                if (item.type === 'added') {
                    dontReact = true;
                    getCanvas().add(item.obj);
                } else if (item.type === 'removed') {
                    dontReact = true;
                    getCanvas().remove(item.obj);
                } else if (item.type === 'removedBulk') {
                    item.objs.forEach(obj => {
                        dontReact = true;
                        getCanvas().remove(obj);
                    });
                }
                getCanvas().renderAll();
            }
        });

        let tokenDelete = subscribe(uiEvents.DELETE_SELECTION_WHITEBOARD, () => {
            removeSelectedObjects();
        });

        getCanvas().on('object:added', function (options) {
            if (options.target) {
                var obj = options.target;
                if (otherObjects[obj.id] === undefined) {
                    let id = Math.random();
                    obj.set('id', id);
                    obj.set('x1T', obj.x1);
                    obj.set('y1T', obj.y1);
                    obj.set('x2T', obj.x2);
                    obj.set('y2T', obj.y2);
                    obj.set('leftT', obj.left);
                    obj.set('topT', obj.top);
                    myObjects[id] = obj;
                    obj.toJSON = (function (toJSON) {
                        return function () {
                            return fabric.util.object.extend(toJSON.call(this), {
                                id: this.id,
                                uid: this.uid,
                                removed: this.removed,
                                x1T: this.x1T,
                                y1T: this.y1T,
                                x2T: this.x2T,
                                y2T: this.y2T,
                                leftT: this.leftT,
                                topT: this.topT
                            });
                        };
                    })(obj.toJSON);
                    if (dontReact) {
                        dontReact = false;
                    } else {
                        history.push({ obj: obj, type: 'added' });
                    }
                    sendObjectToGroup(evs.ADDED, obj);
                }
            }
        });

        getCanvas().on('object:removed', function (options) {
            if (options.target) {
                var obj = options.target;
                if (obj.removed)
                    return; //Object already removed

                obj.set('removed', true);
                obj.toJSON = (function (toJSON) {
                    return function () {
                        return fabric.util.object.extend(toJSON.call(this), {
                            id: this.id,
                            uid: this.uid,
                            removed: this.removed,
                            x1T: this.x1T,
                            y1T: this.y1T,
                            x2T: this.x2T,
                            y2T: this.y2T,
                            leftT: this.leftT,
                            topT: this.topT
                        });
                    };
                })(obj.toJSON);
                console.log(dontReact);
                if (dontReact) {
                    dontReact = false;
                } else {
                    history.push({ obj: obj, type: 'removed' });
                }
                sendObjectToGroup(evs.REMOVED, obj);
            }
        });

        getCanvas().on('object:modified', function (options) {
            if (options.target) {
                var obj = options.target;
                console.log(obj);
                const updateObject = (item, groupLeft, groupTop, groupWidth, groupHeight) => {
                    var existing = getObjectFromId(getCanvas(), item.id);
                    if (existing) {
                        if (groupLeft === undefined) {
                            if (existing.type === 'line') {
                                existing.set('leftT', item.left);
                                existing.set('topT', item.top);
                                item.set('leftT', item.left);
                                item.set('topT', item.top);
                            } else {
                                existing.set(item);
                                existing.set('leftT', item.left);
                                existing.set('topT', item.top);
                                item.set('leftT', item.left);
                                item.set('topT', item.top);
                            }
                        } else {
                            if (existing.type === 'line') {
                                existing.set('leftT', item.left + groupLeft + groupWidth / 2);
                                existing.set('topT', item.top + groupTop + groupHeight / 2);
                                item.set('leftT', item.left + groupLeft + groupWidth / 2);
                                item.set('topT', item.top + groupTop + groupHeight / 2);
                            } else {
                                existing.set(item);
                                existing.set('leftT', item.left + groupLeft + groupWidth / 2);
                                existing.set('topT', item.top + groupTop + groupHeight / 2);
                                item.set('leftT', item.left + groupLeft + groupWidth / 2);
                                item.set('topT', item.top + groupTop + groupHeight / 2);
                            }
                        }
                        console.log(item);
                        setTimeout(() => {
                            sendObjectToGroup(evs.MODIFED, item);
                        });
                    }
                }
                if (obj.type === 'activeSelection') {
                    for (let i = 0; i < obj._objects.length; i++) {
                        updateObject(obj._objects[i], obj.left, obj.top, obj.width, obj.height);
                    }
                } else {
                    updateObject(obj);
                }
            }
        });

        getCanvas().on('mouse:down', function (options) {
            mouseDownX1 = options.pointer.x;
            mouseDownY1 = options.pointer.y;
            if (currentToolId === 'line') {
                let line = new fabric.Line(
                    [
                        options.pointer.x,
                        options.pointer.y,
                        options.pointer.x,
                        options.pointer.y
                    ],
                    {
                        selection: true,
                        fill: colorRef.current,
                        stroke: colorRef.current,
                        strokeWidth: 5
                    }
                );
                getCanvas().add(line);
                drawingObj = line;
            } else if (currentToolId === 'rect') {
                var rect = new fabric.Rect({
                    top: options.pointer.y,
                    left: options.pointer.x,
                    width: 0,
                    height: 0,
                    selection: true,
                    fill: '',
                    stroke: colorRef.current,
                    strokeWidth: 5,
                });
                getCanvas().add(rect);
                drawingObj = rect;
            } else if (currentToolId === 'triangle') {
                var triangle = new fabric.Triangle({
                    top: options.pointer.y,
                    left: options.pointer.x,
                    width: 0,
                    height: 0,
                    selection: true,
                    fill: '',
                    stroke: colorRef.current,
                    strokeWidth: 5,
                });
                getCanvas().add(triangle);
                drawingObj = triangle;
            } else if (currentToolId === 'oval') {
                var circle = new fabric.Ellipse({
                    top: options.pointer.y,
                    left: options.pointer.x,
                    rx: 0,
                    ry: 0,
                    selection: true,
                    fill: '',
                    stroke: colorRef.current,
                    strokeWidth: 5,
                });
                getCanvas().add(circle);
                drawingObj = circle;
            }
        });

        getCanvas().on('mouse:move', function (options) {
            if (drawingObj !== undefined) {
                if (currentToolId === 'line') {
                    drawingObj.set({
                        ...drawingObj,
                        fill: colorRef.current,
                        stroke: colorRef.current,
                        x1: mouseDownX1,
                        y1: mouseDownY1,
                        x2: options.pointer.x,
                        y2: options.pointer.y,
                        x1T: mouseDownX1,
                        y1T: mouseDownY1,
                        x2T: options.pointer.x,
                        y2T: options.pointer.y,
                        leftT: (options.pointer.x < mouseDownX1 ? options.pointer.x : mouseDownX1),
                        topT: (options.pointer.y < mouseDownY1 ? options.pointer.y : mouseDownY1)
                    });
                } else if (currentToolId === 'rect') {
                    drawingObj.set({
                        fill: '',
                        stroke: colorRef.current,
                        strokeWidth: 5,
                        left: mouseDownX1,
                        top: mouseDownY1,
                        width: options.pointer.x - mouseDownX1,
                        height: options.pointer.y - mouseDownY1,
                        leftT: (options.pointer.x < mouseDownX1 ? options.pointer.x : mouseDownX1),
                        topT: (options.pointer.y < mouseDownY1 ? options.pointer.y : mouseDownY1)
                    });
                } else if (currentToolId === 'triangle') {
                    drawingObj.set({
                        fill: '',
                        stroke: colorRef.current,
                        strokeWidth: 5,
                        left: mouseDownX1,
                        top: mouseDownY1,
                        width: options.pointer.x - mouseDownX1,
                        height: options.pointer.y - mouseDownY1,
                        leftT: (options.pointer.x < mouseDownX1 ? options.pointer.x : mouseDownX1),
                        topT: (options.pointer.y < mouseDownY1 ? options.pointer.y : mouseDownY1)
                    });
                } else if (currentToolId === 'oval') {
                    let left, top, rx, ry;
                    if (options.pointer.x > mouseDownX1) {
                        left = mouseDownX1;
                        rx = Math.abs(options.pointer.x - mouseDownX1) / 2;
                    } else if (options.pointer.x < mouseDownX1) {
                        left = options.pointer.x;
                        rx = Math.abs(mouseDownX1 - options.pointer.x) / 2;
                    }
                    if (options.pointer.y > mouseDownY1) {
                        top = mouseDownY1;
                        ry = Math.abs(options.pointer.y - mouseDownY1) / 2;
                    } else if (options.pointer.y < mouseDownY1) {
                        top = options.pointer.y;
                        ry = Math.abs(mouseDownY1 - options.pointer.y) / 2;
                    }
                    drawingObj.set({
                        fill: '',
                        stroke: colorRef.current,
                        strokeWidth: 5,
                        left: left,
                        top: top,
                        rx: rx,
                        ry: ry,
                        leftT: (options.pointer.x < mouseDownX1 ? options.pointer.x : mouseDownX1),
                        topT: (options.pointer.y < mouseDownY1 ? options.pointer.y : mouseDownY1)
                    });
                }
                drawingObj.setCoords();
                getCanvas().renderAll();
            }
        });

        getCanvas().on('mouse:up', function (options) {
            future = [];
            if (drawingObj !== undefined) {
                const sendingObj = drawingObj;
                drawingObj = undefined;
                disableAllSelectionAbillities();
                setTimeout(() => {
                    sendObjectToGroup(evs.MODIFED, sendingObj);
                });
            } else if (currentToolId === 'text') {
                let text = window.prompt('enter the text:');
                if (text !== null) {
                    getCanvas().add(new fabric.Text(text, {
                        fontFamily: 'Delicious_500',
                        left: options.pointer.x,
                        top: options.pointer.y
                    }));
                }
                disableAllSelectionAbillities();
            } else if (currentToolId === 'pencil') {
                disableAllSelectionAbillities();
            } else if (currentToolId === 'brush') {
                disableAllSelectionAbillities();
            }
        });
        const addObj = (data, id) => {
            setTimeout(() => {
                let obj = JSON.parse(data.message);
                obj.id = id;
                obj.left = obj.leftT;
                obj.top = obj.topT;
                otherObjects[id] = obj;
                if (obj.type === 'line') {
                    let line = new fabric.Line([obj.left, obj.top, obj.left + obj.width, obj.top + obj.height], obj);
                    getCanvas().add(line);
                    getCanvas().renderAll();
                    forceUpdate();
                } else if (obj.type === 'rect') {
                    getCanvas().add(new fabric.Rect(obj));
                    getCanvas().renderAll();
                    forceUpdate();
                } else if (obj.type === 'triangle') {
                    getCanvas().add(new fabric.Triangle(obj));
                    getCanvas().renderAll();
                    forceUpdate();
                } else if (obj.type === 'ellipse') {
                    getCanvas().add(new fabric.Ellipse(obj));
                    getCanvas().renderAll();
                    forceUpdate();
                } else if (obj.type === 'text') {
                    getCanvas().add(new fabric.Text(obj.text, obj));
                    getCanvas().renderAll();
                    forceUpdate();
                } else if (obj.type === 'path') {
                    getCanvas().add(new fabric.Path(obj.path, obj));
                    getCanvas().renderAll();
                    forceUpdate();
                }
                dontReact = false;
            });
        };

        let tokenInit = subscribe(updates.WHITEBOARD_INIT, dataDict => {
            if (dataDict !== undefined) {
                console.log(dataDict);
                Object.keys(dataDict).forEach(id => {
                    let item = dataDict[id];
                    addObj(item, id);
                });
            }
        });

        let tokenAdded = subscribe(updates.WHITEBOARD_OBJECT_ADDED, ({ data, id }) => {
            dontReact = true;
            addObj(data, id);
        });

        let tokenRemoved = subscribe(updates.WHITEBOARD_OBJECT_REMOVED, ({ data, id }) => {
            setTimeout(() => {
                let obj = JSON.parse(data.message);
                obj.id = id;
                var existing = getObjectFromId(getCanvas(), id);
                if (obj.removed) {
                    if (existing) {
                        dontReact = true;
                        getCanvas().remove(existing);
                    }
                }
                getCanvas().renderAll();
            });
        });
        let tokenModified = subscribe(updates.WHITEBOARD_OBJECT_MODIFIED, ({ data, id, leftT, topT }) => {
            setTimeout(() => {
                let obj = JSON.parse(data.message);
                obj.id = id;
                obj.leftT = leftT;
                obj.topT = topT;
                console.log(obj);
                var existing = getObjectFromId(getCanvas(), id);
                if (existing) {
                    existing.set(obj);
                    existing.set('leftT', obj.leftT);
                    existing.set('topT', obj.topT);
                    existing.set('left', obj.leftT);
                    existing.set('top', obj.topT);
                    existing.setCoords();
                    getCanvas().renderAll();
                    forceUpdate();
                }
            });
        });

        fetchWhiteboardObjects();

        return () => {
            unsubscribe(tokenInit);
            unsubscribe(tokenAdded);
            unsubscribe(tokenRemoved);
            unsubscribe(tokenModified);
            unsubscribe(tokenUndo);
            unsubscribe(tokenRedo);
            unsubscribe(tokenDelete);
            canvas.current.dispose();
            canvas.current = null;
        };
    }, []);

    function sendObjectToGroup(action, pObject) {
        var m = {};
        m.message = JSON.stringify(pObject);
        var packet = { data: m, id: pObject.id, leftT: pObject.leftT, topT: pObject.topT };
        if (action === evs.ADDED) {
            addWhiteboardObject(packet);
        } else if (action === evs.MODIFED) {
            modifyWhiteboardObject(packet);
        } else if (action === evs.REMOVED) {
            removeWhiteboardObject(packet);
        }
    }

    function getObjectFromId(ctx, id) {
        var currentObjects = ctx.getObjects();
        for (var i = currentObjects.length - 1; i >= 0; i--) {
            if (currentObjects[i].id == id) {
                let obj = currentObjects[i];
                obj.set('id', id);
                return currentObjects[i];
            }
        }
        return null;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;

    return (
        <div style={{ width: width + 'px', height: height + 'px', position: 'relative', overflow: 'auto' }}>
            <div style={{
                width: width + 'px', height: height + 'px', position: 'absolute', left: 0, top: 0,
                backgroundSize: "24px 24px"
            }}>
                <canvas id="whiteboard" width={width} height={height}
                    style={{
                        position: 'absolute', left: 0, top: 0,
                    }}>
                </canvas>
            </div>
        </div >
    );
}
