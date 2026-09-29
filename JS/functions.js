function ClosestToNumber(list, target) {
    return list.reduce((best, current, index) => {
        const currentDiff = Math.abs(current - target);
        if (currentDiff < best.diff) {
            return {value: current, index, diff: currentDiff};
        }
        return best;
    }, {value: null, index: -1, diff: Infinity});
}

function ClearTimeOut(id) {
    if (id !== null) {
        clearTimeout(id);
        const index = activeTimeouts.indexOf(id);
        if (index !== -1) activeTimeouts.splice(index, 1);
    }
    return null;
}

function ClearInterval(id) {
    if (id !== null) {
        clearInterval(id);
        const index = activeIntervals.indexOf(id);
        if (index !== -1) activeIntervals.splice(index, 1);
    }
    return null;
}

let activeTimeouts = [];
let activeIntervals = [];

const _setTimeout = window.setTimeout;
const _setInterval = window.setInterval;

window.setTimeout = function(fn, delay) {
    const id = _setTimeout(fn, delay);
    activeTimeouts.push(id);
    return id;
};

window.setInterval = function(fn, delay) {
    const id = _setInterval(fn, delay);
    activeIntervals.push(id);
    return id;
};

function ClearAllTimeOuts() {
    activeTimeouts.forEach(t => clearTimeout(t))
    activeTimeouts = []
    return null
}

function ClearAllIntervals() {
    activeIntervals.forEach(i => clearInterval(i))
    activeIntervals = []
    return null
}