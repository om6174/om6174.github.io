// Function to request permission for browser notifications
function requestNotificationPermission() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("Notification permission granted");
            }
        });
    }
}

// Function to send a notification when the timer ends
function sendNotification(title, message) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: message,
            icon: 'https://via.placeholder.com/100' // Replace with your own icon
        });
    }
}

// Timer function
function startTimer(hour, minute, second, isWorkTimer = true) {
    const totalTimeInSeconds = (hour * 3600) + (minute * 60) + second;
    let remainingTime = totalTimeInSeconds;

    const intervalId = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            const timerType = isWorkTimer ? 'Work' : 'Rest';
            sendNotification(`${timerType} Timer Done!`, `${timerType} timer is up! Time to take a break or get back to work!`);
        } else {
            remainingTime--;
        }
    }, 1000);
}

// Event listener for starting the work timer
document.getElementById("startWorkTimer").addEventListener("click", () => {
    const hour = parseInt(document.getElementById("workHour").value, 10);
    const minute = parseInt(document.getElementById("workMinute").value, 10);
    const second = parseInt(document.getElementById("workSecond").value, 10);
    startTimer(hour, minute, second, true);
});

// Event listener for starting the rest timer
document.getElementById("startRestTimer").addEventListener("click", () => {
    const hour = parseInt(document.getElementById("restHour").value, 10);
    const minute = parseInt(document.getElementById("restMinute").value, 10);
    const second = parseInt(document.getElementById("restSecond").value, 10);
    startTimer(hour, minute, second, false);
});

// Request notification permission on page load
requestNotificationPermission();
