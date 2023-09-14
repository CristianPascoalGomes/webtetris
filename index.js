const logger = document.querySelector("#log");
function clearLog() { logger.innerHTML = ""; }
function log(msg) {
    clearLog();
    console.log(msg);
    logger.innerHTML += msg + "<br>";
}
const counter = document.querySelector("#counter");
const next = document.querySelector("#next");

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
     * @param {Vec} pos
    */
    toggle(pos) {
        var value = f.get(pos);
        if (value == CellState.Filled || value == CellState.Moving) {
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
                this.#field[`${pos.x},${pos.y}`] = CellState.Empty;
                return CellState.Empty;
            }
            return value;
        } catch (error) {
            log(error);
        }
    }

    clear() {
        for (let x = 0; x < this.getWidth(); x++) {
            for (let y = 0; y < this.getHeight(); y++) {
                f.set(new Vec(x, y), CellState.Empty);
            }
        }
    }
}
const f = new Field();

// class Piece {
//     #arr = new Array(4);

//     constructor(a, b, c, d) {
//         arr[0] = a;
//         arr[1] = b;
//         arr[2] = c;
//         arr[3] = d;
//     }

//     get(index){
//         this.#arr[index];
//     }
// }

const pieces = {
    Square: [
        new Vec(0, 0),
        new Vec(1, 0),
        new Vec(0, 1),
        new Vec(1, 1),
    ],
    S: [
        new Vec(0, 0),
        new Vec(1, 0),
        new Vec(1, 1),
        new Vec(2, 1),
    ],
    Z: [
        new Vec(1, 0),
        new Vec(2, 0),
        new Vec(0, 1),
        new Vec(1, 1),
    ],
    T: [
        new Vec(1, 0),
        new Vec(0, 1),
        new Vec(1, 1),
        new Vec(2, 1),
    ],
    I: [
        new Vec(0, 0),
        new Vec(0, 1),
        new Vec(0, 2),
        new Vec(0, 3),
    ],
    L: [
        new Vec(2, 0),
        new Vec(0, 1),
        new Vec(1, 1),
        new Vec(2, 1),
    ],
    J: [
        new Vec(0, 0),
        new Vec(0, 1),
        new Vec(1, 1),
        new Vec(2, 1),
    ]
}

const piecesArray = Object.values(pieces);

/**
 * @param {Array<Vec>} piece
 * @returns {Vec}
 */
function getCenterOfPiece(piece) {
    var max = new Vec(0, 0);
    var min = new Vec(0, 0);
    piece.forEach(blk => {
        if (blk.x > max.x) {
            max.x = blk.x;
        }
        if (blk.y > max.y) {
            max.y = blk.y;
        }
        if (blk.x < min.x) {
            min.x = blk.x;
        }
        if (blk.y < min.y) {
            min.y = blk.y;
        }
    });
    return min.add(max.divide(2));
}

/**
 * @param {Array<Vec>} piece 
 * @returns {Array<Vec>}
 */
function rotatePiece(piece) {
    var newPiece = Array(4);
    var min = new Vec(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    for (let index = 0; index < piece.length; index++) {
        const blk = piece[index];
        var x = -blk.y;
        var y = blk.x;
        newPiece[index] = new Vec(x, y);

        min.x = Math.min(min.x, x);
        min.y = Math.min(min.y, y);
    }

    for (let index = 0; index < newPiece.length; index++) {
        newPiece[index] = newPiece[index].sub(min);
    }

    return newPiece;
}

/**
 * @param {Array} piece
 * @param {Vec} newPos
 * @returns {boolean}
*/
function canSetPieceAt(piece, newPos) {
    var can = true;
    piece.forEach(block => {
        const newBlockPos = newPos.add(block);
        if (f.get(newBlockPos) == CellState.Filled || !f.check(newBlockPos)) {
            can = false;
            return;
        }
    });
    return can;
}

/**
 * @param {Array} piece
 * @param {Vec} newPos
 * @returns {boolean}
*/
function canRotatePieceAt(piece, newPos) {
    var can = true;
    var rotatedPiece = rotatePiece(piece);
    rotatedPiece.forEach(block => {
        const newBlockPos = newPos.add(block);
        if (f.get(newBlockPos) == CellState.Filled || !f.check(newBlockPos)) {
            can = false;
            return;
        }
    });
    return can;
}

/**
 * @param {Array} piece
 * @param {Vec} newPos
*/
function setPieceAt(piece, newPos) {
    if (canSetPieceAt(piece, newPos)) {
        piece.forEach(block => {
            const newBlockPos = newPos.add(block);
            f.set(newBlockPos, CellState.Filled);
        });
    }
}


function updateField() {
    for (let x = 0; x < f.getWidth(); x++) {    //remove all moving blocks
        for (let y = 0; y < f.getHeight(); y++) {
            var currentPosition = new Vec(x, y);
            var cellState = f.get(currentPosition);
            if (cellState == CellState.Moving) {
                f.set(currentPosition, CellState.Empty);
            }
        }
        currentPiece.forEach(block => {
            f.set(block.add(currentPiecePos), CellState.Moving);
        });
    }

}


/**
 * 
 * @param {Number} y 
 * @returns {Boolean}
*/
function isLineFull(y) {
    for (let x = 0; x < f.getWidth(); x++) {
        const blockState = f.get(new Vec(x, y));
        if (blockState == CellState.Empty) {
            return false;
        }
    }
    return true;
}

/**
 * 
 * @param {Number} y 
*/
function breakLine(y) {
    for (let x = 0; x < f.getWidth(); x++) {
        f.set(new Vec(x, y), CellState.Empty);
    }
    for (let currY = y; currY >= 0; currY--) {
        for (let x = 0; x < f.getHeight(); x++) {
            f.set(new Vec(x, currY), f.get(new Vec(x, currY - 1)));
        }
    }
}

function getRandomPiece(){
    const index = Math.round(Math.random() * (piecesArray.length - 1));
    return piecesArray[index];
}

var points = 0;
const initPos = new Vec(4, 0);
var currentPiecePos = Vec.zero();
var currentPiece = getRandomPiece();
var nextPiece = getRandomPiece();
next.innerHTML = nextPiece.toString();
var isGameOver = false;

setInterval(() => {
    if (canSetPieceAt(currentPiece, currentPiecePos.add(Vec.down()))) {     //if can fall
        currentPiecePos = currentPiecePos.add(Vec.down());
    } else {
        setPieceAt(currentPiece, currentPiecePos);
        for (let y = 0; y < f.getHeight(); y++) {
            if (isLineFull(y)) {
                breakLine(y);
                points++;
                log("1+");
                counter.innerHTML = `Counter: ${points}`;    
            }
        }
        if (canSetPieceAt(currentPiece, initPos)) {     //tries to spawn another piece 
            currentPiecePos = initPos.copy();
            currentPiece = nextPiece;
            nextPiece = getRandomPiece();
            next.innerHTML = nextPiece.toString();
        }
        else {
            alert("Game Over");
            f.clear();
            points = 0;
            counter.innerHTML = `Counter: ${points}`;
        }
    }
    
    updateField();
}, 500);

document.addEventListener("keydown", (event) => {
    const key = event.key;

    var moving = Vec.zero();
    if (key == "s") {
        moving = moving.add(Vec.down());
    }
    else if (key == "d") {
        moving = moving.add(Vec.right());
    }
    else if (key == "a") {
        moving = moving.sub(Vec.right());
    }
    if (canSetPieceAt(currentPiece, currentPiecePos.add(moving))) {
        currentPiecePos = currentPiecePos.add(moving);
        updateField();
    }

    if (key == "w") {
        const rotatedPiece = rotatePiece(currentPiece);
        if (canSetPieceAt(rotatedPiece, currentPiecePos)) {
            currentPiece = rotatedPiece;
            updateField();
        } else {
            log("cant rotate");
        }
    }
});
log("game started");