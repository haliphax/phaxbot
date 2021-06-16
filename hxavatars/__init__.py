"hxAvatars module"

# stdlib
from sys import stderr


def echo(text: str):
    "Write to stderr like print()."

    stderr.write(f'{text}\n')
    stderr.flush()
