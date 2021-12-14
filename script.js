let width, height;
let pixels = [];
let coloredPixels = [];
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
var cw = bw + (p*2) + 1;
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

drawBoard(16, 16, 15, ctx1)
drawBoard(16, 16, 15, ctx2)
drawBoard(32, 32, 15, ctx3)


// function resizeRenderer(){
//   // Get width & height of parentDiv
//   var bw = div1.clientWidth;
//   var bh = div1.clientHeight;
//   // webGLRenderer.setSize(width, height);
// }

// // Add window resize listener
// window.addEventListener('resize', resizeRenderer);
// drawBoard();
// // Force renderer resizing once
// resizeRenderer();

// const drawGrid = (ctx, div) => {
  
//   width = div.clientWidth;
//   height = div.clientHeight;  
//   ctx.clearRect(0, 0, width, height);
//     for (var i = 0, l = pixels.length; i < l; i++) {
//       pixels[i][4] = 0;
//     }
    
//     for (var i = 0, l = coloredPixels.length; i < l; i++) {
//       var pix = Math.floor(coloredPixels[i].y/10)*(Math.floor(width/10)+1) + Math.floor(coloredPixels[i].x/10);
//       if (pixels[pix]) {
//         pixels[pix][4] = coloredPixels[i].color;
//         pixels[pix][5] = coloredPixels[i].alpha;
//       }
      
//       if (coloredPixels[i].alpha > 0) coloredPixels[i].alpha -= 0.008;
//       if (coloredPixels[i].alpha < 0) coloredPixels[i].alpha = 0;
//       coloredPixels[i].x += coloredPixels[i].vx;
//       coloredPixels[i].y += coloredPixels[i].vy;
//     }
    
//     for (var i = 0, l = pixels.length; i < l; i++) {
//       ctx.globalAlpha = 1;
//       ctx.fillStyle = '#222';
//       ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
//       ctx.globalAlpha = pixels[i][5];
//       ctx.fillStyle = pixels[i][4];
//       ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3]);
//     }
//   }

// const resize = (canvas) => {
//     width = div1.clientWidth;
//     height = div1.clientHeight;
//     canvas.width = width;
//     canvas.height = height;
//     pixels = [];
//     for (var y = 0; y < height/10; y++) {
//       for (var x = 0; x < width/10; x++) {
//         pixels.push([x*10, y*10, 8, 8, '#222', 1]);
//       }
//     }
//   }


// const draw = (div) => {
//     // launchPixel();
//     // launchPixel();
//     drawGrid(ctx1, div);
//     // requestAnimationFrame(draw);
//   }

// resize(canvas1);
// // // initColoredPixels();
// draw(div1);