const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 2;
const ALERT_THRESHOLD = 2;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    },
    inactive: {
        color: "grey"
    }
};

const TIME_LIMIT = 5;
const TIME_LIMIT2 = 3;
let currtimePassed = 0;
let paused = true;
let currtimeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let currClock = 'app';
document.getElementById("app").innerHTML = `
<div class="base-timer col-11 p-0">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        stroke-dasharray="283"
        class="base-timer-path-remaining base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span class="base-timer__label base-timer-label">${formatTime(
    TIME_LIMIT
)}</span>
</div>
`;

document.getElementById("app2").innerHTML = `
<div class="base-timer col-11 p-0">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        stroke-dasharray="283"
        class="base-timer-path-remaining base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span class="base-timer__label base-timer-label">${formatTime(
    TIME_LIMIT2
)}</span>
</div>
`;


function onTimesUp() {
    clearInterval(timerInterval);
    if (currClock == 'app') {
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.alert.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.add(COLOR_CODES.inactive.color);
            document.getElementById(currClock).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
                TIME_LIMIT
            );
        currClock = 'app2';
        currtimeLeft = TIME_LIMIT2;
        currtimePassed = 0;

    }
    else {
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.alert.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.add(COLOR_CODES.inactive.color);
            document.getElementById(currClock).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
                TIME_LIMIT2
            );
        currClock = 'app';
        currtimeLeft = TIME_LIMIT;
        currtimePassed = 0;

    }

    startTimer();
}

function startTimer() {

    setRemainingPathColor(currtimeLeft);
    setCircleDasharray();

    document.getElementById(currClock).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        currtimeLeft
    );
    timerInterval = setInterval(() => {
        currtimePassed += 1;
        if (currClock == 'app')
            currtimeLeft = TIME_LIMIT - currtimePassed;
        else
            currtimeLeft = TIME_LIMIT2 - currtimePassed;
        setRemainingPathColor(currtimeLeft);
        document.getElementById(currClock).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
            currtimeLeft
        );
        setCircleDasharray();

        if (currtimeLeft <= 0) {
            onTimesUp();
        }
    }, 1000);
}


function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    //const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= COLOR_CODES.alert.threshold) {

        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.warning.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.add(COLOR_CODES.alert.color);
    } else if (timeLeft <= COLOR_CODES.warning.threshold) {
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.info.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.add(COLOR_CODES.warning.color);
    }
    else {
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.inactive.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.warning.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.alert.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.add(COLOR_CODES.info.color);
    }
}

function calculateTimeFraction() {
    if (currClock == 'app') {
        const rawTimeFraction = currtimeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }
    else {
        const rawTimeFraction = currtimeLeft / TIME_LIMIT2;
        return rawTimeFraction - (1 / TIME_LIMIT2) * (1 - rawTimeFraction);
    }


}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById(currClock)
        .querySelectorAll(".base-timer-path-remaining")[0]
        .setAttribute("stroke-dasharray", circleDasharray);
}

function resetTimer() {
    clearInterval(timerInterval);
    paused = true;
    currtimePassed = 0;
    currtimeLeft = TIME_LIMIT;

    // reset second timer
    currClock = 'app2';
    setRemainingPathColor(TIME_LIMIT2);
    setCircleDasharray();
    document.getElementById('app2').querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        TIME_LIMIT2
    );
    //reset first timer
    currClock = 'app';
    setRemainingPathColor(TIME_LIMIT);
    setCircleDasharray();
    document.getElementById('app').querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        TIME_LIMIT
    );

}

function pauseTimer() {
    paused = true;
    clearInterval(timerInterval);
}

function resumeTimer() {
    if (paused == true) {
        startTimer();
        paused = false;
    }
}

function restartTimer() {
    clearInterval(timerInterval);
    currtimeLeft = currtimeLeft + currtimePassed;
    currtimePassed = 0;
    setRemainingPathColor(currtimeLeft);
    document.getElementById('app').querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        currtimeLeft
    );
    setCircleDasharray();
    if (!paused) {
        paused = !paused;
        resumeTimer();
    }
}

