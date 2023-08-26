class Field{
    #field;
    constructor(){
        this.field = Array.from(Array(10), () => new Array(20));
        for (let index = 0; index < this.field.length; index++) {
            const element = this.field[index];
            for (let index = 0; index < element.length; index++) {
                element[index] = false;
            }
        }
    }
    /**
     * @param {int} x
     * @param {int} y
     * @param {boolean} value
     */
    set(x,y,value) {
        field[x][y] = value;
        const block = document.querySelector("%{x} %{y}");
        if(value && !block.classList.contains("set")){
            document.querySelector("%{x} %{y}").classList.add("set");
        }else{
            document.querySelector("%{x} %{y}").classList.remove("set");
        }
    }
    get(x,y){
        return field[x][y];
    }
}
const svg = document.querySelector("svg");
const block = document.querySelector("svg rect");
block.classList.contains("set");
for (let y = 0; y <= 19; y++) {
    for (let x = 0; x <= 9; x++) {
        const newBlock = block.cloneNode(true);
        newBlock.setAttribute("x", x * 25 + 3);
        newBlock.setAttribute("y", y * 25 + 3);
        newBlock.setAttribute("id", "" + x + " " + y);
        newBlock.addEventListener("click", (event) =>{
            log(event.target);
            event.target.id
        });
        svg.appendChild(newBlock);
    }
}

const logger = document.querySelector("#log");
function log(msg) {
    console.log(msg);
    logger.innerHTML += msg + "<br>";
}
function clearLog(){ logger.innerHTML = "";}
log("start");
const f = new Field();
log(f);
