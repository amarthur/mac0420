//! HEADER

window.onload = main;

/* ==================================================================
    Globals
*/

var gClockInterface = {
  startTime: 0,
};

var START = "Start";
var STOP = "Stop";

/* ==================================================================
    Main
*/

function main() {
  buildInterface();

  animateNewFrame();
};

function buildInterface() {
  gClockInterface.btStart = document.getElementById("btStart");
  gClockInterface.clock = document.getElementById("clock");

  gClockInterface.btStart.onclick = changeButtonStateCallback;
}

function changeButtonStateCallback(e) {
  let btState = gClockInterface.btStart.value;

  if (btState == START) {
    gClockInterface.btStart.value = STOP;
    gClockInterface.startTime = Date.now();
  }
  else {
    gClockInterface.btStart.value = START;
  }
}

function animateNewFrame(e) {
  let btState = gClockInterface.btStart.value;

  if (btState == STOP) {
    let now = Date.now();
    let ms = now - gClockInterface.startTime; // Milliseconds
    let cs = Math.floor(ms / 10); // Centiseconds
    let ss = Math.floor(ms / 1000); // Seconds
    let mm = Math.floor(ss / 60); // Minutes

    cs = f2(cs % 100);
    ss = f2(ss % 60);
    mm = f2(mm);

    gClockInterface.clock.innerHTML = mm + " : " + ss + " : " + cs;
  }
  window.requestAnimationFrame(animateNewFrame);
}

function f2(x) {
  return ("00" + x).slice(-2);
}

