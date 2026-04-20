// ==========================================
// 1. LOGICA DISPLAY LCD
// ==========================================
const lcdScreen = document.getElementById('lcd-screen');
const ledScreen = document.getElementById('led-screen');
let displayTimeout;

function updateDisplay(line1, line2 = "", ledNumber = null) {
    if(ledNumber !== null) ledScreen.innerText = ledNumber;
    lcdScreen.innerHTML = `<div class="lcd-line">${line1}</div><div class="lcd-line">${line2}</div>`;
    
    clearTimeout(displayTimeout);
    displayTimeout = setTimeout(() => {
        lcdScreen.innerHTML = `<div class="lcd-line">1. BRASS 1</div><div class="lcd-line">READY...</div>`;
        ledScreen.innerText = "1";
    }, 2000);
}

// Gli slider interagiscono con il display
document.getElementById('vol-slider').addEventListener('input', (e) => {
    updateDisplay(`VOLUME SETTING`, `VALUE: ${e.target.value.padStart(2, '0')}`);
});
document.getElementById('data-slider').addEventListener('input', (e) => {
    updateDisplay(`DATA ENTRY`, `VALUE: ${e.target.value.padStart(2, '0')}`);
});

// ==========================================
// 2. GENERAZIONE GRIGLIA 32 TASTI
// ==========================================
const container32 = document.getElementById('buttons-32-container');

const gridDataRow1 = [
    { id: 1, span: 6, group: "OPERATOR ON-OFF/EG COPY", top: "1", bot: "MASTER TUNE" },
    { id: 2, top: "2", bot: "POLY/MONO" },
    { id: 3, top: "3", bot: "PITCH BEND" },
    { id: 4, top: "4", bot: "STEP" },
    { id: 5, top: "5", bot: "PORTAMENTO" },
    { id: 6, top: "6", bot: "GLISSANDO" },
    { id: 7, span: 1, group: "ALGORITHM", top: "", bot: "TIME" },
    { id: 8, span: 1, group: "FEEDBACK", top: "", bot: "" },
    { id: 9, span: 6, group: "LFO", top: "WAVE", bot: "EDIT RECALL" },
    { id: 10, top: "SPEED", bot: "VOICE INIT" },
    { id: 11, top: "DELAY", bot: "" },
    { id: 12, top: "PMD", bot: "" },
    { id: 13, top: "AMD", bot: "" },
    { id: 14, top: "SYNC", bot: "BATT. CHECK" },
    { id: 15, span: 2, group: "MOD SENSITIVITY", top: "PITCH", bot: "SAVE" },
    { id: 16, top: "AMPLITUDE", bot: "LOAD" } 
];

const gridDataRow2 = [
    { id: 17, span: 4, group: "OSCILLATOR", top: "MODE/SYNC", bot: "RANGE" },
    { id: 18, top: "FREQ. COARSE", bot: "PITCH" },
    { id: 19, top: "FREQ. FINE", bot: "AMPLITUDE" },
    { id: 20, top: "DETUNE", bot: "EG BIAS" },
    { id: 21, span: 2, group: "EG", top: "RATE", bot: "FOOT" },
    { id: 22, top: "LEVEL", bot: "PITCH" },
    { id: 23, span: 3, group: "KEY LEVEL SCALING", top: "BREAK POINT", bot: "AMPLITUDE" },
    { id: 24, top: "CURVE", bot: "EG BIAS" },
    { id: 25, top: "DEPTH", bot: "BREATH" }, 
    { id: 26, span: 1, group: "KEY RATE", top: "SCALING", bot: "PITCH" },
    { id: 27, span: 2, group: "OPERATOR", top: "OUTPUT LEVEL", bot: "AMPLITUDE" },
    { id: 28, top: "KEY VELOCITY", bot: "EG BIAS" },
    { id: 29, span: 2, group: "PITCH EG", top: "RATE", bot: "AFTER TOUCH" },
    { id: 30, top: "LEVEL", bot: "PITCH" },
    { id: 31, span: 1, group: "KEY TRANSPOSE", top: "", bot: "AMPLITUDE" },
    { id: 32, span: 1, group: "VOICE NAME", top: "", bot: "EG BIAS" }
];

function createRow(dataArray) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'grid-row';
    
    dataArray.forEach((data) => {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';

        if (data.span) {
            const groupL = document.createElement('div');
            groupL.className = 'group-label-purple';
            groupL.innerHTML = data.group;
            groupL.style.width = `calc(100% * ${data.span} + 6px * ${data.span - 1})`;
            cell.appendChild(groupL);
        }

        if (data.top) {
            const topL = document.createElement('div');
            topL.className = 'param-label';
            topL.innerHTML = data.top;
            cell.appendChild(topL);
        }

        const btn = document.createElement('button');
        btn.className = 'membrane-btn turquoise voice-btn'; 
        btn.innerHTML = `<div class="btn-text">${data.id}</div>`;
        
        btn.addEventListener('mousedown', () => btn.classList.add('active'));
        btn.addEventListener('mouseup', () => btn.classList.remove('active'));
        btn.addEventListener('mouseleave', () => btn.classList.remove('active'));

        cell.appendChild(btn);

        if (data.bot) {
            const botL = document.createElement('div');
            botL.className = 'sub-label';
            botL.innerHTML = data.bot;
            cell.appendChild(botL);
        }

        rowDiv.appendChild(cell);
    });
    return rowDiv;
}

container32.appendChild(createRow(gridDataRow1));
container32.appendChild(createRow(gridDataRow2));

// ==========================================
// 3. GENERAZIONE TASTIERA 60 TASTI
// ==========================================
const piano = document.getElementById("piano");
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

for (let i = 0; i < 60; i++) { 
    const key = document.createElement("div");
    const note = notes[i % 12];
    const isBlack = note.includes("#");
    
    key.className = isBlack ? "key black" : "key white";
    key.id = "key-" + i;
    
    key.addEventListener("mousedown", () => key.classList.add("active"));
    key.addEventListener("mouseup", () => key.classList.remove("active"));
    key.addEventListener("mouseleave", () => key.classList.remove("active"));
    piano.appendChild(key);
}

// ==========================================
// 4. LOGICA TASTIERA PC (QWERTY) E OTTAVE
// ==========================================
let currentOctaveStart = 24; 
const keyMap = {
    'KeyZ': 0, 'KeyS': 1, 'KeyX': 2, 'KeyD': 3, 'KeyC': 4, 'KeyV': 5, 'KeyG': 6, 'KeyB': 7, 'KeyH': 8, 'KeyN': 9, 'KeyJ': 10, 'KeyM': 11,
    'KeyQ': 12, 'Digit2': 13, 'KeyW': 14, 'Digit3': 15, 'KeyE': 16, 'KeyR': 17, 'Digit5': 18, 'KeyT': 19, 'Digit6': 20, 'KeyY': 21, 'Digit7': 22, 'KeyU': 23
};

function updateOctaveHighlight() {
    document.querySelectorAll('.key').forEach(k => k.classList.remove('octave-highlight'));
    for (let i = 0; i < 24; i++) {
        const visualKey = document.getElementById("key-" + (currentOctaveStart + i));
        if (visualKey) visualKey.classList.add('octave-highlight');
    }
}
updateOctaveHighlight();

window.addEventListener("keydown", (event) => {
    if (event.key === "+" || event.key === "=") {
        if (currentOctaveStart < 36) { currentOctaveStart += 12; updateOctaveHighlight(); }
        return;
    }
    if (event.key === "-" || event.key === "_") {
        if (currentOctaveStart > 0) { currentOctaveStart -= 12; updateOctaveHighlight(); }
        return;
    }
    if (keyMap.hasOwnProperty(event.code) && !event.repeat) {
        const visualKey = document.getElementById("key-" + (keyMap[event.code] + currentOctaveStart));
        if (visualKey) visualKey.classList.add("active");
    }
});

window.addEventListener("keyup", (event) => {
    if (keyMap.hasOwnProperty(event.code)) {
        const visualKey = document.getElementById("key-" + (keyMap[event.code] + currentOctaveStart));
        if (visualKey) visualKey.classList.remove("active");
    }
});

// ==========================================
// 5. LOGICA WHEELS
// ==========================================
function setupWheel(wheelId, isSpringLoaded) {
    const wheel = document.getElementById(wheelId);
    const slot = wheel.parentElement;
    let isDragging = false;
    let startY = 0; let startTop = 0;
    
    // Calcola il limite massimo appena il DOM è pronto
    setTimeout(() => {
        const maxTop = slot.clientHeight - wheel.clientHeight;
        wheel.style.top = isSpringLoaded ? (maxTop / 2) + "px" : maxTop + "px";

        wheel.addEventListener("mousedown", (e) => {
            isDragging = true; 
            startY = e.clientY; 
            startTop = parseFloat(wheel.style.top) || 0;
            wheel.classList.remove("snap-back");
        });

        window.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let newTop = startTop + (e.clientY - startY);
            if (newTop < 0) newTop = 0;
            if (newTop > maxTop) newTop = maxTop;
            wheel.style.top = newTop + "px";
            
            // --- IMPLEMENTAZIONE LCD ---
            let val;
            if (isSpringLoaded) {
                // PITCH: calcola da -100 a +100
                val = Math.round((1 - (newTop / maxTop)) * 200 - 100);
                // Aggiungiamo il segno "+" se il valore è positivo per un look più tecnico
                let displayVal = val > 0 ? "+" + val : val;
                updateDisplay("PITCH BEND", `VALUE: ${displayVal}`);
            } else {
                // MODULATION: calcola da 0 a 100
                val = Math.round((1 - (newTop / maxTop)) * 100);
                updateDisplay("MODULATION", `VALUE: ${val}`);
            }
        });

        window.addEventListener("mouseup", () => {
            if (!isDragging) return;
            isDragging = false;
            
            if (isSpringLoaded) {
                wheel.classList.add("snap-back");
                wheel.style.top = (maxTop / 2) + "px";
                updateDisplay("PITCH BEND", "CENTERED (0)");
            }
        });
        
        window.addEventListener("mouseleave", () => {
            if (isDragging && isSpringLoaded) {
                isDragging = false;
                wheel.classList.add("snap-back");
                wheel.style.top = (maxTop / 2) + "px";
                updateDisplay("PITCH BEND", "CENTERED (0)");
            } else {
                isDragging = false;
            }
        });

    }, 100);
}

setupWheel("pitch-wheel", true);
setupWheel("mod-wheel", false);