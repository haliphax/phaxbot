"Chat bot for avatar self-service"

# stdlib
import json
from os.path import dirname, exists, join, realpath
# 3rd party
from twitchbot import Command

AVATARS = set([])
MY_DIR = realpath(dirname(__file__))


with open(join(MY_DIR, '..', 'wwwroot', 'avatars.json'), 'r') as avatars_file:
	data = json.loads(avatars_file.read())
	AVATARS = set(sorted(data['avatars']))


@Command('avatar')
async def cmd_avatar(msg, *args):
	if not args:
		await msg.reply(f'Available avatars: {", ".join(AVATARS)}')

		return

	avatar = args[0].lower()

	if avatar not in AVATARS:
		await msg.reply('Unknown avatar. Use !avatar by itself for a list '
						'of available choices.')

		return

	await msg.reply('Avatar selected. There may be some delay before your '
					'selection is reflected on stream.')

	choices_filename = join(MY_DIR, '..', 'wwwroot', 'choices.json')
	choices = None

	if not exists(choices_filename):
		with open(choices_filename, 'w') as choices_file:
			choices_file.write('{}')
			choices = {}
	else:
		with open(choices_filename, 'r') as choices_file:
			choices = json.loads(choices_file.read())

	with open(choices_filename, 'w') as choices_file:
		choices[msg.author] = avatar
		choices_file.write(json.dumps(choices))
