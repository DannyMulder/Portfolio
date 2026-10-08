const scrollbar = document.getElementById("scrollbar");
const scrollBoxes = document.querySelectorAll(".projects .box");
let boxWidth = scrollBoxes[0].getBoundingClientRect().width;
let spaceBetweenBox = window.innerWidth / 2;
let totalWidth = scrollBoxes.length * spaceBetweenBox;
let minX = -boxWidth;
let maxX = minX + totalWidth;
let scrollBoxesCords = [...scrollBoxes].map((_, i) => minX + i * spaceBetweenBox);
let timeOut = null;
let interval = null;
let dragging = false;
let hasDragged = false;
let oldMousePos = 0;
let fastestSpeed = 0;
let idleSpeed = 1;
let smoothOffset = spaceBetweenBox / 2;

scrollBoxes.forEach((box, i) => {
    box.onclick = () => new Audio("../Sounds/meow.mp3").play();
    box.addEventListener("click", () => {
        timeOut = ClearAllTimeOuts()
        interval = ClearInterval(interval);

        for (let i = 0; i < scrollBoxes.length; i++)
            MoveScrollBox(i, 1);

        interval = setInterval(() => {
            let distance = Math.round(scrollBoxesCords[i] + boxWidth / 2 - window.innerWidth / 2);
            if (distance < 1 && distance > -1 || hasDragged) {
                interval = ClearInterval(interval);
                hasDragged = false;
                return;
            }
            let speed = Math.sign(distance) * 5;
            for (let j = 0; j < scrollBoxes.length; j++) {
                MoveScrollBox(j, -speed);
                ScrollVisuals(10000);
            }
        });
    });
});

["mousedown", "touchstart"].forEach(listener => {
    scrollbar.addEventListener(listener, (e) => {
        timeOut = ClearTimeOut(timeOut);
        oldMousePos = GetX(e);
        fastestSpeed = 0;
        dragging = true;
    });
});

["mousemove", "touchmove"].forEach(listener => {
    document.addEventListener(listener, (e) => {
        if (!dragging) return;
        hasDragged = true;

        const speed = GetX(e) - oldMousePos;
        if (speed < 100 && speed > -100) fastestSpeed = speed;

        for (let i = 0; i < scrollBoxes.length; i++) {
            MoveScrollBox(i, speed);
            scrollBoxes[i].style.filter = "blur(0)";
            scrollBoxes[i].style.transform = "scale(1)";
        }

        oldMousePos = GetX(e);
    });
});

["mouseup", "touchend"].forEach(listener => {
    document.addEventListener(listener, () => {
        dragging = false;
    });
});

setInterval(() => {
    for (let i = 0; i < scrollBoxes.length; i++) {
        if (dragging || timeOut) return;
        else if (fastestSpeed < 1 && fastestSpeed > -1) MoveScrollBox(i, -idleSpeed);
        else MoveScrollBox(i, fastestSpeed);
    }
    if (!dragging && fastestSpeed < 1 && fastestSpeed > -1 && !timeOut) ScrollVisuals(5000);

    fastestSpeed *= 0.98;
}, 1000 / 60);

function IsOutOfBoundsScrollBox(currentX, minX, maxX) {
    if (currentX > maxX) return minX; else if (currentX < minX) return maxX;
    return currentX;
}

function DistanceOutOfBoundsScrollBox(currentX, minX, maxX) {
    if (currentX > maxX) return currentX - maxX;
    if (currentX < minX) return currentX - minX;
    return 0;
}

function MoveScrollBox(i, speed) {
    scrollBoxesCords[i] += speed;
    const amount = DistanceOutOfBoundsScrollBox(scrollBoxesCords[i], minX, maxX);
    scrollBoxesCords[i] = IsOutOfBoundsScrollBox(scrollBoxesCords[i], minX, maxX);
    scrollBoxesCords[i] += amount;
    scrollBoxes[i].style.left = `${scrollBoxesCords[i]}px`;
}

function ScrollVisuals(idleDuration) {
    for (let j = 0; j < scrollBoxes.length; j++) {
        const box = scrollBoxes[j];
        const centerBox = Math.round(scrollBoxesCords[j] + boxWidth / 2);
        const centerScreen = Math.round(window.innerWidth / 2);
        const distance = Math.abs(centerBox - centerScreen);

        if (distance <= smoothOffset) {
            idleSpeed = 0.5 + distance / smoothOffset * 0.5;
            box.style.transform = `scale(${1.25 - distance / smoothOffset * 0.25})`;

            if (centerBox === centerScreen) {
                timeOut = ClearTimeOut(timeOut);
                interval = ClearInterval(interval);
                timeOut = setTimeout(() => timeOut = ClearTimeOut(timeOut), idleDuration);
            }

            const copy = [...scrollBoxes];
            copy.splice(j, 1);
            for (let x = 0; x < copy.length; x++) copy[x].style.filter = `blur(${Math.round(2 - distance / smoothOffset * 2)}px)`;
            break;
        } else idleSpeed = 1;
    }
}

window.addEventListener("resize", () => {
    boxWidth = scrollBoxes[0].getBoundingClientRect().width;
    spaceBetweenBox = window.innerWidth / 2;
    totalWidth = scrollBoxes.length * spaceBetweenBox;
    minX = -boxWidth;
    maxX = minX + totalWidth;
    scrollBoxesCords = [...scrollBoxes].map((_, i) => minX + i * spaceBetweenBox);
    scrollBoxes.forEach(box => {
        box.style.transform = "scale(1)";
        box.style.filter = "blur(0)";
    })
});