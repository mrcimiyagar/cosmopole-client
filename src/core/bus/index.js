import PubSub from 'pubsub-js';
import fixEmpty from '../../utils/DefaultAssigner';

export let states = {};
export let sectionState = {};

export const subscribe = (topic, callback) => {
    return PubSub.subscribe(topic, (msg, data) => callback(data));
};

export const unsubscribe = (topic) => {
    PubSub.unsubscribe(topic);
};

export const publish = (topic, data) => {
    PubSub.publish(topic, data);
};

export const saveState = (sectionId, state, tag) => {
    states[sectionId + '_' + tag] = { ...states[sectionId], ...state, tag };
};

export const restoreState = (sectionId, tag) => {
    return fixEmpty(states[sectionId + '_' + tag]);
};
