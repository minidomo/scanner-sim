class CellObject {
    constructor(obj = {}) {
        this.read = obj.read || false;
        this.skipped = obj.skipped || false;
        if (obj.value && !obj.empty) {
            this.value = obj.value;
            this.empty = false;
        } else {
            this.value = ' ';
            this.empty = true;
        }
    }

    getColors() {
        const obj = {};
        if (this.skipped) {
            obj.backgroundColor = '#F7AEF8';
        } else if (this.read) {
            obj.backgroundColor = '#8093F1';
        } else if (this.empty) {
            obj.backgroundColor = '#4D5061';
        } else {
            obj.backgroundColor = '#677DB7';
        }
        return obj;
    }

    toString() {
        return 'CellObj { ' + this.value + ', ' + this.empty + ', ' + this.read + ' }';
    }
}

export default CellObject;