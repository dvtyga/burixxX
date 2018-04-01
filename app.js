var canvas, canvasContext;

window.onload = function() {
  canvas = this.document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond); 

}

function updateAll() {
  drawAll();
}


function drawAll() {
  colorRect(0,0, canvas.width, canvas.height, 'black'); 
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}