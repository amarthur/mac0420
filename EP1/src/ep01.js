//! HEADER

window.onload = main;

/* ==================================================================
    GLOBALS
*/

const ZERO = "0";
const DISPLAY_ZERO = "0000";
const MAX_DISPLAY_TIME = "59";

const START = "Start";
const STOP = "Stop";

const PAUSE = "| |";
const RUN = ">";

const CHRONO = "Crono";
const TIMER = "Timer";

var gDisplay = {
  num: DISPLAY_ZERO,
  display: null,

  get mm() { return this.num.slice(0, 2); },
  get ss() { return this.num.slice(2, 4); },
  get totalMs() { return this.mm * 60000 + this.ss * 1000; },


  clear: function () {
    this.num = DISPLAY_ZERO;
    updateDisplay();
  },

  del: function () {
    this.num = ZERO + this.num.slice(0, -1);
    updateDisplay();
  },

  normalizeDisplayTime: function () {
    const normalizeTime = (displayNum) => (parseInt(displayNum) > parseInt(MAX_DISPLAY_TIME)) ? MAX_DISPLAY_TIME : displayNum;

    this.num = normalizeTime(this.mm) + normalizeTime(this.ss);

    updateDisplay();
  },
}

var gNumericKb = {
  numericKeyboard: null,
  btClear: null,
  btDel: null,
}

var gClock = {
  clock: null,
  startTime: 0,
  elapsedTime: 0,

  restartClock: function () {
    this.startTime = Date.now();
    this.elapsedTime = 0;
  },
}

var gControlBts = {
  btType: null,
  btStart: null,
  btPause: null,

  toggleStateRunning: function () {
    this.btStart.value = STOP;
    this.btPause.value = PAUSE;

    this.btPause.disabled = false;
    this.btType.disabled = true;
  },

  toggleStateStopped: function () {
    this.btStart.value = START;
    this.btPause.value = RUN;

    this.btPause.disabled = true;
    this.btType.disabled = false;
  },

}

/* ==================================================================
    MAIN
*/

function main() {
  buildInterface();
  animateNewFrame();
};

/* ==================================================================
    BUILD
*/

function buildInterface() {
  buildDisplayInterface();
  buildNumericKeyboardInterface();
  buildClockInterface();
  buildControlBtsInterface();
}

function buildDisplayInterface() {
  gDisplay.display = document.getElementById("display");
}

function buildNumericKeyboardInterface() {
  gNumericKb.numericKeyboard = document.getElementById("numericKeyboard");
  gNumericKb.btClear = document.getElementById("btClear");
  gNumericKb.btDel = document.getElementById("btDel");

  createNumericKeyboard();
}

function buildClockInterface() {
  gClock.clock = document.getElementById("clock");
  gClock.restartClock();
}

function buildControlBtsInterface() {
  gControlBts.btType = document.getElementById("btType");
  gControlBts.btStart = document.getElementById("btStart");
  gControlBts.btPause = document.getElementById("btPause");

  gControlBts.btType.value = CHRONO;
  gControlBts.btStart.onclick = toggleClockState;
  gControlBts.btPause.onclick = togglePauseState;
  gControlBts.btType.onclick = toggleTypeState;

  gControlBts.toggleStateStopped();
}

/* ==================================================================
    AUXILIARY FUNCTIONS
*/

function updateDisplay() {
  gDisplay.display.innerText = gDisplay.mm + ":" + gDisplay.ss;
}

function createNumericKeyboard() {
  const numericKeys = gNumericKb.numericKeyboard.getElementsByClassName("numKey");

  for (let i = 0; i < numericKeys.length; i++) {
    numericKeys[i].onclick = function () { // Append to the left
      gDisplay.num = gDisplay.num.slice(1) + this.innerText;
      updateDisplay();
      console.log("Botao: " + this.innerText + " " + gDisplay.num);
    }
  }

  gNumericKb.btClear.onclick = () => {
    gDisplay.clear();
    console.log("CL: cl " + gDisplay.num);
  }

  gNumericKb.btDel.onclick = () => {
    gDisplay.del();
    console.log("DEL: del " + gDisplay.num);
  }
}

function changeClockValue(cs, ss, mm) {
  gClock.clock.innerText = f2(mm) + " : " + f2(ss) + " : " + f2(cs);
}

function changeClockValueMs(ms) {
  let cs = toCs(ms);
  let ss = toSs(ms);
  let mm = toMm(ms);
  gClock.clock.innerText = f2(mm) + " : " + f2(ss) + " : " + f2(cs);
}

function f2(x) {
  return ("00" + x).slice(-2);
}

function toCs(ms) { return Math.floor(ms / 10) % 100; } // Centiseconds
function toSs(ms) { return Math.floor(ms / 1000) % 60; } // Seconds
function toMm(ms) { return Math.floor(ms / 60000) % 60; } // Minutes

/* ==================================================================
    TOGGLE CONTROLS
*/

function toggleNumericKeyboard(disabledState) {
  const numericKeys = gNumericKb.numericKeyboard.getElementsByClassName("nk");

  for (let i = 0; i < numericKeys.length; i++) {
    numericKeys[i].disabled = disabledState;
  }
}

function toggleClockState(e) {
  let btState = gControlBts.btStart.value;

  if (btState == START) {
    gClock.restartClock();
    gDisplay.normalizeDisplayTime();
    gControlBts.toggleStateRunning();
    toggleNumericKeyboard(disabledState = true);
    console.log(gControlBts.btType.value + " iniciado.");
  }
  else {
    gControlBts.toggleStateStopped();
    toggleNumericKeyboard(disabledState = false);
    console.log(gControlBts.btType.value + " finalizado.");
  }
}

function togglePauseState(e) {
  let pauseState = gControlBts.btPause.value;

  if (pauseState == RUN) {
    gClock.startTime = Date.now(); // Reset start time
    gControlBts.btPause.value = PAUSE;
    console.log("Rodando");
  }
  else {
    gClock.elapsedTime += Date.now() - gClock.startTime; // Count elapsed time
    gControlBts.btPause.value = RUN;
    console.log("Pausado");
  }
}

function toggleTypeState(e) {
  let typeState = gControlBts.btType.value;
  gControlBts.btType.value = (typeState == TIMER) ? CHRONO : TIMER;
  console.log("Modo " + gControlBts.btType.value + " habilitado.");
}

/* ==================================================================
    ANIMATION
*/

function animateNewFrame(e) {
  let typeState = gControlBts.btType.value;
  (typeState == CHRONO) ? animateChronometer() : animateTimer();
}

function animateChronometer(e) {
  let btState = gControlBts.btStart.value;
  let pauseState = gControlBts.btPause.value;

  if (btState == STOP && pauseState != RUN) {
    let timeElapsedSinceLastStart = Date.now() - gClock.startTime;
    let totalElapsedTime = timeElapsedSinceLastStart + gClock.elapsedTime;
    let ms = Math.min(totalElapsedTime, gDisplay.totalMs);

    if (ms <= gDisplay.totalMs)
      changeClockValueMs(ms);

    if (ms == gDisplay.totalMs)
      gControlBts.btStart.click();
  }

  window.requestAnimationFrame(animateNewFrame);
}

function animateTimer() {
  let btState = gControlBts.btStart.value;
  let pauseState = gControlBts.btPause.value;

  if (btState == STOP && pauseState != RUN) {
    let timeElapsedSinceLastStart = Date.now() - gClock.startTime;
    let totalElapsedTime = timeElapsedSinceLastStart + gClock.elapsedTime;
    let ms = Math.max(0, gDisplay.totalMs - totalElapsedTime);

    if (ms >= 0)
      changeClockValueMs(ms);

    if (ms == 0)
      gControlBts.btStart.click();
  }

  window.requestAnimationFrame(animateNewFrame);

}
