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

// Expanded Question Pool (20 Total)
const questions = [
    { q: "What year did the US enter WW2?", a: ["1939", "1940", "1941", "1942"], c: 2 },
    { q: "Who was the US President during most of WW2?", a: ["Truman", "Eisenhower", "FDR", "Hoover"], c: 2 },
    { q: "What was the name of the B-29 that dropped the first atomic bomb?", a: ["Enola Gay", "Bockscar", "Memphis Belle", "Swoose"], c: 0 },
    { q: "Which battle was the turning point in the Pacific?", a: ["Coral Sea", "Midway", "Iwo Jima", "Guadalcanal"], c: 1 },
    { q: "What was the code name for the D-Day invasion?", a: ["Operation Torch", "Operation Barbarossa", "Operation Overlord", "Operation Sea Lion"], c: 2 },
    { q: "Which desert fox led the German forces in North Africa?", a: ["Himmler", "Rommel", "Goebbels", "Hess"], c: 1 },
    { q: "What were the 'Tuskegee Airmen' famous for?", a: ["Tank warfare", "Espionage", "First African-American aviators", "Naval blockade"], c: 2 },
    { q: "Which country was the first to reach Berlin in 1945?", a: ["USA", "Great Britain", "Soviet Union", "France"], c: 2 },
    { q: "What was the last major German offensive in the West?", a: ["Battle of Britain", "Battle of the Bulge", "Battle of Kursk", "Battle of Anzio"], c: 1 },
    { q: "What secret project created the Atomic Bomb?", a: ["The Apollo Project", "The Manhattan Project", "The Tesla Project", "The Mercury Project"], c: 1 },
    { q: "Who was the Supreme Allied Commander in Europe?", a: ["George Patton", "Douglas MacArthur", "Dwight Eisenhower", "Omar Bradley"], c: 2 },
    { q: "Which ship was sunk at Pearl Harbor and remains a memorial today?", a: ["USS Missouri", "USS Arizona", "USS Enterprise", "USS Yorktown"], c: 1 },
    { q: "What does the 'V' in VE-Day stand for?", a: ["Valiance", "Victory", "Valor", "Vengeance"], c: 1 },
    { q: "What island saw the famous flag-raising photo by Marines?", a: ["Okinawa", "Iwo Jima", "Wake Island", "Saipan"], c: 1 },
    { q: "Which leader was known as 'The British Bulldog'?", a: ["Clement Attlee", "Neville Chamberlain", "Winston Churchill", "King George VI"], c: 2 },
    { q: "What was the primary US fighter plane in the early Pacific war?", a: ["P-51 Mustang", "P-40 Warhawk", "F4F Wildcat", "P-47 Thunderbolt"], c: 2 },
    { q: "The 'Enigma' machine was used for what purpose?", a: ["Radar detection", "Code encryption", "Jet propulsion", "Nuclear fission"], c: 1 },
    { q: "Which general famously said 'I shall return' to the Philippines?", a: ["Patton", "Montgomery", "MacArthur", "Bradley"], c: 2 },
    { q: "What was the name of the German Air Force?", a: ["Wehrmacht", "Luftwaffe", "Kriegsmarine", "Panzerwaffe"], c: 1 },
    { q: "The Higgins Boat was vital for which type of operation?", a: ["Aerial bombing", "Amphibious landings", "Tank battles", "Submarine hunting"], c: 1 }
];

// Shuffle Logic
let questionIndex = 0;
let shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);

function getNextQuestion() {
    if (questionIndex >= shuffledQuestions.length) {
        shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
        questionIndex = 0;
    }
    return shuffledQuestions[questionIndex++];
}

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

setInterval(() => {
    state.sp += state.spRate;
    updateUI();
}, 1000);

setInterval(() => {
    if (Math.random() > 0.8) {
        const events = [
            { text: "LEND-LEASE ACT: +50 SP", effect: () => state.sp += 50 },
            { text: "SUPPLY LINES STRETCHED: -10 SP", effect: () => state.sp = Math.max(0, state.sp - 10) },
            { text: "RATION CARDS ISSUED: +20 SP", effect: () => state.sp += 20 }
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
    const q = getNextQuestion();
    const text = document.getElementById("question-text");
    const container = document.getElementById("answers-container");
    text.textContent = q.q;
    container.innerHTML = "";
    q.a.forEach((ans, i) => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.className = "answer-btn";
        btn.onclick = () => {
            if (i === q.c) { 
                alert("STRATEGIC SUCCESS: +100 SP"); 
                state.sp += 100; 
                const log = document.getElementById("log-window");
                log.innerHTML += `<p>> Correct Intel: +100 SP</p>`;
            }
            else { alert("INTEL ERROR"); }
            text.textContent = "Awaiting orders...";
            container.innerHTML = "";
            updateUI();
        };
        container.appendChild(btn);
    });
};

document.getElementById("reset-btn").onclick = () => {
    if(confirm("Confirm: Wipe all data and restart mobilization?")) {
        localStorage.clear();
        location.reload();
    }
};

updateUI();