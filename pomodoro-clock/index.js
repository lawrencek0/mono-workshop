$(document).ready(function() {
    $(".break").hide();
});
var watch = 0;
var active = false;
var sessionId = $("#session-time");
var breakId =  $("#break-time");
var sessionTime = sessionId.text() * 60;
var breakTime = breakId.text() * 60;

var sessionClock = new FlipClock($("#session"), sessionTime, {
    autoPlay: false,
    autoStart: false,
    countdown: true,
    clockFace: "MinuteCounter",
    callbacks: {
        interval: function() {
            active = true;
            if (sessionClock.getTime().time == 0) {

                $(".session").hide();
                $(".break").show();
                breakClock.setTime(breakId.text() * 60);
                watch = 1;
                breakClock.start();
            }
        }
    }
});

var breakClock = new FlipClock($("#break"), breakTime, {
    autoPlay: false,
    autoStart: false,
    countdown: true,
    clockFace: "MinuteCounter",
    callbacks: {
        interval: function() {
            if (breakClock.getTime().time == 0) {
                $(".break").hide();
                $(".session").show();
                sessionClock.setTime(sessionId.text() * 60);
                watch = 0;
                sessionClock.start();
            }
        }
    }
});

$(".timer").click(function() {
    if ($(this).hasClass("stop")) {
        active = false;
        $(this).removeClass("stop").addClass("start");
        sessionClock.stop();
        breakClock.stop();
    } else if ($(this).hasClass("start")) {
        $(this).removeClass("start").addClass("stop");
        if (watch == 0) {
            sessionClock.start();
        } else if (watch == 1) {
            breakClock.start();
        }
    }
});

$(".ctrl").click(function() {
    if (active == false) {
        if ($(this).is("#subSession")) {
            sessionTime = parseInt(sessionId.text());
            if (sessionTime == 1) {
                sessionId.text(1);
            } else {
                sessionId.text(sessionTime - 1);
            }
            sessionClock.setTime(sessionId.text() * 60);
        } else if ($(this).is("#addSession")) {
            sessionTime = parseInt(sessionId.text());
            sessionId.text(sessionTime + 1);
            sessionClock.setTime(sessionId.text() * 60);
        } else if ($(this).is("#subBreak")) {
            breakTime = parseInt(breakId.text());
            if (breakTime == 1) {
                breakId.text(1);
            } else {
                breakId.text(breakTime - 1);
            }
            breakClock.setTime(breakId.text() * 60);
        } else if ($(this).is("#addBreak")) {
            breakTime = parseInt(breakId.text());
            breakId.text(breakTime + 1);
            breakClock.setTime(breakId.text() * 60);
        }
    }
});