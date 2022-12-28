
export default function fixEmpty(unit) {
    if (unit === undefined) {
        return {};
    } else {
        return unit;
    }
}
