function GetDivs(ids) {
    const divs = [];
    for (const id of ids) {
        divs.push(document.getElementById(id));
    }
    return divs;
}

function Wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function ShowSlowLetters(msPerLetter, msPerDiv, divs) {
    const wordsPerDiv = divs.map(div => div.innerText);
    divs.forEach(div => div.innerText = "");

    for (let i = 0; i < divs.length; i++) {
        const div = divs[i];
        const text = wordsPerDiv[i];
        const fragment = document.createDocumentFragment();

        for (let j = 0; j < text.length; j++) {
            const span = document.createElement("span");
            span.innerText = text[j];
            span.style.animation = `SmoothShowUp 0.5s ease-in-out ${j * msPerLetter}ms forwards`;
            fragment.appendChild(span);
        }

        div.appendChild(fragment);
        await Wait(msPerDiv + text.length * msPerLetter);
    }
}


async function ShowSlowText(msPerDiv, divs, allAtOnce) {
    if (allAtOnce) {
        for (const div of divs) {
            div.style.animation = "SmoothShowUp 2s ease-in forwards";
        }
    }
}

ShowSlowLetters(50, 1000, GetDivs(["home-text-1", "home-text-2"])).then(_ => ShowSlowText(0, GetDivs(["home-text-3"]), true));

const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.style.animation = "SmoothShowUp 2s ease-in forwards";
            observer.unobserve(entry.target);
        }
    }
}, {
    threshold: 0.2
});

document.querySelectorAll(".observe").forEach(div => {
    observer.observe(div);
});

function ToggleColors() {
    document.body.classList.toggle("light");
}