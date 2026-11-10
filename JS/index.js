if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "true");
    document.body.classList.add("light");
} else localStorage.getItem("theme") === "true" ? document.body.classList.add("light") : document.body.classList.remove("light");

const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.style.animation = "SmoothShowUp 1s ease-in forwards";
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
    const added = document.body.classList.toggle("light");
    localStorage.setItem("theme", added.toString());
}

let mouseOnNavbar = false;
const navbar = document.getElementById("navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
const menu = document.getElementById("menu");
let menuOpen = false;

document.addEventListener("wheel", (e) => {
    if (mouseOnNavbar || menuOpen) return;

    if (e.deltaY > 0) {
        navbar.classList.add("hidden");
    } else if (e.deltaY < 0) {
        navbar.classList.remove("hidden");
    }
});

document.addEventListener("touchstart", (e) => {
    if (e.target.id === "color-mode-btn") return;

    if (GetY(e) > navbarHeight) navbar.classList.add("hidden");
    else navbar.classList.remove("hidden")
})

navbar.addEventListener("mouseenter", () => {
    mouseOnNavbar = true;
})

navbar.addEventListener("mouseleave", () => {
    mouseOnNavbar = false;
    if ("ontouchstart" in window) return;
    navbar.classList.add("hidden");
})

function Menu() {
    menuOpen = menu.classList.toggle("show");
}

function CloseMenu() {
    setTimeout(() => {
        menu.classList.remove("show");
        menuOpen = false;
    });
}