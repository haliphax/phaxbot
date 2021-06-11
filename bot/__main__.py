"Stream avatars bot module entry point"

# stdlib
import json
from os import getenv
from os.path import dirname, exists, realpath
# 3rd party
from dotenv import load_dotenv
from twitch import Chat, Helix
from twitch.chat import Message

# load environment variables from .env file
load_dotenv()

# settings
CHANNEL = getenv('TWITCH_CHANNEL')
NICKNAME = getenv('TWITCH_NICKNAME')
CLIENT_OAUTH = getenv('TWITCH_OAUTH')
CLIENT_ID = getenv('TWITCH_CLIENT_ID')
CLIENT_SECRET = getenv('TWITCH_CLIENT_SECRET')
USERNAME = getenv('TWITCH_USERNAME')

# constants
AVATARS = set([])
MY_DIR = realpath(dirname(__file__))

avatars_fn = getenv('AVATARS_FILE', '/app/data/avatars.json')
chatters_fn = getenv('CHATTERS_FILE', '/app/data/chatters.json')
choices_fn = getenv('CHOICES_FILE', '/app/data/choices.json')
list_url = getenv('AVATAR_LIST_URL',
                  'https://avatars.oddnetwork.org/overlay/list.html')

# globals
chatters = set([])


with open(avatars_fn, 'r') as avatars_file:
    data = json.loads(avatars_file.read())
    AVATARS = set(data['avatars'])


def handle_message(msg: Message):
    global chatters

    if msg.sender not in chatters:
        with open(chatters_fn, 'w') as chatters_file:
            chatters.add(msg.sender)
            print(list(chatters))
            chatters_file.write(json.dumps(list(chatters)))

    txt = msg.text.strip()

    if txt == '!avatar':
        # TODO rate limiting
        msg.chat.send(
            'Available avatars: '
            'https://avatars.oddnetwork.org/overlay/list.html '
            '-- Use !avatar <name> to assign one to yourself.')
    elif txt.startswith('!avatar '):
        avatar = txt[len('!avatar '):]

        if avatar not in AVATARS:
            msg.chat.send('Unknown avatar. Use !avatar by itself for a list '
                          'of available choices.')

            return

        msg.chat.send('Avatar selected. There may be some delay before your '
                      'selection is reflected on stream.')

        choices = None

        if not exists(choices_fn):
            choices = {}
        else:
            with open(choices_fn, 'r') as choices_file:
                choices = json.loads(choices_file.read())

        with open(choices_fn, 'w') as choices_file:
            choices[msg.sender] = avatar
            choices_file.write(json.dumps(choices))


def main():
    # Twitch API client
    helix = Helix(CLIENT_ID, CLIENT_SECRET)

    # Chat connection
    chat = Chat(channel=CHANNEL, nickname=NICKNAME, oauth=CLIENT_OAUTH,
                helix=helix)

    # Subscribe to messages
    chat.subscribe(handle_message)


if __name__ == '__main__':
    main()
