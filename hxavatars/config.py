"hxAvatars configuration"

# stdlib
import json
from os import getenv
from os.path import dirname, realpath
# 3rd party
from dotenv import load_dotenv


# load environment variables from .env file
load_dotenv()

#: Filename of available avatar choices (TODO replace with websocket stuff)
AVATAR_CHOICES_FILE = getenv('CHOICES_FILE', '/app/data/choices.json')
#: URL to page with list of available avatars
AVATAR_LIST_URL = list_url = getenv('AVATAR_LIST_URL',
                  'https://avatars.oddnetwork.org/overlay/list.html')
#: List of available avatars (TODO replace with API endpoint)
AVATARS = set([])
#: Filename of avatars list (TODO replace with API endpoint)
AVATARS_FILE = getenv('AVATARS_FILE', '/app/data/avatars.json')
#: Whether to enable the bot
BOT = bool(getenv('BOT', True))
#: Twitch channel to join
CHANNEL = getenv('TWITCH_CHANNEL')
#: Filename of list of chatters (TODO replace with websocket stuff)
CHATTERS_FILE = getenv('CHATTERS_FILE', '/app/data/chatters.json')
#: Filename of list of selected avatars (TODO replace with websocket stuff)
CHOICES_FILE = getenv('CHOICES_FILE', '/app/data/choices.json')
#: Twitch client ID
CLIENT_ID = getenv('TWITCH_CLIENT_ID')
#: Twitch client OAuth string
CLIENT_OAUTH = getenv('TWITCH_OAUTH')
#: Twitch client secret
CLIENT_SECRET = getenv('TWITCH_CLIENT_SECRET')
#: Main directory
MY_DIR = realpath(dirname(__file__))
#: Twitch nickname to subscribe to events for
NICKNAME = getenv('TWITCH_NICKNAME')
#: Twitch client username
USERNAME = getenv('TWITCH_USERNAME')


with open(AVATARS_FILE, 'r') as avatars_file:
    data = json.loads(avatars_file.read())
    AVATARS = set(data['avatars'])
