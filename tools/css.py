"Spritesheet CSS animation generator tool"

# 3rd party
import click

@click.group()
def main():
	"Spritesheet CSS utilities."

@main.command()
@click.option('-a', '--avatar', type=str, required=True)
@click.option('-w', '--width', type=int, required=True)
@click.option('-h', '--height', type=int, required=True)
def base(avatar: str, width: int, height: int):
	"Generate base CSS stylesheet data for given avatar."

	print(f'''
.avatar.{avatar} {{
\twidth: {width}px;
\theight: {height}px;
\tbackground-image: url(avatar.gif);
\tanimation-timing-function: steps(1, end);
\tanimation-iteration-count: infinite;
}}''')


@main.command()
@click.option('-a', '--avatar', type=str, required=True)
@click.option('-n', '--name', type=str, required=True)
@click.option('-w', '--width', type=int, required=True)
@click.option('-h', '--height', type=int, required=True)
@click.option('-f', '--frames', type=str, required=True)
@click.option('-d', '--duration', type=int, default=1)
def keyframes(avatar: str, name: str, width: int, height: int, frames: str,
			  duration: int):
	"Generate CSS keyframes for the given spritesheet properties."

	parsed_frames = []

	for token in frames.split(' '):
		if '-' in token:
			bounds = [int(v) for v in token.split('-')]
			step = 1 if bounds[0] < bounds[1] else -1
			parsed_frames += [r for r in range(bounds[0], bounds[1] + 1, step)]
		else:
			parsed_frames.append(token)

	print(f'''.avatar.{avatar}.{name} {{
\tanimation-name: {avatar}-{name};
\tanimation-duration: {duration}s;
\tbackground-position: calc({frames[0]} * {width}px * -1) 0;
}}

@keyframes {avatar}-{name} {{''')

	count = 0
	length = len(parsed_frames)

	for f in parsed_frames:
		pct = round(count / length * 100, 4)
		print(
			f'\t{pct}% {{ background-position: '
			f'calc({f} * {width}px * -1) 0; }}')
		count += 1

	print('}')


if __name__ == '__main__':
	main()
