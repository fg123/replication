module.exports = class PerfTracker {
    constructor(size) {
        this.size = size;
        this.buffer = [];
        for (let i = 0; i < size; i++) {
            this.buffer.push(0);
        }
        this.next = 0;
    }

    pushValue(value) {
        this.buffer[this.next] = value;
        this.next += 1;
        if (this.next >= this.size) {
            this.next = 0;
        }
    }

    getBuffer() {
        return this.buffer;
    }

    getMin() {
        return Math.min()
    }
};