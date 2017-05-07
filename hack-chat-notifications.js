// ==UserScript==
// @name         hack.chat notifications
// @namespace    A4
// @version      0.1.0
// @description  Displays desktop notifications when unread messages are sent in hack.chat.
// @author       A4
// @match        https://hack.chat/?*
// @grant        none
// ==/UserScript==

(function() {
    "use strict";

    let lastNotification = null;
    const activityNotifications = [];
    let unreadCounter = 0;
    const unreadMsgs = [];

    addEventListener("focus", () => {
        unreadCounter = 0;
        unreadMsgs.length = 0;

        if (lastNotification !== null) {
            lastNotification.close();
            lastNotification = null;
        }

        if (activityNotifications.length !== 0) {
            activityNotifications.forEach(an => an.close());
            activityNotifications.length = 0;
        }
    });

    const pushMessageOrig = pushMessage;

    pushMessage = args => {
        pushMessageOrig(args);

        if (windowActive) {
            return;
        }

        if (args.nick !== "*" && args.nick !== "!") {
            notifyMsg(args.nick, args.text);
        } else if (args.nick === "*" && args.text.indexOf("Users online:") === -1) {
            notifyActivity(args.text);
        }
    };

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    function notifyMsg(sender, msg) {
        if (!Notification) {
            alert(
                "Desktop notifications are not available in your browser. " +
                    "Try the lastest version of Chrome or Firefox."
            );
            return;
        }

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
            return;
        }

        if (lastNotification !== null) {
            lastNotification.close();
            lastNotification = null;
        }

        unreadCounter += 1;

        if (unreadMsgs.length === 4) {
            unreadMsgs.shift();
        }

        unreadMsgs.push("@" + sender + ": " + msg);

        lastNotification = new Notification(
            "hack.chat unread: " + unreadCounter,
            {
                body: unreadMsgs.join("\n"),
                icon: "http://i.imgur.com/AiiLnwz.png"
            }
        );

        window.navigator.vibrate(250);

        lastNotification.addEventListener("click", () => {
            unreadCounter = 0;
            unreadMsgs.length = 0;
        });
    }

    function notifyActivity(msg) {
        if (!Notification) {
            alert(
                "Desktop notifications are not available in your browser. " +
                    "Try the lastest version of Chrome or Firefox."
            );
            return;
        }

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
            return;
        }

        const dummyN = new Notification(
            "hack.chat room activity",
            {
                body: msg,
                icon: "http://i.imgur.com/AiiLnwz.png"
            }
        );

        window.navigator.vibrate([200, 200, 200]);
        activityNotifications.push(dummyN);
    }
})();
