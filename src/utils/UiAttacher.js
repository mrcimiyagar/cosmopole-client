
export function checkElementAvailable(elId, job) {
    let interval = setInterval(() => {
        if (document.getElementById(elId) !== null) {
            job();
            clearInterval(interval);
        }
    }, 250);
}
