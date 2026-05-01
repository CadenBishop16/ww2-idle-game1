// Initial State
let state = {
    sp: 0,
    spRate: 1,
    liberation: 0,
    costs: { bonds: 10, infantry: 50, tanks: 250 },
    counts: { infantry: 0, tanks: 0 }
};

// Load Saved Data
const saved = localStorage.getItem('ww2_idle_save');
if (saved) state = JSON.parse(saved);

const questions = [
    { q: "What year did the US enter WW2?", a: ["1939", "1940", "1941", "1942"], c: 2 },
    { q: "Who was the US President during most of WW2?", a: ["Truman", "Eisenhower", "FDR", "Hoover"], c: 2 },
    { q: "What was the name of the B-29 that dropped the first atomic bomb?", a: ["Enola Gay", "Bockscar", "Memphis Belle", "Swoose"], c: 0 }
];

function updateUI() {
    document.getElementById("sp-display").textContent = Math.floor(state.sp);
    document.getElementById("sp-rate").textContent = `+${state.spRate} SP/sec`;
    document.getElementById("cost-bonds").textContent = state.costs.bonds;
    document.getElementById("cost-infantry").textContent = state.costs.infantry;
    document.getElementById("cost-tanks").textContent = state.costs.tanks;
    document.getElementById("progress-fill").style.width = Math.min(state.liberation, 100) + "%";
    localStorage.setItem('ww2_idle_save', JSON.stringify(state));
    if (state.liberation >= 100) document.querySelector(".label").textContent = "VICTORY ACHIEVED";
}

// Spawning Units
function spawnUnit(type) {
    const unit = document.createElement("div");
    unit.style.position = "absolute";
    unit.style.left = (Math.random() * 90) + "%";
    unit.style.top = (Math.random() * 90) + "%";
    unit.style.width = type === 'tank' ? "18px" : "8px";
    unit.style.height = type === 'tank' ? "18px" : "8px";
    unit.style.backgroundColor = type === 'tank' ? "#76ff03" : "#fff";
    unit.style.boxShadow = "0 0 8px " + (type === 'tank' ? "#76ff03" : "#fff");
    document.getElementById("unit-visuals").appendChild(unit);
}

// Tick Engine
setInterval(() => {
    state.sp += state.spRate;
    updateUI();
}, 1000);

// Random Events
setInterval(() => {
    if (Math.random() > 0.8) {
        const events = [
            { text: "LEND-LEASE ACT: +50 SP", effect: () => state.sp += 50 },
            { text: "SUPPLY LINES STRETCHED: -10 SP", effect: () => state.sp = Math.max(0, state.sp - 10) }
        ];
        const e = events[Math.floor(Math.random() * events.length)];
        const toast = document.getElementById("event-toast");
        toast.textContent = e.text;
        toast.classList.remove("hidden");
        e.effect();
        setTimeout(() => toast.classList.add("hidden"), 3000);
        const log = document.getElementById("log-window");
        log.innerHTML += `<p>> ${e.text}</p>`;
        log.scrollTop = log.scrollHeight;
    }
}, 10000);

// Buttons
document.getElementById("upgrade-bonds").onclick = () => {
    if (state.sp >= state.costs.bonds) {
        state.sp -= state.costs.bonds;
        state.spRate += 1;
        state.costs.bonds = Math.floor(state.costs.bonds * 1.5);
        updateUI();
    }
};

document.getElementById("upgrade-infantry").onclick = () => {
    if (state.sp >= state.costs.infantry) {
        state.sp -= state.costs.infantry;
        state.spRate += 5;
        state.liberation += 2;
        state.costs.infantry = Math.floor(state.costs.infantry * 1.6);
        spawnUnit('infantry');
        updateUI();
    }
};

document.getElementById("upgrade-tanks").onclick = () => {
    if (state.sp >= state.costs.tanks) {
        state.sp -= state.costs.tanks;
        state.spRate += 20;
        state.liberation += 8;
        state.costs.tanks = Math.floor(state.costs.tanks * 1.8);
        spawnUnit('tank');
        updateUI();
    }
};

document.getElementById("question-btn").onclick = () => {
    const q = questions[Math.floor(Math.random() * questions.length)];
    const text = document.getElementById("question-text");
    const container = document.getElementById("answers-container");
    text.textContent = q.q;
    container.innerHTML = "";
    q.a.forEach((ans, i) => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.className = "answer-btn";
        btn.onclick = () => {
            if (i === q.c) { alert("STRATEGIC SUCCESS: +100 SP"); state.sp += 100; }
            else { alert("INTEL ERROR"); }
            text.textContent = "Awaiting orders...";
            container.innerHTML = "";
            updateUI();
        };
        container.appendChild(btn);
    });
};

document.getElementById("reset-btn").onclick = () => {
    localStorage.clear();
    location.reload();
};

updateUI();