/**
 * Copyright 2023 Ilham B
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";
function LogoPix(src) {


    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const data = [];

    let strokeColor = "rgb(0 0 0 /0.5)",
        alpha = false,
        HOLDER = null,
        mouse = null;


    (() => loadImg())();


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


    /*
     * LIST FUNCTION BELOW 
     */
    function loadImg() {
        "use strict";

        let canvas2 = document.createElement("canvas");
        let ctx = canvas2.getContext("2d");


        let img = new Image();
        img.crossOrigin = "anonymous"

        img.onload = () => {

            canvas2.height = img.naturalHeight;
            canvas2.width = img.naturalWidth;
            ctx.drawImage(img, 0, 0);

            getCanvasPixelData(canvas2);
        }
        img.src = src;
    }


    /**
     * @param {CanvasState} scanvas - source canvas
     */
    function getCanvasPixelData(scanvas) {
        let time = 1;
        let size = 10;

        let sw = scanvas.width; //* 3;
        let sh = scanvas.height;// * 3;

        canvas.height = sh;
        canvas.width = sw;

        // VERTICAL READER
        for (let iy = 0; iy < sh / size; iy++) {
            let dy = iy * size;

            // HORIZON READER
            for (let ix = 0; ix < sw / size; ix++) {
                let dx = ix * size;

                var imgd = scanvas.getContext("2d").getImageData(dx, dy, size, size);
                let color = getColorFromPixels(imgd.data, alpha);

                if (color) {
                    data.push({ x: dx, y: dy, c: color, s: size / 2.2 })
                }
            }
        }
    }


    /**
     * 
     * @param {ArrayBuffer} pixels pixel image data
     * @param {false|String} transparent false is not transparanble or add color that will be removed from output
     * @returns {false|String} hexadecimal color
     */
    function getColorFromPixels(pixels, transparent = false,) {

        if (transparent) {
            // CHECK COLOR IS ALPHA
            transparent = hexTorgba(String(transparent));
            if (pixels[0] == transparent[0] // RED
                && pixels[1] == transparent[1] // GREEN
                && pixels[2] == transparent[2]) // BLUE
            {
                return false;
            }
        }

        let grouped = [];

        // GROUP PIXELS EACH 4 
        for (let x = 0; x < pixels.length;) {

            let r = pixels[x], // IS RED
                g = pixels[x + 1], // IS GREEN
                b = pixels[x + 2], // IS BLUE
                a = pixels[x + 3]; // IS ALPHA

            // CONVERT TO HEX
            let hex = rgbaToHex(r, g, b, a);
            // FIND KEY BY VALUE
            let key = Object.keys(grouped).find(key => grouped[key].val == hex);
            if (key) {
                grouped[key].size++; // INCREASE SIZE
            } else {
                grouped.push({ val: hex, size: 1 }); // ADD NEW 
            }

            x = x + 4; // ADD 4
        }

        // DESC SORT BY SIZE 
        grouped.sort((a, b) => b.size - a.size);

        let hex = grouped[0].val;
        pixels = hexTorgba(hex);

        if (transparent) {
            // CHECK 2nd COLOR IS ALPHA
            if (pixels[0] == transparent[0] // RED
                && pixels[1] == transparent[1] // GREEN
                && pixels[2] == transparent[2]) // BLUE
            {
                return false;
            }
        }
        return grouped[0].val;
    }


    /**
     * 
     * @param {Number} r decimal color red
     * @param {Number} g decimal color green
     * @param {Number} b decimal color blue
     * @param {Number} a decimal color alpha
     * @returns {String} hexadecimal color
     */
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


    /**
     * 
     * @param {String} hex is hexadecimal color hash
     * @returns {Array<Number>} rgba color
     */
    function hexTorgba(hex) {

        let chrs = hex.match(/\w{1,2}/g);

        let val = [];
        chrs.forEach(el => {
            val.push(parseInt(el, 16));
        });
        return val;
    }

    function drawDot(ctx, s = 0, x, y, fill = false) {

        ctx.beginPath();
        ctx.arc(x, y, s, 0, 2 * Math.PI);
        ctx.strokeStyle = strokeColor;
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

    function draw() {

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

            // DRAW DOT
            drawDot(canvas.getContext("2d"), item.s, x, y, item.c);

            // GET MOUSE DATA
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

                    let tx = x + (dix * (strenght / 2));
                    let ty = y + (diy * (strenght / 2));

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
    /*
     * END LIST FUNCTION 
     */



    function Builder() { };
    Builder.prototype.setAlpha = function (color) {
        alpha = color;
        return this;
    }
    Builder.prototype.setWidth = function (w) {
     //  console.log(w)
        canvas.width = w;
        return this;
    }
    Builder.prototype.setHeight = function (h) {
        canvas.height = h;
        return this;
    }
    Builder.prototype.setStrokeColor = function (color) {
        strokeColor = color;
        return this;
    }

    return {
        builder: () => {
            return new Builder();
        },
        draw: (holder) => {

            if (typeof holder == "string") {
                HOLDER = document.getElementById(holder.replace("#", ""))
            }
            if (typeof holder == "object") {
                HOLDER = holder;
            }

            HOLDER.append(canvas);
            draw();
        }
    }
}