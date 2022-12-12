
let w;
let columns;
let rows;
let board;
let next;
let dir;

// 状态
const GOOD = 0;
const ACTIVE = 1;

// 感染概率
let infectRate = 0.5;

let xPos;

function setup() {
    frameRate(2);
    createCanvas(620, 660);
    xPos = width / 2 + 100;

    w = 20;
    // Calculate columns and rows
    columns = floor(width / w);
    rows = floor(width / w);
    // Wacky way to make a 2D array is JS
    board = new Array(columns);
    for (let i = 0; i < columns; i++) {
        board[i] = new Array(rows);
    }
    // Going to use multiple 2D arrays and swap them
    next = new Array(columns);
    for (i = 0; i < columns; i++) {
        next[i] = new Array(rows);
    }
    dir = [[-1, 0], [1, 0], [0, -1], [0, 1]];


    textSize(15);
    infectRateSlider = createSlider(0, 100, 50);
    infectRateSlider.position(xPos, height - 30);
    init();
}

function draw() {
    background(255);
    spread();
    for (let i = 1; i < columns - 1; i++) {
        for (let j = 1; j < rows - 1; j++) {
            if ((board[i][j] == ACTIVE)) fill(244, 122, 158);
            else fill(255);
            stroke(222, 225, 230);
            rect(i * w, j * w, w - 1, w - 1);
        }
    }

    // 滑动条展示
    infectRate = infectRateSlider.value() / 100;
    fill(0);
    text('感染概率(0%~100%)', width / 2 + infectRateSlider.width / 2, height - 15);

}

// reset board when mouse is pressed
function mousePressed() {
    init();
}

// Fill board randomly
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            board[i][j] = 0, next[i][j] = 0;
        }
    }
    board[floor(columns / 2)][floor(rows / 2)] = 1;
}

function inside(x, y) {
    if (x > 0 && x < columns - 1 && y > 0 && y < rows - 1) return true;
    else return false;
}

function spread() {
    // 更新整个棋盘
    for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
            next[x][y] = GOOD;
            if (board[x][y] == ACTIVE) next[x][y] = ACTIVE;
            else {
                for (let i = 0; i < 4; ++i) {
                    let nextX = x + dir[i][0], nextY = y + dir[i][1];
                    if (board[nextX][nextY] == ACTIVE) {
                        if (Math.random() < infectRate) next[x][y] = ACTIVE;
                    }
                }
            }
        }
    }
    var temp = board;
    board = next;
    next = temp;
}
