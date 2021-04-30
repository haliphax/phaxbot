"Chat bot for avatar self-service"

# stdlib
import json
from os import environ
from os.path import exists
# 3rd party
from twitchbot import Command

AVATARS = set([])
MY_DIR = realpath(dirname(__file__))

avatars_fn = environ.get('AVATARS_FILE', None)
choices_fn = environ.get('CHOICES_FILE', None)
list_url = environ.get('AVATAR_LIST_URL',
					   'https://avatars.oddnetwork.org/overlay/list.html')

if avatars_fn is None:
	avatars_fn = '/app/data/avatars.json'

if choices_fn is None:
	choices_fn = '/app/data/choices.json'

with open(avatars_fn, 'r') as avatars_file:
	data = json.loads(avatars_file.read())
	AVATARS = set(data['avatars'])


@Command('avatar')
async def cmd_avatar(msg, *args):
	if not args:
		await msg.reply(f'Available avatars: {list_url} -- Use !avatar <name> '
						'to assign one to yourself.')

		return

	avatar = args[0].lower()

	if avatar not in AVATARS:
		await msg.reply('Unknown avatar. Use !avatar by itself for a list '
						'of available choices.')

		return

	await msg.reply('Avatar selected. There may be some delay before your '
					'selection is reflected on stream.')

	choices = None

	if not exists(choices_fn):
		with open(choices_fn, 'w') as choices_file:
			choices_file.write('{}')
			choices = {}
	else:
		with open(choices_fn, 'r') as choices_file:
			choices = json.loads(choices_file.read())

	with open(choices_fn, 'w') as choices_file:
		choices[msg.author] = avatar
		choices_file.write(json.dumps(choices))
