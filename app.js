var ballX = 75;
var ballY = 75;
var ballSpeedX = 10;
var ballSpeedY = 10;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COLS = 10;
const BRICK_ROWS = 10;
const BRICK_GAP = 2;

// var brick0 = true;
// var brick1 = false;
// var brick2 = true;
// var brick3 = true;
var brickGrid =  new Array(BRICK_COLS - BRICK_ROWS);
var bricksLeft = 0;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 20;
const PADDLE_DISTANCE_FROM_EDGE = 60;
var paddleX = 400;

var canvas, canvasContext;
var mouseX, mouseY;


function brickReset() {
  bricksLeft = 0;
  for (var i = 3; i < 3 * BRICK_COLS; i++) {
      brickGrid[i] = false;
  }
  for (var i = 3 * BRICK_COLS; i < BRICK_COLS * BRICK_ROWS; i++) {
    brickGrid[i] = true;
    bricksLeft++;
  }
}

window.onload = function() {
  canvas = this.document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(updateAll, 950/framesPerSecond); 

  canvas.addEventListener('mousemove', updateMousePosition);

  brickReset();
  ballReset();
}

function updateMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = event.clientX - rect.left - root.scrollLeft;
  mouseY = event.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - PADDLE_WIDTH/2;  // subtract half of paddle's width to center mouse pointer 
  // paddleX = mouseX;

  // CHEAT / HACK TO TEST BALL IN ANY POSITION
  /*
  ballX = mouseX;
  ballY = mouseY;
  ballSpeedX = 4;
  ballSpeedY = -4;
  */
}

function updateAll() {
  drawAll();
  moveAll();
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function ballMove() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  
  if (ballX < 0 && ballSpeedX < 0.0) {  // left
    ballSpeedX *= -1; 
  }
  if (ballX > canvas.width && ballSpeedX > 0.0) {  // right
    ballSpeedX *= -1; 
  }
  
  if (ballY < 0 && ballSpeedY < 0.0) { // top
    ballSpeedY *= -1; 
  }
  if (ballY > canvas.height) { // bottom
    ballReset();
    ballSpeedY *= -1; 
  }
}  

// fixing first row bouncing at the wrong direction Bug
function isBrickAtColRow(col, row) {
  if (col >= 0 && col < BRICK_COLS &&
      row >= 0 && row < BRICK_ROWS) {
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
      } else {
        return false;
      }
}

function ballBrickHandling() {
  var ballBrickCol = Math.floor(ballX / BRICK_W);
  var ballBrickRow = Math.floor(ballY / BRICK_H);
  var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
  
  if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&       
      ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {
      if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      // if (brickGrid[brickIndexUnderBall]) {   // without this, ball will not know if there is a brick and will bounce back even if no brick. Because for the ball, there is a brick but it is just set to false.

      brickGrid[brickIndexUnderBall] = false; // REMOVE brick
      bricksLeft--;
      console.log(bricksLeft);

      var prevBallX = ballX - ballSpeedX;
      var prevBallY = ballY - ballSpeedY;
      var prevBrickRow = Math.floor(prevBallY / BRICK_H);
      var prevBrickCol = Math.floor(prevBallX  / BRICK_W);

      var bothTestsFailed = true;

      if (prevBrickCol != ballBrickCol) {
        if (isBrickAtColRow(prevBrickCol, prevBrickRow) == false) {
          ballSpeedX *= -1;
          bothTestsFailed = false;
        }
        // var adjBrickSide = rowColToArrayIndex(prevBrickCol, ballBrickRow);

        // if (brickGrid[adjBrickSide] == false) {
        //   ballSpeedX *= -1;
        //   bothTestsFailed = false;
        // }
      }
      if (prevBrickRow != ballBrickRow) {
        // var adjBrickTopBot = rowColToArrayIndex(ballBrickCol, prevBrickRow);
        // if (brickGrid[adjBrickTopBot] == false) {
        if (isBrickAtColRow(prevBrickCol, prevBrickRow) == false) {
          ballSpeedY *= -1;
          bothTestsFailed = false;
        }
      }

      if (bothTestsFailed) {  // armpit case, prevents ball from going right through, making it bouncing off
        ballSpeedX *= -1;
        ballSpeedY *= -1;
      }

    }  // end of brick found
  }  // end of valid col and row
}  // end of ballBrickHandling func

function ballPaddleHandling() {
  // collision detection on paddle
  var paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
  if (ballY > paddleTopEdgeY &&     // below top of paddle
      ballY < paddleBottomEdgeY &&  // above bottom of paddle
      ballX > paddleLeftEdgeX &&    // right of the left side of paddle 
      ballX < paddleRightEdgeX) {   // left of the right side of paddle
        
        ballSpeedY *= -1;
  
        var centerOfPaddleX =  paddleX + PADDLE_WIDTH / 2;
        var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistFromPaddleCenterX * 0.40;

        if (bricksLeft === 0) {
          brickReset();
        }  // out of bricks
   }  // ball center inside paddle
}  //end of ballPaddleHandling

function moveAll() {

  ballMove();

  ballBrickHandling();

  ballPaddleHandling();
}

function rowColToArrayIndex(col, row) {
  return col + BRICK_COLS * row;
}

function drawBricks() {
  for (var row = 0; row < BRICK_ROWS; row++) {
    for (var col = 0; col < BRICK_COLS; col++) {
      var arrayIndex = rowColToArrayIndex(col, row);
      if (brickGrid[arrayIndex]) {
      // if (brickGrid[col]) {
        colorRect(BRICK_W * col, BRICK_H * row, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, '#3dffb1');
      }
    }
  }

  // if (brickGrid[0]) {
  //     colorRect(BRICK_W*0+1,0, BRICK_W,BRICK_H, 'blue');
  // }
  // if (brickGrid[1]) {
  //   colorRect(BRICK_W*1+2,0, BRICK_W,BRICK_H, 'blue');
  // }
  // if (brickGrid[2]) {
  //   colorRect(BRICK_W*2+4,0, BRICK_W,BRICK_H, 'blue');
  // }
  // if (brickGrid[3]) {
  //   colorRect(BRICK_W*3+6,0, BRICK_W,BRICK_H, 'blue');
  // }
  // colorRect(BRICK_W*4+8,0, BRICK_W,BRICK_H, 'blue');
  // colorRect(BRICK_W*5+10,0, BRICK_W,BRICK_H, 'blue');
}

function drawAll() {
  colorRect(0,0, canvas.width, canvas.height, 'black'); 
  colorCircle(ballX, ballY, 10, '#fff'); 
  colorRect(paddleX, canvas.height - PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, '#3dffb1');

  drawBricks();

  // var mouseBrickCol = Math.floor(mouseX / BRICK_W);
  // var mouseBrickRow = Math.floor(mouseY / BRICK_H);
  // var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
  // colorText(`${mouseBrickCol}, ${mouseBrickRow} : ${brickIndexUnderMouse}`, mouseX, mouseY, 'blue');
  // // colorText(`${mouseX}, ${mouseY}`, mouseX, mouseY, 'yellow');

  // if (brickIndexUnderMouse >= 0 && brickIndexUnderMouse < BRICK_COLS * BRICK_ROWS) {
  //   brickGrid[brickIndexUnderMouse] = false;
  // }
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX,centerY, radius, 0,Math.PI*2, true);
  canvasContext.fill();
}

function colorText(displayWords, textX,textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(displayWords, textX,textY);
}