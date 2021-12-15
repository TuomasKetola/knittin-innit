let width, height;
let pixels = [];
let coloredPixels = [];
let filledRectsCanvas1 = [];
let filledRectsCanvas2 = [];
let filledRectsCanvas3 = [];
let mouseDownX = 1;
let mouseDownY = 1;
let drag = false;
let mouseDown = false;

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

const ctx1 = canvas1.getContext('2d');
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

  // console.log(drag)
  if (find){
    
    const ix = filledRects.indexOf(new_coords);
    ctx.fillStyle = "white";
    ctx.fillRect(cx, cy, cw, cw);  
    ctx.strokeRect(cx, cy, cw, cw);
    filledRects.splice(ix, 1)
  }
  else {
    ctx.fillStyle = "red";
    ctx.fillRect(cx, cy, cw, cw);
    filledRects.push(new_coords) 
  };
  // console.log(cy,cx)
  }

function createTempCanvas(canvas) {
  div1.canvas1Temp = document.createElement('canvas');

  // const div = document.createElement('canvas');
  resizeCanvas(div1, canvas1Temp)
  const rect = canvas.getBoundingClientRect();
  const tempCtx = canvas1Temp.getContext('2d');
  for (const x of filledRectsCanvas1) {
    coords = x.split(',');
    y_ = coords[0];
    x_ = coords[1];
    tempCtx.fillStyle = "green";
    tempCtx.fillRect(x_, y_, cw+10, cw+10);
    console.log(y_,x_)
  }
}

function dragOnCanvas1(canvas, event, ctx) {
  const rect = canvas1.getBoundingClientRect();
  const curr_x = event.clientX - rect.left;
  const curr_y = event.clientY - rect.top;
  console.log('moving', curr_x, curr_y, mouseDownX, mouseDownY)
}


// canvas1.addEventListener('mousedown', () => drag = false, mouseDown = true, console.log("wtf"))
canvas1.addEventListener('mousedown', function(e) {
  drag = false;
  mouseDown = true;
  const rect = canvas1.getBoundingClientRect();
  mouseDownX = e.clientX - rect.left;
  mouseDownY = e.clientY - rect.top;
  createTempCanvas(canvas1)
  // console.log('wtf')
})
// canvas1.addEventListener('mousemove', () => drag = true)
canvas1.addEventListener('mousemove', function(e) {
  drag = true
  console.log(mouseDown)
  if (mouseDown){
    dragOnCanvas1(canvas1, e, ctx3)
  }

})
canvas1.addEventListener('mouseup', function(e){
  if (!drag) {
    clickDrawToCanvas(canvas1, e, cw, ctx1, filledRectsCanvas1)
  }
  mouseDown = false
})


// canvas3.addEventListener('mousedown', () => drag = false, mouseDown = true)
// canvas3.addEventListener('mousemove', function(e) {
//   drag = true
//   if (mouseDown){
//     // console.log(mouseDown)
//     dragOnCanvas1(canvas3, e, ctx3)
//   }

// })
// canvas3.addEventListener('mouseup', function(e){
//   if (!drag) {
//     clickDrawToCanvas(canvas3, e, cw, ctx3, filledRectsCanvas3)
//   }
//   mouseDown = false
// })

drawBoard(16, 16, cw, ctx1)
drawBoard(16, 16, cw, ctx2)
drawBoard(32, 32, cw, ctx3)

// console.log(drag)