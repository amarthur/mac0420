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

var CRONO = "Crono";
var TIMER = "Timer";

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
  // Time Display
  gClockInterface.display = document.getElementById("display");

  // Numeric Keyboard
  gClockInterface.numericKeyboard = document.getElementById("numericKeyboard");
  gClockInterface.btClear = document.getElementById("btClear");
  gClockInterface.btDel = document.getElementById("btDel");

  // Clock
  gClockInterface.clock = document.getElementById("clock");

  // Control Buttons
  gClockInterface.btType = document.getElementById("btType");
  gClockInterface.btStart = document.getElementById("btStart");
  gClockInterface.btPause = document.getElementById("btPause");

  createNumericKeyboard();
  gClockInterface.btClear.onclick = clearNumericKeyboard;
  gClockInterface.btDel.onclick = delNumericKeyboard;

  gClockInterface.btStart.onclick = changeClockState;
  gClockInterface.btStart.value = START;

  gClockInterface.btPause.onclick = changePauseState;
  gClockInterface.btPause.value = PAUSE;

  // gClockInterface.btPause.onclick = changePauseState;
  gClockInterface.btType.value = TIMER;
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
  gClockInterface.display.innerText = displayText.slice(0, 2) + ":" + displayText.slice(2, 4);
}

function changeClockState(e) {
  let btState = gClockInterface.btStart.value;

  if (btState == START) {
    gClockInterface.btStart.value = STOP;
    gClockInterface.btPause.disabled = false;
    normalizeDisplayTime();
    restartClock();
  }
  else {
    gClockInterface.btStart.value = START;
    gClockInterface.btPause.value = PAUSE;
    gClockInterface.btPause.disabled = true;
  }
}

function normalizeDisplayTime() {
  let displayNum = gClockInterface.displayNum
  let minutesDigits = (parseInt(displayNum[0]) >= 6) ? "59" : displayNum.slice(0, 2);
  let secondsDigits = (parseInt(displayNum[2]) >= 6) ? "59" : displayNum.slice(2, 4);
  gClockInterface.displayNum = minutesDigits + secondsDigits;
  updateDisplay();
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
  animateStopwatch();
}

function animateStopwatch(e) {
  let btState = gClockInterface.btStart.value;
  let pauseState = gClockInterface.btPause.value;
  let typeState = gClockInterface.btType.value;

  let userTime = gClockInterface.displayNum;
  let userMinutes = parseInt(userTime.slice(0, 2));
  let userSeconds = parseInt(userTime.slice(2, 4));

  if (typeState == TIMER) {
    if (btState == STOP && pauseState != RUN) {
      let now = Date.now() + gClockInterface.elapsedTime;
      let ms = now - gClockInterface.startTime; // Milliseconds
      let cs = Math.floor(ms / 10) % 100; // Centiseconds
      let ss = Math.floor(ms / 1000) % 60; // Seconds
      let mm = Math.floor(ss / 60); // Minutes

      if (mm < userMinutes) {
        changeStopwatchValue(cs, ss, mm);
      }
      else if (mm == userMinutes) {
        if (ss < userSeconds) {
          changeStopwatchValue(cs, ss, mm);
        }
        else if (ss == userSeconds) {
          changeStopwatchValue(0, ss, mm);
          restartClock();
          gClockInterface.btStart.value = START;
          gClockInterface.btPause.value = PAUSE;
          gClockInterface.btPause.disabled = true;
        }
      }
      else {
        restartClock();
        gClockInterface.btStart.value = START;
        gClockInterface.btPause.value = PAUSE;
        gClockInterface.btPause.disabled = true;
      }
    }

  }
  window.requestAnimationFrame(animateNewFrame);
}

function changeStopwatchValue(cs, ss, mm) {
  gClockInterface.clock.innerText = f2(mm) + " : " + f2(ss) + " : " + f2(cs);
}

function f2(x) {
  return ("00" + x).slice(-2);
}

