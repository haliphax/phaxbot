"phaxbot bot module"

# stdlib
from importlib import import_module
from os import O_PATH
from rx.core.typing import Observer
# 3rd party
from twitch import Chat, Helix
from twitch.chat import Message
# local
from .. import config
from ..web import app
from .commands import *

message_handlers = []

# Twitch API client
helix = Helix(config.CLIENT_ID, config.CLIENT_SECRET)
user = helix.user(config.USERNAME)

for mod in config.HANDLERS:
    module = import_module(f'..{mod}.bot', __name__)
    message_handlers.append(getattr(module, 'handle_message'))


class MessageHandler(Observer):

    "Message handling Observer"

    def on_completed(_):
        pass

    def on_error(_):
        pass

    def on_next(self, msg: Message):
        "Handle next message in the sequence."

        print(f'<{msg.sender}> {msg.text}')

        for handler in message_handlers:
            if not handler(msg):
                break


def main():
    # Chat connection
    chat = Chat(channel=config.CHANNEL, nickname=config.NICKNAME,
                oauth=config.CLIENT_OAUTH, helix=helix)

    # commands
    for cmd in [c for c in dir(commands) if c[0] != '_']:
        app.logger.info(f'Loading command: {cmd}')
        command = getattr(commands, cmd)
        message_handlers.append(command.handle_message)

    # Subscribe to messages
    chat.subscribe(MessageHandler())
