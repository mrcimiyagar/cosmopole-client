
import { isGettingBack } from '../App';

export let setupScrollListenerForContainer = (elementId, tag, persistent, callback) => {
    const localStorageKey = `${elementId}_ScrollTop_${tag}`;
    document.querySelectorAll('.' + elementId).forEach(el => {
        el.onscroll = e => {
            let st = el.scrollTop;
            if (st !== 0) localStorage.setItem(localStorageKey, st);
        }
    });
    if (persistent) {
        let scrollTop = localStorage.getItem(localStorageKey);
        if (scrollTop !== null) {
            document.querySelectorAll('.' + elementId).forEach(el => {
                el.scroll({
                    top: Number(scrollTop),
                    left: 0
                });
                if (callback !== undefined) callback();
            });
        }
    } else {
        if (isGettingBack) {
            let scrollTop = localStorage.getItem(localStorageKey);
            if (scrollTop !== null) {
                document.querySelectorAll('.' + elementId).forEach(el => {
                    el.scroll({
                        top: Number(scrollTop),
                        left: 0
                    });
                    if (callback !== undefined) callback();
                });
            }
        }
    }
};

export let resetScrollListenerForContainer = (elementId, tag) => {
    localStorage.setItem(elementId + 'ScrollTop' + '_' + tag, 0);
};
