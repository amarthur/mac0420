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

var gClockInterface = {
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
  gClockInterface.clock = document.getElementById("clock");
  gClockInterface.restartClock();
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
    }
  }

  gNumericKb.btClear.onclick = () => gDisplay.clear();
  gNumericKb.btDel.onclick = () => gDisplay.del();
}


function changeClockValue(cs, ss, mm) {
  gClockInterface.clock.innerText = f2(mm) + " : " + f2(ss) + " : " + f2(cs);
}

function f2(x) {
  return ("00" + x).slice(-2);
}


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
    toggleNumericKeyboard(disabledState = true);
    gClockInterface.restartClock();
    gControlBts.toggleStateRunning();
    gDisplay.normalizeDisplayTime();
    if (btType == TIMER) {
      changeClockValue(0, gDisplay.ss, gDisplay.mm);
    }
  }
  else {
    toggleNumericKeyboard(disabledState = false);
    gControlBts.toggleStateStopped();
  }
}

function togglePauseState(e) {
  let pauseState = gControlBts.btPause.value;

  if (pauseState == RUN) {
    gClockInterface.startTime = Date.now();
    gControlBts.btPause.value = PAUSE;
  }
  else {
    gClockInterface.elapsedTime += Date.now() - gClockInterface.startTime;
    gControlBts.btPause.value = RUN;
  }
}

function toggleTypeState(e) {
  let typeState = gControlBts.btType.value;
  gControlBts.btType.value = (typeState == TIMER) ? CHRONO : TIMER;
}

/* ==================================================================
    ANIMATION
*/

function animateNewFrame(e) {
  let typeState = gControlBts.btType.value;
  if (typeState == CHRONO)
    animateChronometer();
  else
    animateTimer();
}

function animateChronometer(e) {
  let btState = gControlBts.btStart.value;
  let pauseState = gControlBts.btPause.value;

  if (btState == STOP && pauseState != RUN) {
    let now = Date.now() + gClockInterface.elapsedTime + 58000;
    let ms = now - gClockInterface.startTime; // Milliseconds
    let cs = Math.floor(ms / 10) % 100; // Centiseconds
    let ss = Math.floor(ms / 1000) % 60; // Seconds
    let mm = Math.floor(ms / 60000) % 60; // Minutes

    if (mm < gDisplay.mm || (mm == gDisplay.mm && ss < gDisplay.ss)) {
      changeClockValue(cs, ss, mm);
    }
    else if (mm == gDisplay.mm && ss == gDisplay.ss) {
      changeClockValue(0, ss, mm);
      toggleNumericKeyboard(disabledState = false);
      gClockInterface.restartClock();
      gControlBts.toggleStateStopped();
    }

  }

  window.requestAnimationFrame(animateNewFrame);
}

function animateTimer() {
  let btState = gControlBts.btStart.value;
  let pauseState = gControlBts.btPause.value;

  if (btState == STOP && pauseState != RUN) {
    let ms = parseInt(gDisplay.mm) * 60000 + parseInt(gDisplay.ss) * 60

    let now = Date.now();
    let cs = Math.floor(ms / 10) % 100; // Centiseconds

    if (mm < gDisplay.mm || (mm == gDisplay.mm && ss < gDisplay.ss)) {
      changeClockValue(cs, ss, mm);
    } else if (mm == gDisplay.mm && ss == gDisplay.ss) {
      changeClockValue(0, ss, mm);
      gClockInterface.restartClock();
      toggleNumericKeyboard(disabledState = false);
      gControlBts.toggleStateStopped();
    }

  }

  window.requestAnimationFrame(animateNewFrame);

}
