// Tic Tac Toe
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 800;

let resetBtn = document.getElementById("reset-btn")
let playerOneScore = document.getElementById("player-one-score")
let playerTwoScore = document.getElementById("player-two-score")
let onGoing = false

player1 = {
    player: 1,
    symbol: "X",
    score: 0
}

player2 = {
    player: 2,
    symbol: "O",
    score: 0
}

let occupiedSpace = []

function drawBoard() {
    // Draw vertical lines
    ctx.lineWidth = 1
    for (i = cnv.width/3; i < cnv.width; i += cnv.width/3) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, cnv.height);
        ctx.stroke();
    }
    // Draw horizontal lines
    for (i = cnv.height/3; i < cnv.height; i += cnv.height/3) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(cnv.width, i);
        ctx.stroke();
    }
}


// resets game
function clear() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    occupiedSpace = []
    currentPlayer = player1
    onGoing = true
    drawBoard()
}

// check which column the mouse is in
function checkColumn(mouseX) {
    if (mouseX > 0 && mouseX < cnv.width/3) {
        return 1
    } else if (mouseX > cnv.width/3 && mouseX < cnv.width/3 *2) {
        return 2
    } else if (mouseX < cnv.width) {
        return 3
    }
}

// check which row the mouse is in
function checkRow(mouseY) {
    if (mouseY > 0 && mouseY < cnv.height/3) {
        return 1
    } else if (mouseY > cnv.height/3 && mouseY < cnv.height/3 *2) {
        return 2
    } else if (mouseY < cnv.height) {
        return 3
    }
}

// Check if space is occupied
function checkSpace(row, column) {
    if (occupiedSpace.length > 0) {
        for (i = 0; i < occupiedSpace.length; i++) {
            if (occupiedSpace[i][0] == row && occupiedSpace[i][1] == column) {
                return false
            }
        }
    }
    return true
}

// Count number of spaces a symbol has taken up
function countSpace(direction, space) {
    if (direction.symbol == "") {
        direction.symbol = space
        direction.num ++
    } else if (direction.symbol == space) {
        direction.num ++
    }
}

function checkForWin() {
    // c = column, r = row, d = diagonal
    let c1 = {num: 0, symbol: ""}, c2 = {num: 0, symbol: ""}, 
    c3 = {num: 0, symbol: ""}, r1 = {num: 0, symbol: ""}, 
    r2 = {num: 0, symbol: ""}, r3 = {num: 0, symbol: ""}, 
    d1 = {num: 0, symbol: ""}, d2 = {num: 0, symbol: ""}

    if (occupiedSpace.length > 0) {
        for (i = 0; i < occupiedSpace.length; i++) {
            
            // Verticle
            if (occupiedSpace[i][1] == 1) {
                countSpace(c1, occupiedSpace[i][2])
            } else if (occupiedSpace[i][1] == 2) {
                countSpace(c2, occupiedSpace[i][2])
            } else if (occupiedSpace[i][1] == 3) {
                countSpace(c3, occupiedSpace[i][2])
            }
            // Horizontal
            if (occupiedSpace[i][0] == 1) { 
                countSpace(r1, occupiedSpace[i][2])
            } else if (occupiedSpace[i][0] == 2) {
                countSpace(r2, occupiedSpace[i][2])
            } else if (occupiedSpace[i][0] == 3) {
                countSpace(r3, occupiedSpace[i][2])
            }

            // Diagonal
            if ((occupiedSpace[i][0] == 1 && occupiedSpace[i][1] == 1) ||
                (occupiedSpace[i][0] == 2 && occupiedSpace[i][1] == 2) ||
                (occupiedSpace[i][0] == 3 && occupiedSpace[i][1] == 3)
            ) {
                countSpace(d1, occupiedSpace[i][2])
            }
            if (
                (occupiedSpace[i][0] == 1 && occupiedSpace[i][1] == 3) ||
                (occupiedSpace[i][0] == 2 && occupiedSpace[i][1] == 2) ||
                (occupiedSpace[i][0] == 3 && occupiedSpace[i][1] == 1)) {
                countSpace(d2, occupiedSpace[i][2])
            }
        }
    }

 
    if (c1.num == 3) {
        return ["c", 1]
    } else if (c2.num == 3) {
        return ["c", 2]
    } else if (c3.num == 3) {
        return ["c", 3]
    } else if (r1.num == 3) {
        return ["r", 1]
    } else if (r2.num == 3) {
        return ["r", 2]
    } else if (r3.num == 3) {
        return ["r", 3]
    } else if (d1.num == 3) {
        return ["d", 1]
    } else if (d2.num == 3) {
        return ["d", 2]
    } else {
        return false
    }
}

function clickDetection(event) {
    let cnvRect = cnv.getBoundingClientRect();
    scaleX = canvas.width / cnvRect.width,    
    scaleY = canvas.height / cnvRect.height;

    mouseX = (event.x - cnvRect.x) * scaleX;
    mouseY = (event.y - cnvRect.y) * scaleY;

    let row = checkRow(mouseY)
    let column = checkColumn(mouseX)

    if (row && column && checkSpace(row, column) && onGoing) {
        occupiedSpace.push([row, column, currentPlayer.symbol])
        ctx.font = "bold 150px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(currentPlayer.symbol, 
            (column * cnv.width/3) - cnv.width/6 - ctx.measureText(currentPlayer.symbol).width/2, // center horizontal
            (row * cnv.height/3) - cnv.height/6 + (ctx.measureText(currentPlayer.symbol).fontBoundingBoxAscent - ctx.measureText(currentPlayer.symbol).fontBoundingBoxDescent)/2 // center vertical.
        );

        if (checkForWin()) {
            let lineInfo = checkForWin()
            ctx.lineWidth = 10;
            ctx.beginPath()
            if (lineInfo[0] == "c") {
                ctx.moveTo(lineInfo[1] * cnv.width/3 - cnv.width/6,0)
                ctx.lineTo(lineInfo[1] * cnv.width/3 - cnv.width/6, cnv.height)
            } else if (lineInfo[0] == "r") {
                ctx.moveTo(0,lineInfo[1] * cnv.height/3 - cnv.height/6)
                ctx.lineTo(cnv.width, lineInfo[1] * cnv.height/3 - cnv.height/6)
            } else if (lineInfo[0] == "d") {
                if (lineInfo[1] == 1) {
                    ctx.moveTo(0,0)
                    ctx.lineTo(cnv.width, cnv.height)
                } else {
                    ctx.moveTo(cnv.width,0)
                    ctx.lineTo(0, cnv.height)
                }
            }
            ctx.stroke()
            currentPlayer.score ++
            playerOneScore.innerHTML = player1.score
            playerTwoScore.innerHTML = player2.score
            onGoing = false
        } else if (currentPlayer.player == 1) {
           currentPlayer = player2
       } else {
        currentPlayer = player1
       }
    }
}


document.addEventListener("click", clickDetection)
resetBtn.addEventListener("click", clear)

clear()