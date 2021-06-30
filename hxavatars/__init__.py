"hxAvatars module"

# stdlib
import json

from . import config


class Global:
    #: Available avatars
    AVATARS: dict = None


with open(config.AVATARS_FILE, 'r') as avatars_file:
    Global.AVATARS = json.loads(avatars_file.read())
