//! HEADER

window.onload = main;

/* ==================================================================
    Globals
*/

var DISPLAY_ZERO = "0000"
var START = "Start";
var STOP = "Stop";
var PAUSE = "| |";
var RUN = ">";

var gClockInterface = {
  startTime: 0,
  elapsedTime: 0,
  displayNum: DISPLAY_ZERO,
};

/* ==================================================================
    Main
*/

function main() {
  buildInterface();

  animateNewFrame();
};

function buildInterface() {
  gClockInterface.clock = document.getElementById("clock");
  gClockInterface.btStart = document.getElementById("btStart");
  gClockInterface.btPause = document.getElementById("btPause");
  gClockInterface.numericKeyboard = document.getElementById("numericKeyboard");
  gClockInterface.display = document.getElementById("display");
  gClockInterface.btClear = document.getElementById("btClear");
  gClockInterface.btDel = document.getElementById("btDel");

  createNumericKeyboard();

  gClockInterface.btStart.onclick = changeClockState;
  gClockInterface.btStart.value = START;

  gClockInterface.btPause.onclick = changePauseState;
  gClockInterface.btPause.value = PAUSE;

  gClockInterface.btClear.onclick = clearNumericKeyboard;
  gClockInterface.btDel.onclick = delNumericKeyboard;
}

function createNumericKeyboard() {
  const numericKeys = gClockInterface.numericKeyboard.getElementsByClassName("numKey");

  for (let i = 0; i < numericKeys.length; i++) {
    numericKeys[i].onclick = function () {
      const keyVal = this.innerText;
      gClockInterface.displayNum = gClockInterface.displayNum.slice(1) + keyVal;
      updateDisplay();
    }
  }
}

function clearNumericKeyboard() {
  gClockInterface.displayNum = DISPLAY_ZERO;
  updateDisplay();
}

function delNumericKeyboard() {
  gClockInterface.displayNum = "0" + gClockInterface.displayNum.slice(0, -1);
  updateDisplay();
}

function updateDisplay() {
  let displayText = gClockInterface.displayNum;
  gClockInterface.display.innerText = displayText.slice(0, 2) + " : " + displayText.slice(2, 4);
}

function changeClockState(e) {
  let btState = gClockInterface.btStart.value;

  if (btState == START) {
    gClockInterface.btStart.value = STOP;
    gClockInterface.btPause.disabled = false;
    restartClock();
  }
  else {
    gClockInterface.btStart.value = START;
    gClockInterface.btPause.value = PAUSE;
    gClockInterface.btPause.disabled = true;
  }
}


function restartClock() {
  gClockInterface.startTime = Date.now();
  gClockInterface.elapsedTime = 0;
}

function changePauseState(e) {
  let pauseState = gClockInterface.btPause.value;

  if (pauseState == RUN) {
    gClockInterface.startTime = Date.now();
    gClockInterface.btPause.value = PAUSE;
  }
  else {
    gClockInterface.elapsedTime += Date.now() - gClockInterface.startTime;
    gClockInterface.btPause.value = RUN;
  }
}

function animateNewFrame(e) {
  let btState = gClockInterface.btStart.value;
  let pauseState = gClockInterface.btPause.value;

  if (btState == STOP && pauseState != RUN) {
    let now = Date.now() + gClockInterface.elapsedTime;
    let ms = now - gClockInterface.startTime; // Milliseconds
    let cs = Math.floor(ms / 10); // Centiseconds
    let ss = Math.floor(ms / 1000); // Seconds
    let mm = Math.floor(ss / 60); // Minutes

    cs = f2(cs % 100);
    ss = f2(ss % 60);
    mm = f2(mm);

    gClockInterface.clock.innerText = mm + " : " + ss + " : " + cs;
  }
  window.requestAnimationFrame(animateNewFrame);
}

function f2(x) {
  return ("00" + x).slice(-2);
}

