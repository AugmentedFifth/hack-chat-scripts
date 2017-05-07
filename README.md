# hack-chat-scripts

[Tampermonkey](http://tampermonkey.net/) scripts adding functionality to [hack.chat](https://hack.chat/)

## hack-chat-emojis.js

Adds emoji support to hack.chat, automatically replacing emoji shorthand codes like `:shrug:` or `:thumbsdown_tone4:` with their respective Unicode code point(s).

Also provides suggestions, so that when a user starts typign an emoji shortcode, they receive a dynamically appearing box with suggestions and previews for each one. Users can click an option in the box to autocomplete, or press the Tab key to autocomplete with the closest match.

## hack-chat-notifications.js

Provides notifications when the user receives messages or there is otherwise some room activity and the user is not focused on the hack.chat window. Provides a running total of unread messages as well as up to 4 of the last sent messages within the notification.

## hack-chat-status-indicator.js

Adds a small GUI to hack.chat that allows users to set their current status, including custom-entered text statuses and "be back by" times.

The status of a user using this script can be displayed by typing this into the chat, assuming the user's name is "user":

```
@user status
```
