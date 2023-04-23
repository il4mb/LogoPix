var canvas = document.createElement("canvas");
const data = [];
var mouse = null;

window.addEventListener("DOMContentLoaded", () => {
    document.body.append(canvas);
});

canvas.addEventListener("mousemove", (event) => {
    mouse = {
        x: event.offsetX,
        y: event.offsetY,
        size: 35,
    }
});
canvas.addEventListener("mouseleave", (event) => {
    mouse = null;
});

const Bubbles = (id) => {

    /**
     * @var Canvas canvas
     */
    let canvas2 = document.getElementById(id.replace("#", ""));
    // canvas2.style.display = "none"

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

        doRender(canvas2);
    }

    img.src = "https://il4mb.github.io/asset/vector/ILB-nobg.svg";
}

function doRender(scanvas) {

    let time = 1;
    let size = 10;

    let sw = scanvas.width; //* 3;
    let sh = scanvas.height;// * 3;

    canvas.height = sh;
    canvas.width = sw;

    for (iy = 0; iy < sh / size; iy++) {

        let dy = iy * size;

        for (let ix = 0; ix < sw / size; ix++) {

            let dx = ix * size;

            var imgd = scanvas.getContext("2d").getImageData(dx, dy, size, size);
            let f = getColorFromData(imgd.data, "#000000");

            if (f) {
                data.push({ x: dx, y: dy, c: f, s: size / 2.2 })
            }
            drawSquare(scanvas.getContext("2d"), dx, dy, size, size);

        }
    }
    draw();
}

function draw() {

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach(item => {

        let y = item.y,
            x = item.x;

        if (item.move) {

            let speed = 1;

            let tx = Math.round(item.move.target.x),
                ty = Math.round(item.move.target.y),
                ox = Math.round(item.move.origin.x),
                oy = Math.round(item.move.origin.y);

            let xmath = ox > tx ? "-" : (ox < tx ? "+" : null);
            let ymath = oy > ty ? "-" : (oy < ty ? "+" : null);

            if (xmath == "-") {
                item.move.origin.x -= speed;
            } else if (xmath == "+") {
                item.move.origin.x += speed;
            }

            if (ymath == "-") {
                item.move.origin.y -= speed;
            } else if (ymath == "+") {
                item.move.origin.y += speed;
            }

            if (ox == tx && oy == ty) {

                if (mouse) {

                    const R = mouse.size;
                    const my = mouse.y;
                    const mx = mouse.x;

                    var dx = mx - x;
                    var dy = my - y;

                    var distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance - 50 > R) {
                        item.move.target.x = item.x;
                        item.move.target.y = item.y;
                    }

                } else {
                    item.move.target.x = item.x;
                    item.move.target.y = item.y;

                }
            }

            y = item.move.origin.y;
            x = item.move.origin.x;
        }


        let color = item.c;
        drawDot(canvas.getContext("2d"), item.s, x, y, color);

        if (mouse) {

            const R = mouse.size;
            const my = mouse.y;
            const mx = mouse.x;

            var dx = mx - x;
            var dy = my - y;
            let dix = x - mx;
            let diy = y - my;

            var distance = Math.sqrt(dx * dx + dy * dy);
            let strenght = R - distance;
            if (distance < R) {

                let tx = x + (dix * (strenght/2));
                let ty = y + (diy * (strenght/2));

                item.move = {

                    target: {
                        x: tx,
                        y: ty
                    },
                    origin: {
                        x: x,
                        y: y
                    }
                };

            }
        }
    })

    window.requestAnimationFrame(draw);
}

function drawDot(ctx, s = 0, x, y, fill = false) {

    ctx.beginPath();
    ctx.arc(x, y, s, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgb(0 0 0 /0.3)";
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

function getColorFromData(pixels, transparent = false,) {

    if (transparent) {
        transparent = hexTorgba(String(transparent));

        if (pixels[0] == transparent[0] && pixels[1] == transparent[1] && pixels[2] == transparent[2]) {
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

    if (transparent) {
        //transparent = hexTorgba(transparent);
        if (pixels[0] == transparent[0] && pixels[1] == transparent[1] && pixels[2] == transparent[2]) {
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


