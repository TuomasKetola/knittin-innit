let width, height;
let pixels = [];
let coloredPixels = [];
let filledRectsCanvasTop = [];
let filledRectsCanvasBottom = [];
let filledRectsCanvas2 = [];
let filledRectsCanvas3 = [];
let mouseDownX = 1;
let mouseDownY = 1;
let drop = false;
let mouseDown = false;
let minY = 10000;
let minX = 10000;

let dropY = 1;
let dropX = 1;

function resizeCanvas(div, canvas){

  var bw = div.clientWidth;
  var bh = div.clientHeight;  
  canvas.width = bw;
  canvas.height = bh;
}

const div1 = document.getElementById('div1')
div1.canvasTop = document.createElement('canvas');
div1.canvasBottom = document.createElement('canvas');

const div2 = document.getElementById('div2')
div2.canvas2 = document.createElement('canvas');

const div3 = document.getElementById('div3')
div3.canvas3 = document.createElement('canvas');


resizeCanvas(div1, canvasTop)
resizeCanvas(div1, canvasBottom)
resizeCanvas(div2, canvas2)
resizeCanvas(div3, canvas3)

const ctxTop = canvasTop.getContext('2d');
const ctxBottom = canvasBottom.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
var bw = div1.clientWidth;
var bh = div1.clientHeight;
var p = 2;
var cw = 15;
var ch = bh + (p*2) + 1;

function drawBoard(gridWidth, gridHeight, cellWidth, ctx){
    for (var x = 0; x <= cellWidth * gridWidth; x += cellWidth) {
        ctx.moveTo(0.5 + x + p, p);
        ctx.lineTo(0.5 + x + p, 15 * gridWidth + p);
    } 

    for (var x = 0; x <= cellWidth * gridHeight; x += cellWidth) {
        ctx.moveTo(p, 0.5 + x + p);
        ctx.lineTo(15 * gridWidth + p, 0.5 + x + p);
    }

    ctx.strokeStyle = "black";
    ctx.stroke();
}

function clickDrawToCanvas(canvas, event, cw, ctx, filledRects) {
  
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const cy = (y - (y%cw)) + p;
  const cx = (x - (x%cw)) + p;
  let new_coords = [cy, cx].toString()
  const find = filledRects.includes(new_coords)
  ctx.beginPath();
  if (find){
    
    const ix = filledRects.indexOf(new_coords);
    ctx.fillStyle = "white";
    ctx.fillRect(cx, cy, cw, cw);  
    filledRects.splice(ix, 1)
  }
  else {
    ctx.fillStyle = "red";
    ctx.fillRect(cx, cy, cw, cw);
    filledRects.push(new_coords) 
  };
  if (cx < minX) {
    minX = cx
  }
  if (cy < minY) {
    minY = cy
  }
}

function drawFigToCanvas(canvas, event, cw, ctx, filledRects) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const mouseY = (y - (y%cw)) + p;
  const mouseX = (x - (x%cw)) + p;

  console.log(mouseX, mouseY)
  for (const x of filledRects) {
    coords = x.split(',');
    y_ = coords[0] - minY  + mouseY;
    x_ = coords[1] - minX;
    ctx.fillStyle = "green";
    ctx.fillRect(x_, y_, cw, cw);
  }
}

canvasTop.addEventListener('click', function(e) {
  clickDrawToCanvas(canvasBottom, e, cw, ctxBottom, filledRectsCanvasTop);
  clickDrawToCanvas(canvasTop, e, cw, ctxTop, filledRectsCanvasBottom);
})

canvasTop.addEventListener('dragend', function(e) {
  drawFigToCanvas(canvas3, e, cw, ctx3, filledRectsCanvasTop)
})

drawBoard(16, 16, cw, ctxBottom)
drawBoard(16, 16, cw, ctx2)
drawBoard(32, 32, cw, ctx3)