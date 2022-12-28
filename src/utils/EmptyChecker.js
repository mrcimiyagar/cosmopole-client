
export default function filterEmpty(unit, defaultVal) {
    if (unit === undefined) {
        return defaultVal;
    } else {
        return unit;
    }
}
