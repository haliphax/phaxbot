"phaxbot avatars chat commands"

# stdlib
import json
from os.path import exists
# 3rd party
from twitch.chat import Message
# local
from ..web import app, socketio
from . import config

chatters = set([])


def handle_message(msg: Message):
    "Message handler"

    if msg.sender not in chatters:
        chatters.add(msg.sender)
        chatters_list = list(chatters)

        with open(config.CHATTERS_FILE, 'w') as chatters_file:
            chatters_file.write(json.dumps(chatters_list))

        app.logger.info('emitting chatters')
        socketio.server.emit('chatters', chatters_list)

    txt = msg.text.strip()

    if txt == '!avatar':
        # TODO rate limiting
        msg.chat.send(
            'Available avatars: https://avatars.oddnetwork.org -- Use '
            '!avatar <name> to assign one to yourself.')
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
    else:
        return True

    return False
