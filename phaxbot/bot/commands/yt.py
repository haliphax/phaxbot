"!yt command"

# stdlib
from os import getenv
# 3rd party
from twitch.chat import Message


class config:
    URL_FILE = getenv('YT_URL_FILE')


def handle_message(msg: Message):
    "Message handler"

    if config.URL_FILE is None:
        return True

    txt = msg.text.strip()

    if txt != '!yt':
        return True

    with open(config.URL_FILE, 'r') as f:
        msg.chat.send(f.read())

    return True
