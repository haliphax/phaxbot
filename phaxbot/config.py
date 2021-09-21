"phaxbot configuration"

# stdlib
import json
from os import getenv
from os.path import dirname, realpath

# load environment variables from .env file
from dotenv import load_dotenv; load_dotenv()

#: Whether to enable the bot
BOT = bool(getenv('BOT', True))
#: Twitch channel to join
CHANNEL = getenv('TWITCH_CHANNEL')
#: Twitch client ID
CLIENT_ID = getenv('TWITCH_CLIENT_ID')
#: Twitch client OAuth string
CLIENT_OAUTH = getenv('TWITCH_OAUTH')
#: Twitch client secret
CLIENT_SECRET = getenv('TWITCH_CLIENT_SECRET')
#: Handlers to enable
HANDLERS = getenv('MESSAGE_HANDLERS', 'avatars sr_thanks').split(' ')
#: Main directory
MY_DIR = realpath(dirname(__file__))
#: Twitch nickname to subscribe to events for
NICKNAME = getenv('TWITCH_NICKNAME')
#: Twitch client username
USERNAME = getenv('TWITCH_USERNAME')
