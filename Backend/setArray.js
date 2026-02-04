export default function setArray(array) {
    const setData = new Set(array);
    const arrayData = [...setData];
    return arrayData;
}