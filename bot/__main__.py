"Entry point"

# stdlib
from os.path import dirname, join, realpath
# 3rd party
from twitchbot import BaseBot

# start with a fresh choices file for user-selected avatars
with open(join(realpath(dirname(__file__)), '..', 'wwwroot', 'choices.json'),
		'w') as choices_file:
	choices_file.write('{}')

BaseBot().run()
