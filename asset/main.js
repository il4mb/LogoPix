var img = "https://il4mb.github.io/asset/vector/ILB-nobg.svg",
    width = 100,
    height = 100,
    alpha = "#000000",
    stroke = "#ff0000",
    logopix = null;

function update_logopix() {

    let holder = document.getElementById("canvas");
    holder.innerHTML = null;

    logopix = LogoPix(img);
    logopix.builder()
        .setAlpha(alpha)
        .setWidth(width)
        .setHeight(height)
        .setStrokeColor(stroke)

    logopix.draw(holder);
}


var fileInput, widthInput, heightInput, alphaInput, strokeInput;
var timmer = null;
window.onload = () => {

    update_logopix();

    fileInput = document.getElementById("file")
    widthInput = document.getElementById("width")
    heightInput = document.getElementById("height")
    alphaInput = document.getElementById("alpha-color")
    strokeInput = document.getElementById("stroke-color")

    fileInput.oninput = () => {
        if (timmer) clearTimeout(timmer)
        timmer = setTimeout(() => {
            let file = fileInput.files[0];
            let image = new Image();
            image.onload = () => {
                img = image.src;
                update_logopix();
            }
            image.src = URL.createObjectURL(file);
        }, 600);
    }

    widthInput.oninput = () => {
        if (timmer) clearTimeout(timmer)
        timmer = setTimeout(() => {
            if (widthInput.value > 0) {
                width = Number(widthInput.value);
                update_logopix();

            }
        }, 600);
    }

    heightInput.oninput = () => {
        if (timmer) clearTimeout(timmer)
        timmer = setTimeout(() => {
            if (heightInput.value > 0) {
                height = Number(heightInput.value);
                update_logopix();

            }
        }, 600);

    }

    alphaInput.oninput = () => {
        if (timmer) clearTimeout(timmer)
        timmer = setTimeout(() => {
            alpha = alphaInput.value;
            update_logopix();
        }, 600);

    }

    strokeInput.oninput = () => {

        if (timmer) clearTimeout(timmer)
        timmer = setTimeout(() => {
            stroke = strokeInput.value;
            update_logopix();
        }, 600);
    }
}