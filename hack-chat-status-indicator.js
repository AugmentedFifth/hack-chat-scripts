// ==UserScript==
// @name         hack.chat status indicator
// @namespace    A4
// @version      0.1.0
// @description  Allows hack.chat users to set their status, at, afk, asleep, etc.
//               and automatically reply to users that prompt their status.
// @author       A4
// @match        https://hack.chat/?*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    "use strict";

    let currentStatus = "At";
    let sendWhenAtStatus = true;
    let backByStatus = false;
    const statuses = ["At", "Custom", "AFK", "Away", "Sleeping"];

    const ddNode = document.createElement("div");
    ddNode.innerHTML = `
    <select id="hour">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
    </select>
    <select id="minute">
        <option value="00">00</option>
        <option value="05">05</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="30">30</option>
        <option value="35">35</option>
        <option value="40">40</option>
        <option value="45">45</option>
        <option value="50">50</option>
        <option value="55">55</option>
    </select>
    <input type="text" name="customText" id="customText" value="">
    <ul id="statusList">
        <li>
            <button id="backBy" type="button">Be back by</button>
        </li>
        <li>
            <button id="sendWhenAt" type="button">Sending when at</button>
        </li>
        <li>
            <button id="At" type="button">At</button>
        </li>
        <li>
            <button id="Custom" type="button">Custom</button>
        </li>
        <li>
            <button id="AFK" type="button">AFK</button>
        </li>
        <li>
            <button id="Away" type="button">Away</button>
        </li>
        <li>
            <button id="Sleeping" type="button">Sleeping</button>
        </li>
    </ul>
    <div id="Menu">
        <p>Status</p>
    </div>`;
    ddNode.setAttribute("id", "myContainer");
    document.body.appendChild(ddNode);

    // Activate the newly added buttons.
    document.getElementById("backBy").addEventListener(
        "click", clickAction, false
    );
    document.getElementById("sendWhenAt").addEventListener(
        "click", clickAction, false
    );
    document.getElementById("At").addEventListener(
        "click", clickAction, false
    );
    document.getElementById("Custom").addEventListener(
        "click", clickAction, false
    );
    document.getElementById("AFK").addEventListener(
        "click", clickAction, false
    );
    document.getElementById("Away").addEventListener(
        "click", clickAction, false
    );
    document.getElementById("Sleeping").addEventListener(
        "click", clickAction, false
    );

    // Status is "At" by default, and `send when at`
    // is also on by default, so this reflects that.
    document.getElementById("At").style.background = "#a6e22e";
    document.getElementById("At").style.color = "#272822";
    document.getElementById("sendWhenAt").style.background = "#a6e22e";
    document.getElementById("sendWhenAt").style.color = "#272822";

    function clickAction(ddEvent) {
        if (
            ddEvent.target.id.length > 0 &&
            ddEvent.target.id !== "sendWhenAt" &&
            ddEvent.target.id !== "backBy"
        ) {
            currentStatus = ddEvent.target.id;
            document.getElementById(ddEvent.target.id).style.background = "#a6e22e";
            document.getElementById(ddEvent.target.id).style.color = "#272822";
            statuses.forEach(status => {
                if (status !== ddEvent.target.id) {
                    document.getElementById(status).style.background = "#272822";
                    document.getElementById(status).style.color = "#a6e22e";
                }
            });
        } else if (ddEvent.target.id === "sendWhenAt") {
            const sendWhenAt = document.getElementById("sendWhenAt");
            if (sendWhenAtStatus) {
                sendWhenAt.style.background = "#272822";
                sendWhenAt.style.color = "#a6e22e";
                sendWhenAt.innerHTML = '<span style="font-size:1;">Not sending when at</span>';
            } else {
                sendWhenAt.style.background = "#a6e22e";
                sendWhenAt.style.color = "#272822";
                sendWhenAt.innerHTML = "Sending when at";
            }
            sendWhenAtStatus = !sendWhenAtStatus;
        } else if (ddEvent.target.id === "backBy") {
            const backBy = document.getElementById("backBy");
            if (backByStatus) {
                backBy.style.background = "#272822";
                backBy.style.color = "#a6e22e";
            } else {
                backBy.style.background = "#a6e22e";
                backBy.style.color = "#272822";
            }
            backByStatus = !backByStatus;
        }
    }

    function statusSend() {
        let suffix;
        if (currentStatus === "At" && sendWhenAtStatus) {
            suffix = " should be at the keyboard";
        } else if (currentStatus === "Custom") {
            suffix = "is " + document.getElementById("customText").value;
            suffix = " " + suffix.trim();
            if (".,!?".indexOf(suffix[suffix.length - 1]) !== -1) {
                suffix = suffix.slice(0, -1);
            }
        } else if (currentStatus === "AFK") {
            suffix = " is away from the keyboard";
        } else if (currentStatus === "Away") {
            suffix = " is currently away";
        } else if (currentStatus === "Sleeping") {
            suffix = " is currently asleep";
        }

        if (!suffix) {
            return;
        }

        let text = myNick.split("#")[0] + suffix;
        if (backByStatus && currentStatus !== "At") {
            const h = document.getElementById("hour");
            const m = document.getElementById("minute");
            text +=
                ", they should be back around " +
                    h.options[h.selectedIndex].value +
                    ":" +
                    m.options[m.selectedIndex].value;
        }
        text += ".";
        send({ cmd: "chat", text: text });
    }

    const pushMessageOrig = pushMessage;
    pushMessage = args => {
        pushMessageOrig(args);

        if (args.nick !== "*" && args.nick !== "!") {
            if (args.text.indexOf("@" + myNick.split("#")[0] + " status") !== -1) {
                statusSend();
            }
        }
    };

    GM_addStyle(`
        #myContainer {
            list-style: none;
            font-weight: bold;
            margin-bottom: 10px;
            float: left;
            width: 100px;
            min-width: 50px;
            max-width: 550px;
            height: 260px;
            position: fixed;
            left: 2%;
            bottom: 40px;
            padding-bottom: 5px;
            z-index: 5;
        }

        #myContainer ul {
            background: #272822;
            background: rgba(255, 255, 255, 0);
            list-style: none;
            position: absolute;
            left: -9999px;
            bottom: 15px;
        }

        #myContainer li {
            padding-top: 1px;
            list-style: none;
            float: none;
            opacity: 0.36;
        }

        #myContainer li:hover {
            opacity: 0.75;
        }

        #myContainer li button {
            width: 100%;
            max-height: 37px;
            padding-top: 2px;
            border-radius: 5px;
            font-family: "DejaVu Sans Mono", monospace;
            margin: 0 auto;
            color: #a6e22e;
            background: #272822;
            border-color: #000000;
        }

        #myContainer:hover ul {
            left: 0px;
        }

        #myContainer li button:hover {
            text-decoration: underline;
        }

        #myContainer select {
            width: 46%;
            padding: 2px 2px 2px 2px;
            border-radius: 2px;
            font-family: "DejaVu Sans Mono", monospace;
            color: #a6e22e;
            background: #272822;
            border-color: #000000;
            position: relative;
            left: -9999px;
            bottom: -10px;
            opacity: 0.36;
        }

        #myContainer:hover select {
            left: 0px;
        }

        #myContainer select:hover {
            opacity: 0.75;
        }

        #myContainer input {
            width: 92%;
            padding: 2px 2px 2px 2px;
            border-radius: 2px;
            font-family: "DejaVu Sans Mono", monospace;
            color: #a6e22e;
            background: #272822;
            border: 2px solid black;
            position: relative;
            left: -9999px;
            bottom: -15px;
            opacity: 0.36;
        }

        #myContainer:hover input {
            left: 0px;
        }

        #myContainer input:hover {
            opacity: 0.75;
        }

        #Menu {
            position: absolute;
            bottom: 0px;
            padding-bottom: 0px;
            background-color: #a6e22e;
            opacity: 0.36;
            border-radius: 3px;
            height: 24px;
            width: 100px;
            min-width: 50px;
            max-width: 550px;
            text-align: center;
            margin-left: 2%;
        }

        #Menu:hover {
            opacity: 0.75;
        }

        #Menu p {
            position: relative;
            bottom: 6px;
            text-align: center;
            color: #272822;
        }
    `);
})();
