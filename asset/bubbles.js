var canvas = document.createElement("canvas");
const data = [];
window.addEventListener("DOMContentLoaded", () => {
    // canvas.style.background = "#ff88";
    document.body.append(canvas);
});

canvas.addEventListener("mousemove", (event) => {
    draw()
    drawDot(canvas.getContext("2d"), 75, event.offsetX, event.offsetY, "#ff44");

});
canvas.addEventListener("mouseleave", (event) => {
    draw()
   // drawDot(canvas.getContext("2d"), 75, event.offsetX, event.offsetY, "#ff44");

});

const Bubbles = (id) => {

    /**
     * @var Canvas canvas
     */
    let canvas2 = document.getElementById(id.replace("#", ""));

    canvas2.style.background = "#ff8";

    /**
     * @var Context ctx
     */
    var ctx = canvas2.getContext("2d");


    let img = new Image();
    img.crossOrigin = "anonymous"

    img.onload = () => {

        canvas2.height = img.naturalHeight;
        canvas2.width = img.naturalWidth;
        ctx.drawImage(img, 0, 0);

        doRenderCopy(canvas2);
    }

    img.src = "https://il4mb.github.io/asset/vector/ILB-nobg.svg";
    // img.src = "https://picsum.photos/200/300";
}

function doRenderCopy(scanvas) {

    let time = 1;
    let size = 10;

    let sw = scanvas.width //* 3;
    let sh = scanvas.height// * 3;

    canvas.height = sh;
    canvas.width = sw;

    for (iy = 0; iy < sh / size; iy++) {

        let dy = iy * size;


        for (let ix = 0; ix < sw / size; ix++) {

            let dx = ix * size;

            var imgd = scanvas.getContext("2d").getImageData(dx, dy, size, size);

            let f = getColorFromData(imgd.data, true);

            if (f) {
                data.push({ x: dx, y: dy, c: f })
            }
           // drawSquare(scanvas.getContext("2d"), dx, dy, size, size);
        }
    }
    draw();
}

function draw() {

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach(item => {

        drawDot(canvas.getContext("2d"), 5, item.x, item.y, item.c);
    })
    // window.requestAnimationFrame(draw);
}

let last = { x: 0, y: 0 }
function drawDot(ctx, s = 5, x, y, fill = false) {

    ctx.beginPath();
    ctx.arc(x, y, s, 0, 2 * Math.PI);
    ctx.stroke();

    if (fill || fill == "null") {
        ctx.fillStyle = fill;
        ctx.fill();
    }



    ctx.closePath();
}

function drawSquare(ctx, x = 0, y = 0, w = 100, h = 100, fill = null) {



    ctx.beginPath();
    ctx.rect(x, y, w, h);
    if (fill || fill == "null") {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    ctx.stroke();
    ctx.closePath();

}

function getColorFromData(pixels, isTransparent = false) {

    if (isTransparent) {
        if (pixels[0] == 0 && pixels[1] == 0 && pixels[2] == 0) {
            return false;
        }
    }

    let grouped = [];
    for (let x = 0; x < pixels.length;) {

        let r = pixels[x],
            g = pixels[x + 1],
            b = pixels[x + 2],
            a = pixels[x + 3];

        let hex = rgbaToHex(r, g, b, a);

        let key = Object.keys(grouped).find(key => grouped[key].val == hex);
        if (key) {
            grouped[key].size++;
        } else {
            grouped.push({ val: hex, size: 1 });
        }

        x = x + 4;
    }

    grouped.sort((a, b) => b.size - a.size)

    let hex = grouped[0].val;
    pixels = hexTorgba(hex);

    if (isTransparent) {
        if (pixels[0] == 0 && pixels[1] == 0 && pixels[2] == 0) {
            return false;
        }
    }


    return grouped[0].val;
}


function rgbaToHex(r, g, b, a) {

    let red = Number(r).toString(16);
    let green = Number(g).toString(16);
    let blue = Number(b).toString(16);
    let alpha = Number(a).toString(16);

    red = red.length < 2 ? "0" + red : red;
    green = green.length < 2 ? "0" + green : green;
    blue = blue.length < 2 ? "0" + blue : blue;
    alpha = alpha.length < 2 ? "0" + alpha : alpha;

    return "#" + red + green + blue + alpha;
}
function hexTorgba(hex) {

    let chrs = hex.match(/\w{1,2}/g);

    let val = [];
    chrs.forEach(el => {
        val.push(parseInt(el, 16));
    });
    return val;
}


