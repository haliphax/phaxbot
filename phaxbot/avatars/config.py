"phaxbot avatars configuration"

# stdlib
import json
from os import getenv

#: Filename of available avatar choices
AVATAR_CHOICES_FILE = getenv('CHOICES_FILE', '/app/data/choices.json')
#: URL to page with list of available avatars
AVATAR_LIST_URL = list_url = getenv('AVATAR_LIST_URL',
    'https://avatars.oddnetwork.org/overlay/list.html')
#: List of available avatars
AVATARS = set([])
#: Filename of avatars list
AVATARS_FILE = getenv('AVATARS_FILE', '/app/data/avatars.json')
#: Filename of list of chatters
CHATTERS_FILE = getenv('CHATTERS_FILE', '/app/data/chatters.json')
#: Filename of list of selected avatars
CHOICES_FILE = getenv('CHOICES_FILE', '/app/data/choices.json')


with open(AVATARS_FILE, 'r') as avatars_file:
    data = json.loads(avatars_file.read())
    AVATARS = set(data['avatars'])
