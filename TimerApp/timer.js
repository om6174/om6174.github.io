const FULL_DASH_ARRAY = 283;

const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
    },
    alert: {
        color: "red",
    },
    inactive: {
        color: "grey"
    }
};

let timerInterval = null;
class tomato {
    constructor(id, TIME_LIMIT) {
        this.id = id;
        this.TIME_LIMIT = TIME_LIMIT;
        this.WARNING_THRESHOLD = Math.ceil(TIME_LIMIT / 2);
        this.ALERT_THRESHOLD = TIME_LIMIT >= 1800 ? 300 : Math.ceil(TIME_LIMIT / 6);
    }
    setTimeLimit(newval){
        this.TIME_LIMIT = newval;
        this.WARNING_THRESHOLD = Math.ceil(newval / 2);
        this.ALERT_THRESHOLD = newval >= 1800 ? 300 : Math.ceil(newval / 6);
    }
}
var work = new tomato('app', 10);
var rest = new tomato('app2', 5);
var activeTimer = {
    currClock: work.id,
    currtimeLeft: work.TIME_LIMIT,
    currtimePassed: 0,
    paused: true,
    pauseTimer() {
        this.paused = true;
        clearInterval(timerInterval);
    },
    resumeTimer() {
        if (this.paused) {
            this.paused = false;
            startTimer();
        }
    }
}


document.getElementById("app").innerHTML = `
<div class="base-timer col-11 p-0">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="43"></circle>
      <path
        stroke-dasharray="283"
        class="base-timer-path-remaining base-timer__path-remaining ${COLOR_CODES.info.color}"
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
    work.TIME_LIMIT
)}</span>
</div>
`;

document.getElementById("app2").innerHTML = `
<div class="base-timer col-11 p-0">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="47"></circle>
      <path
        stroke-dasharray="283"
        class="base-timer-path-remaining base-timer__path-remaining ${COLOR_CODES.info.color}"
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
    rest.TIME_LIMIT
)}</span>
</div>
`;


function onTimesUp() {
    clearInterval(timerInterval);
    const { currClock } = activeTimer
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
            work.TIME_LIMIT
        );
        activeTimer.currClock = 'app2';
        activeTimer.currtimeLeft = rest.TIME_LIMIT;
        activeTimer.currtimePassed = 0;

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
            rest.TIME_LIMIT
        );
        activeTimer.currClock = 'app';
        activeTimer.currtimeLeft = work.TIME_LIMIT;
        activeTimer.currtimePassed = 0;

    }

    startTimer();
}

function startTimer() {
    const { currClock, currtimeLeft } = activeTimer;
    setRemainingPathColor(currtimeLeft);
    setCircleDasharray();

    document.getElementById(currClock).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        currtimeLeft
    );
    timerInterval = setInterval(() => {
        activeTimer.currtimePassed += 1;
        if (activeTimer.currClock == 'app')
            activeTimer.currtimeLeft = work.TIME_LIMIT - activeTimer.currtimePassed;
        else
            activeTimer.currtimeLeft = rest.TIME_LIMIT - activeTimer.currtimePassed;
        setRemainingPathColor(activeTimer.currtimeLeft);
        document.getElementById(activeTimer.currClock).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
            activeTimer.currtimeLeft
        );
        setCircleDasharray();

        if (activeTimer.currtimeLeft < 0) {
            onTimesUp();
        }
    }, 1000);
}


function formatTime(time) {
    const hours = Math.floor(time / 3600);
    time = time % 3600;
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${hours}:${minutes}:${seconds}`;
}

function defaultTime(seconds) {
    dateObj = new Date(seconds * 1000);
    hours = dateObj.getUTCHours();
    minutes = dateObj.getUTCMinutes();
    seconds = dateObj.getSeconds();

    timeString = hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0');
    return timeString;
}
function setRemainingPathColor(timeLeft) {
    const { currClock } = activeTimer;
    currClock == work.id ? { ALERT_THRESHOLD, WARNING_THRESHOLD } = work : { ALERT_THRESHOLD, WARNING_THRESHOLD } = rest;
    if (timeLeft <= ALERT_THRESHOLD) {

        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.remove(COLOR_CODES.warning.color);
        document
            .getElementById(currClock)
            .querySelectorAll(".base-timer-path-remaining")[0]
            .classList.add(COLOR_CODES.alert.color);
    } else if (timeLeft <= WARNING_THRESHOLD) {
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
    if (activeTimer.currClock == 'app') {
        const rawTimeFraction = activeTimer.currtimeLeft / work.TIME_LIMIT;
        return rawTimeFraction - (1 / work.TIME_LIMIT) * (1 - rawTimeFraction);
    }
    else {
        const rawTimeFraction = activeTimer.currtimeLeft / rest.TIME_LIMIT;
        return rawTimeFraction - (1 / rest.TIME_LIMIT) * (1 - rawTimeFraction);
    }


}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById(activeTimer.currClock)
        .querySelectorAll(".base-timer-path-remaining")[0]
        .setAttribute("stroke-dasharray", circleDasharray);
}

function resetTimer() {
    clearInterval(timerInterval);
    activeTimer.paused = true;
    activeTimer.currtimePassed = 0;
    activeTimer.currtimeLeft = work.TIME_LIMIT;

    // reset second timer
    activeTimer.currClock = 'app2';
    setRemainingPathColor(rest.TIME_LIMIT);
    setCircleDasharray();
    document.getElementById('app2').querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        rest.TIME_LIMIT
    );
    //reset first timer
    activeTimer.currClock = 'app';
    setRemainingPathColor(work.TIME_LIMIT);
    setCircleDasharray();
    document.getElementById('app').querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        work.TIME_LIMIT
    );

}



function restartTimer() {
    clearInterval(timerInterval);
    activeTimer.currtimeLeft = activeTimer.currtimeLeft + activeTimer.currtimePassed;
    activeTimer.currtimePassed = 0;
    setRemainingPathColor(activeTimer.currtimeLeft);
    document.getElementById(activeTimer.currClock).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
        activeTimer.currtimeLeft
    );
    setCircleDasharray();
    if (!activeTimer.paused) {
        activeTimer.paused = !activeTimer.paused;
        activeTimer.resumeTimer();
    }
}

function setMaxTime(element) {
    let delayTimer = null;
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        if (element.id == "work") {
            work.setTimeLimit(getSeconds(element.value));
            if (activeTimer.currClock == work.id) {
                activeTimer.currtimeLeft = work.TIME_LIMIT;
                activeTimer.currtimePassed = 0;
                restartTimer();
            }
            else {
                document.getElementById(work.id).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
                    work.TIME_LIMIT
                );
            }
        }
        else {
            rest.setTimeLimit(getSeconds(element.value));
            if (activeTimer.currClock == rest.id) {
                activeTimer.currtimeLeft = rest.TIME_LIMIT;
                activeTimer.currtimePassed = 0;
                restartTimer();
            }
            else {
                document.getElementById(rest.id).querySelectorAll(".base-timer-label")[0].innerHTML = formatTime(
                    rest.TIME_LIMIT
                );
            }
        }
    }, 1000);
}

function getSeconds(stringTime) {
    var [hr, min, sec] = stringTime.split(':');
    return (parseInt(hr) * 3600) + (parseInt(min) * 60) + parseInt(sec)
}

function userInput(element) {
    var regex = /^\d+$/;
    var x = new Array(3).fill('00');
    var y = element.value.split(':');
    x.forEach((item, i) => {
        if (y[i]) {
            if (regex.test(y[i])) {
                x[i] = y[i].substring(0, 2);
            }
        }
    });
    if(parseInt(x.join(''))!=0 && x != y)
    element.value = x.join(':');
    else
    element.value = '00:15:00'
    setMaxTime(element);
}

