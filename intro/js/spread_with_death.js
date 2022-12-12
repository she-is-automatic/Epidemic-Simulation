let w;
let columns;
let rows;

let board;
let next;
let dir;
let startDay;
let currentDay = 0;

let xPos;

// 状态
const GOOD = 0;
const ACTIVE = 1;
const RECOVERD = 2;
const DEAD = 3;

let infectRate = 0.5;   // 感染概率
let deathRate = 0.01;   // 死亡率
let recoveryDays = 4;   // 恢复天数

function setup() {
    frameRate(2);
    createCanvas(620, 710);
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
    startDay = new Array(columns);
    for (i = 0; i < columns; i++) {
        startDay[i] = new Array(rows);
    }
    dir = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    xPos = width / 2 + 100;

    textSize(15);
    infectRateSlider = createSlider(0, 100, 50);
    infectRateSlider.position(xPos, height - 90);
    recoveryDaysSlider = createSlider(1, 10, 4);
    recoveryDaysSlider.position(xPos, height - 60);
    deathRateSlider = createSlider(0, 50, 10);
    deathRateSlider.position(xPos, height - 30);

    init();
}

function draw() {
    background(255);
    spread();
    for (let i = 1; i < columns - 1; i++) {
        for (let j = 1; j < rows - 1; j++) {
            if ((board[i][j] == ACTIVE)) fill(244, 122, 158);    // 正在感染
            else if (board[i][j] == RECOVERD) fill(38, 179, 235);   // 痊愈了
            else if (board[i][j] == DEAD) fill(0);
            else fill(255);
            stroke(222, 225, 230);
            rect(i * w, j * w, w - 1, w - 1);
        }
    }

    // 滑动条展示
    infectRate = infectRateSlider.value() / 100;
    recoveryDays = recoveryDaysSlider.value();
    deathRate = deathRateSlider.value() / 1000;
    fill(0);
    text('感染概率(0%~100%)', width / 2 + infectRateSlider.width / 2, height - 75);
    text('恢复天数(1~10d)', width / 2 + recoveryDaysSlider.width / 2, height - 45);
    text('死亡概率(0%~5%)', width / 2 + deathRateSlider.width / 2, height - 15);
}

// reset board when mouse is pressed
function mousePressed() {
    init();
}

// Fill board randomly
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            board[i][j] = 0;
            next[i][j] = 0;
            startDay[i][j] = 0;
        }
    }
    var cx = floor(columns / 2), cy = floor(rows / 2);
    board[cx][cy] = 1;
    startDay[cx][cy] = 1;
    currentDay = 0;
}

function inside(x, y) {
    if (x > 0 && x < columns - 1 && y > 0 && y < rows - 1) return true;
    else return false;
}

function spread() {
    // 更新当前时间
    currentDay += 1;
    // 更新整个棋盘
    for (let x = 1; x < columns - 1; x++) {
        for (let y = 1; y < rows - 1; y++) {
            next[x][y] = GOOD;
            // 如果我恢复了或死了，就不会再改变
            if (board[x][y] == RECOVERD || board[x][y] == DEAD) next[x][y] = board[x][y];
            // 如果我在活跃期，看看我会不会死，不会死就看看我是否该痊愈
            else if (board[x][y] == ACTIVE) {
                if (Math.random() < deathRate) next[x][y] = DEAD;
                else {
                    if (currentDay - startDay[x][y] == recoveryDays) next[x][y] = RECOVERD;
                    else next[x][y] = ACTIVE;
                }
            }
            // 我没被感染，看看我的好邻居们会不会传染我
            else {
                for (let i = 0; i < 4; ++i) {
                    let nextX = x + dir[i][0], nextY = y + dir[i][1];
                    if (board[nextX][nextY] == ACTIVE && Math.random() < infectRate) {
                        next[x][y] = ACTIVE;
                        startDay[x][y] = currentDay;
                    }
                }
            }

        }

    }
    var temp = board;
    board = next;
    next = temp;
}
