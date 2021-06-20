"Stream avatars bot module"

from eventlet import monkey_patch; monkey_patch()

# stdlib
import json
from os.path import exists
from rx.core.typing import Observer
# 3rd party
from twitch import Chat, Helix
from twitch.chat import Message
# local
from .. import config, MessageHandler
# local
from .. import config
from ..web import app, socketio


class MessageHandler(Observer):

    "Message handling Observer"

    chatters = set([])

    def on_completed(_):
        pass

    def on_error(_):
        pass

    def on_next(self, msg: Message):
        "Handle next message in the sequence."

        app.logger.debug(f'<{msg.sender}> {msg.text}')

        if msg.sender not in self.chatters:
            self.chatters.add(msg.sender)
            chatters_list = list(self.chatters)

            with open(config.CHATTERS_FILE, 'w') as chatters_file:
                chatters_file.write(json.dumps(chatters_list))

            app.logger.info('emitting chatters')
            socketio.server.emit('chatters', chatters_list)

        txt = msg.text.strip()

        if txt == '!avatar':
            # TODO rate limiting
            msg.chat.send(
                'Available avatars: '
                'https://avatars.oddnetwork.org/overlay/list.html '
                '-- Use !avatar <name> to assign one to yourself.')
        elif txt.startswith('!avatar '):
            avatar = txt[len('!avatar '):].strip()

            if avatar not in config.AVATARS:
                msg.chat.send('Unknown avatar. Use !avatar by itself for a '
                              'list of available choices.')

                return

            msg.chat.send('Avatar selected. There may be some delay before '
                          'your selection is reflected on stream.')

            choices = None

            if not exists(config.CHOICES_FILE):
                choices = {}
            else:
                with open(config.CHOICES_FILE, 'r') as choices_file:
                    choices = json.loads(choices_file.read())

            choices[msg.sender] = avatar
            choices_json = json.dumps(choices)
            app.logger.info('emitting choices')
            socketio.server.emit('choices', choices)

            with open(config.CHOICES_FILE, 'w') as choices_file:
                choices_file.write(choices_json)


def main():
    # Twitch API client
    helix = Helix(config.CLIENT_ID, config.CLIENT_SECRET)

    # Chat connection
    chat = Chat(channel=config.CHANNEL, nickname=config.NICKNAME,
                oauth=config.CLIENT_OAUTH, helix=helix)

    # Subscribe to messages
    chat.subscribe(MessageHandler())


if __name__ == '__main__':
    main()
