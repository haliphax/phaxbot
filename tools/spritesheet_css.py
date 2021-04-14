"Spritesheet CSS animation generator tool"

# 3rd party
import click


@click.command()
@click.option('-n', '--name', type=str, required=True)
@click.option('-w', '--width', type=int, required=True)
@click.option('-h', '--height', type=int, required=True)
@click.option('-l', '--left', type=str, required=True)
@click.option('--left-duration', type=int, default=1)
@click.option('-r', '--right', type=str, required=True)
@click.option('--right-duration', type=int, default=1)
@click.option('--idle-left', type=str, required=True)
@click.option('--idle-left-duration', type=int, default=1)
@click.option('--idle-right', type=str, required=True)
@click.option('--idle-right-duration', type=int, default=1)
def process(name: str, width: int, height: int, left: str, left_duration: int,
			right: str, right_duration: int, idle_left: str,
			idle_left_duration: int, idle_right: str,
			idle_right_duration: int):
	"Generate CSS for the given spritesheet properties."

	def output_keyframes(frames):
		count = 0
		length = len(frames)
		output = []

		for f in frames:
			pct = round(count / length * 100, 4)
			output.append(
				f'\t{pct}% {{ background-position: '
				f'calc({f} * {width}px * -1) 0; }}')
			count += 1

		return '\n'.join(output)

	def get_range(val):
		if '-' not in val:
			return val.split(' ')

		bounds = [int(v) for v in val.split('-')]
		step = 1 if bounds[0] < bounds[1] else -1

		return [r for r in range(bounds[0], bounds[1] + 1, step)]

	left_frames = get_range(left)
	right_frames = get_range(right)
	lidle_frames = get_range(idle_left)
	ridle_frames = get_range(idle_right)

	print(f'''
.avatar.{name} {{
\twidth: {width}px;
\theight: {height}px;
\tbackground-image: url(avatar.gif);
\tanimation-timing-function: steps(1, end);
\tanimation-iteration-count: infinite;
}}
.avatar.{name}.left {{
\tbackground-position: calc({lidle_frames[0]} * {width}px * -1) 0;
\tanimation-duration: {idle_left_duration}s;
\tanimation-name: {name}-idle-left;
}}
.avatar.{name}.walking.left {{
\tanimation-name: {name}-walking-left;
\tanimation-duration: {left_duration}s;
\tbackground-position: calc({left_frames[0]} * {width}px * -1) 0;
}}
.avatar.{name}.right {{
\tbackground-position: calc({lidle_frames[0]} * {width}px * -1) 0;
\tanimation-duration: {idle_right_duration}s;
\tanimation-name: {name}-idle-right;
}}
.avatar.{name}.walking.right {{
\tanimation-name: {name}-walking-right;
\tanimation-duration: {right_duration}s;
\tbackground-position: calc({right_frames[0]} * {width}px * -1) 0;
}}

@keyframes {name}-idle-left {{
{output_keyframes(lidle_frames)}
}}
@keyframes {name}-idle-right {{
{output_keyframes(ridle_frames)}
}}
@keyframes {name}-walking-left {{
{output_keyframes(left_frames)}
}}
@keyframes {name}-walking-right {{
{output_keyframes(right_frames)}
}}
''')


if __name__ == '__main__':
	process()
