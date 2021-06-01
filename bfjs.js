// Before some utilities this code needs.
Array.prototype.move = (from, to) => {
    this.splice(to, 0, this.splice(from, 1)[0]);
};
Array.prototype.pushBefore = (elem) => {
    this.push(elem);
    this.move(this.length - 1, 0);
};
// Im sorry for this sleep abomination
const sleep = (delay) => {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
};

// bfjs // Brainfuck Javascript Interpreter //

var mem = [0];
var memPointer = 0;

var insideLoopCounter = 0;

const executeInstruction = (inst) => {
    switch (inst) {
        case "<":
            memPointer--;
            if (memPointer < 0) {
                memPointer = mem.length - 1;
            }
            break;
        case ">":
            memPointer++;
            if (memPointer >= mem.length) {
                mem.push(0);
            }
            break;
        case "-":
            mem[memPointer]--;
            break;
        case "+":
            mem[memPointer]++;
            break;
        default:
            console.log("Unknown Instruction: " + inst);
            break;
    }
};

const executeCode = (code) => {
    let instructionPointer = 0;
    mem = [0];
    memPointer = 0;

    while (instructionPointer < code.length) {
        let instruction = code[instructionPointer];

        switch (instruction) {
            case "[":
                // If cell value is not 0: ++ insideLoopCounter;
                if (mem[memPointer] > 0) {
                    insideLoopCounter++;
                    console.log("inside loop, but wont jump it.");
                } else {
                    // If cell value is 0: Jump the loop, making sure no bugs occur with inside loops;
                    let loopsToSkip = 1;

                    console.log("jumping loops!");

                    while (loopsToSkip != 0 && code[instructionPointer] != "]") {
                        //if (code[instructionPointer] == "[") { loopsToSkip++; }
                        //if (code[instructionPointer] == "]") { loopsToSkip--; }

                        // Commented old code that used ifs, in this case the switch
                        // makes the jump 2x faster;

                        switch (code[instructionPointer]) {
                            case "[":
                                loopsToSkip++;
                                break;
                            case "]":
                                loopsToSkip--;
                                break;
                        }

                        instructionPointer++;
                    }
                }
                break;
            case "]":
                // This code is literally the same code as jumping
                // loops, except this is backwards;
                if (mem[memPointer] > 0) {
                    let loopsToSkip = 1;

                    while (loopsToSkip != 0 && code[instructionPointer] != "[") {
                        //if (code[instructionPointer] == "[") { loopsToSkip++; }
                        //if (code[instructionPointer] == "]") { loopsToSkip--; }

                        // Commented old code that used ifs, in this case the switch
                        // makes the jump 2x faster;

                        switch (code[instructionPointer]) {
                            case "[":
                                loopsToSkip--;
                                break;
                            case "]":
                                loopsToSkip++;
                                break;
                        }

                        instructionPointer--;
                    }
                }
                break;
            default:
                executeInstruction(instruction);
                break;
        }

        // This command makes the code go forward,
        // loops can manipulate this value to jump
        // around the code, but no other command
        // should ever touch this value;
        instructionPointer++;

        // This command will render the current status
        // at whick the code is, this is all the live
        // feedback that is given to the user while the
        // code is running, some commands can call this
        // function to make the feedback more detailed;
        renderBF();
    }
};

const renderBF = () => {
    // TODO:

    // This function shall update the values on screen according
    // to the values current in the variables, it's soul purpose
    // is to give feedback about what is happening to the user;

    var memoryDisplay = document.getElementsByClassName("memoryDisplay")[0];
    memoryDisplay.innerHTML = ""; // Remove children

    let index = 0;
    mem.forEach((memCell) => {
        let memoryCell = document.createElement("div");

        // If memCell is the selected one, set class to "memoryCellSelected";
        // else: set it to "memoryCell";
        if (index == memPointer) {
            memoryCell.className = "memoryCellSelected";
        } else {
            memoryCell.className = "memoryCell";
        }

        // Put the cell value inside the DOM Object;
        memoryCell.innerHTML = memCell;

        // Append to Memory Display
        memoryDisplay.appendChild(memoryCell);

        // Keeping track of index
        // in a foreach loop requires
        // counting the index every
        // time in the loop;
        index++;
    });

    // Any waiting that needs to be done during the execution to
    // slow the code so the user can debug it must be done here;
};

renderBF();
