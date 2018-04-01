var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const BRICK_W = 100;
const BRICK_H = 50;
const BRICK_COUNT = 4;

var brick1 = true;
var brick2 = false;
var brick3 = true;
var brick4 = true;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 20;
const PADDLE_DISTANCE_FROM_EDGE = 60;
var paddleX = 400;

var canvas, canvasContext;

var mouseX, mouseY;

window.onload = function() {
  canvas = this.document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond); 

  canvas.addEventListener('mousemove', updateMousePosition);
}

function updateMousePosition(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = event.clientX - rect.left - root.scrollLeft;
  mouseY = event.clientY - rect.top - root.scrollTop;

  paddleX = mouseX - PADDLE_WIDTH/2;  // subtract half of paddle's width to center mouse pointer 
  // paddleX = mouseX;
}

function updateAll() {
  drawAll();
  moveAll();
}

function ballReset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function moveAll() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {  // left
    ballSpeedX *= -1; 
  }
  if (ballX > canvas.width) {  // right
    ballSpeedX *= -1; 
  }

  if (ballY < 0) { // top
    ballSpeedY *= -1; 
  }
  if (ballY > canvas.height) { // bottom
    ballReset();
    ballSpeedY *= -1; 
  }

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
        ballSpeedX = ballDistFromPaddleCenterX * 0.35;
      }
}

function drawBricks() {
  if (brick1) {
    colorRect(0,0, BRICK_W,BRICK_H, 'blue');
  }
  if (brick2) {
    colorRect(BRICK_W+2,0, BRICK_W,BRICK_H, 'blue');
  }
  if (brick3) {
    colorRect(BRICK_W*2+4,0, BRICK_W,BRICK_H, 'blue');
  }
  if (brick4) {
    colorRect(BRICK_W*3+6,0, BRICK_W,BRICK_H, 'blue');
  }
  // colorRect(BRICK_W*4+8,0, BRICK_W,BRICK_H, 'blue');
  // colorRect(BRICK_W*5+10,0, BRICK_W,BRICK_H, 'blue');
}

function drawAll() {
  colorRect(0,0, canvas.width, canvas.height, 'black'); 
  colorCircle(ballX, ballY, 10, '#e7e7e7'); 
  colorRect(paddleX,canvas.height-PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, '#e7e7e7');
  drawBricks();
  colorText(`${mouseX}, ${mouseY}`, mouseX, mouseY, 'yellow');
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