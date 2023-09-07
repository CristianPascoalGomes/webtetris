const logger = document.querySelector("#log");
function log(msg) {
    console.log(msg);
    logger.innerHTML += msg + "<br>";
}

function clearLog() { logger.innerHTML = ""; }

class CellState {
    static Empty = new CellState('empty');
    static Filled = new CellState('filled');
    static Moving = new CellState('moving');

    constructor(name) {
        this.name = name;
    }
    toString() {
        return `CellState.${this.name}`;
    }
}


class Field {
    #field = {};

    #width = 10;
    getWidth() {
        return this.#width;
    }

    #height = 20;
    getHeight() {
        return this.#height;
    }

    constructor() {
        const svg = document.querySelector("svg");
        const block = document.querySelector("svg rect");
        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                const newBlock = block.cloneNode(true);
                newBlock.setAttribute("tx", x);
                newBlock.setAttribute("x", x * 25 + 3);
                newBlock.setAttribute("ty", y);
                newBlock.setAttribute("y", y * 25 + 3);
                newBlock.setAttribute("id", `${x},${y}`);
                newBlock.addEventListener("click", (event) => {
                    try {
                        const tx = event.target.getAttribute("tx");
                        const ty = event.target.getAttribute("ty");
                        const p = new Vec(tx, ty);
                        f.toggle(p);
                    } catch (error) {
                        log(error);
                    }
                });
                svg.appendChild(newBlock);
            }
        }
    }

    /**
     * @param {Vec} pos
     * @returns {boolean} 
    */
    check(pos) {
        if (pos.x >= this.#width || pos.x < 0) {
            return false;
        }
        if (pos.y >= this.#height || pos.y < 0) {
            return false;
        }
        return true;
    }

    /**
     * @param {Vec} pos
     * @param {CellState} value
    */
    set(pos, value) {
        try {
            if (this.check(pos)) {
                this.#field[`${pos.x},${pos.y}`] = value;
                const block = document.getElementById(`${pos.x},${pos.y}`);
                if (value == CellState.Filled) {
                    block.classList.add("set");
                    block.classList.remove("moving");
                }
                else if (value == CellState.Moving) {
                    block.classList.remove("set");
                    block.classList.add("moving");
                }
                else {
                    block.classList.remove("set");
                    block.classList.remove("moving");
                }
            }
            return;
        } catch (error) {
            log(error);
        }
    }

    /**
     * @param {Vec} x
    */
    toggle(pos) {
        var value = f.get(pos);
        if (f.get(pos) == CellState.Filled || f.get(pos) == CellState.Moving) {
            f.set(pos, CellState.Empty);
        } else {
            f.set(pos, CellState.Filled);
        }
    }

    /**
     * @param {Vec} pos
     * @returns {CellState}
    */
    get(pos) {
        try {
            const value = this.#field[`${pos.x},${pos.y}`];
            if (value == undefined) {
                return false;
            }
            return value;
        } catch (error) {
            log(error);
        }
    }

    #rowCollapserRoutine() {
        for (let y = 0; y < this.#height; y++) {
            for (let x = 0; x < this.#width; x++) {
                if (!this.get(x, y)) {
                    break;
                }
                if (this.get(x, y) && x == this.#width - 1) {
                    log(`row ${y} is collapsed`);
                    for (let index = 0; index < this.#width; index++) {
                        this.set(index, y, false);
                    }
                }
            }
        }
    }
}
const f = new Field();

const initPos = new Vec(4, 0);
var blkPos = new Vec(4, 0);
const o = [
    new Vec(0, 0),
    new Vec(1, 0),
    new Vec(0, 1),
    new Vec(1, 1),
];

/**
 * @param {Array} piece
 * @param {Vec} newPos
 * @returns {boolean}
 */
function canMove(piece, newPos) {
    canMove = true;
    newPos.
    piece.forEach(blok => {
        if (f.get(newPos) == CellState.Filled || newPos.y > f.getHeight() - 1) {  //piece placed
            canMove = false;
            return;
        }
    });
}


setInterval(() => {
    var canMove = true;
    o.forEach(piece => {
        const prev = new Vec(0, 0).add(blkPos).add(piece);
        const next = new Vec(0, 1).add(prev);
        if (f.get(next) == CellState.Filled || next.y > f.getHeight() - 1) {  //piece placed
            canMove = false;
            return;
        }
    });
    o.forEach(piece => {
        const next = new Vec(0, 0).add(blkPos).add(piece);
        f.set(next, CellState.Empty);
    });
    if (canMove) {
        blkPos.y += 1;
        o.forEach(piece => {
            const next = new Vec(0, 0).add(blkPos).add(piece);
            f.set(next, CellState.Moving);
        });
    } else {
        o.forEach(piece => {
            const next = new Vec(0, 0).add(blkPos).add(piece);
            f.set(next, CellState.Filled);
        });
        blkPos = new Vec(initPos.x, initPos.y);
    }
}, 500);

document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (key == "space" || key == "d" || key == "a" || key == "s") {
        o.forEach(piece => {
            const next = new Vec(0, 0).add(blkPos).add(piece);
            f.set(next, CellState.Empty);
        });

        if (key == "d") {
            blkPos = new Vec(1, 0).add(blkPos);
        }
        else if (key == "a") {
            blkPos = new Vec(-1, 0).add(blkPos);
        }
        else if (key == "s") {
            blkPos = new Vec(0, 1).add(blkPos);
        }

        o.forEach(piece => {
            const next = new Vec(0, 0).add(blkPos).add(piece);
            f.set(next, CellState.Moving);
        });
    }
});
log("game started");