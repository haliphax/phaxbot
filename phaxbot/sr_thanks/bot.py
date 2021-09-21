"phaxbot Stream Raiders auto-responder"

# stdlib
from random import choice
# 3rd party
from twitch.chat import Message
# local
from . import config

RESPONSES = (
    'Poooound',
    'SeemsGood',
    'PogChamp',
    'RyuChamp',
)


def handle_message(msg: Message):
    "Message handler"

    if msg.sender == 'streamcaptainbot' and msg.text.find('just placed a') >= 0:
        msg.chat.send(choice(RESPONSES))

    return True
