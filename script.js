let width, height;
let pixels = [];
let coloredPixels = [];
let filled_rects = [];
// var webGLRenderer = new THREE.WebGLRenderer();

// const canvas1 = document.getElementById('canvas1');
// const ctx1 = canvas1.getContext('2d');

function resizeCanvas(div, canvas){

  
  var bw = div.clientWidth;
  var bh = div.clientHeight;
  
  canvas.width = bw;
  canvas.height = bh;
}
const div1 = document.getElementById('div1')
div1.canvas1 = document.createElement('canvas');

const div2 = document.getElementById('div2')
div2.canvas2 = document.createElement('canvas');

const div3 = document.getElementById('div3')
div3.canvas3 = document.createElement('canvas');

resizeCanvas(div1, canvas1)
resizeCanvas(div2, canvas2)
resizeCanvas(div3, canvas3)

// const canvas2 = document.getElementById('canvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
var bw = div1.clientWidth;
var bh = div1.clientHeight;
var p = 2;
// var cw = bw + (p*2) + 1;
var cw = 15;
var ch = bh + (p*2) + 1;

var cellwidth = 15;

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

function clickDrawToCanvas(canvas, event, cw) {
  
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const cy = (y - (y%cw)) + p;
  const cx = (x - (x%cw)) + p;
  let new_coords = [cy, cx].toString()
  const find = filled_rects.includes(new_coords)
  ctx1.beginPath();
  if (find){
    
    const ix = filled_rects.indexOf(new_coords);
    ctx1.fillStyle = "white";
    ctx1.fillRect(cx, cy, cw, cw);  
    ctx1.strokeRect(cx, cy, cw, cw);
    filled_rects.splice(ix, 1)
  }
  else {
    ctx1.fillStyle = "red";
    ctx1.fillRect(cx, cy, cw, cw);
    filled_rects.push(new_coords)  
  };
  // console.log(filled_rects);
  // console.log(new_coords);
  }

canvas1.addEventListener('click', function(e) {
  clickDrawToCanvas(canvas1, e, cw)
})
drawBoard(16, 16, cellwidth, ctx1)
drawBoard(16, 16, cellwidth, ctx2)
drawBoard(32, 32, cellwidth, ctx3)