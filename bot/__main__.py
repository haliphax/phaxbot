"Entry point"

# stdlib
from os.path import dirname, join, realpath
# 3rd party
from twitchbot import BaseBot
# local
from . import choices_fn

# start with a fresh choices file for user-selected avatars
with open(choices_fn, 'w') as choices_file:
	choices_file.write('{}')

BaseBot().run()
