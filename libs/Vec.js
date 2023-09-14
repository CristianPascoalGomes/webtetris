class Vec {
    static #right = new Vec(1, 0);
    static #down = new Vec(0, 1);
    static #zero = new Vec(0, 0);

    /**
     * @returns {Vec}
     */
    static right() { return this.#right.copy(); }
    /**
     * @returns {Vec}
     */
    static down() { return this.#down.copy(); }
    /**
     * @returns {Vec}
     */
    static zero() { return this.#zero.copy(); }

    x;
    y;

    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @returns {Vec}
     */
    copy() {
        return new Vec(this.x, this.y);
    }

    /**
     * @param {Vec} other 
     * @returns {Vec}
    */
    static add(vecA, vecB) {
        return new Vec(vecA.x + vecB.x, vecA.y + vecB.y);
    }

    /**
     * @param {Vec} other 
     * @returns {Vec}
     */
    add(other) {
        return Vec.add(this, other);
    }

    /**
     * @param {Vec} other 
     * @returns {Vec}
     */
    static sub(vecA, vecB) {
        return new Vec(vecA.x - vecB.x, vecA.y - vecB.y);
    }

    /**
     * @param {Vec} other 
     * @returns {Vec}
     */
    sub(other) {
        return Vec.sub(this, other);
    }

    /**
     * @param {Vec} vec 
     * @param {Number} number 
     * @returns {Vec}
     */
    static divide(vec, number) {
        return new Vec(vec.x / number, vec.y / number);
    }

    /**
     * @param {Number} number 
     * @returns {Vec}
     */
    divide(number) {
        return Vec.divide(this, number);
    }

    /**
     * @returns {Vec}
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * @returns {Vec}
     */
    normalized() {
        const mag = this.magnitude();
        return new Vec(this.x / mag, this.y / mag);
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}