"hxAvatars web module entry point"

# stdlib
import logging
from os.path import dirname, join, realpath
# local
from . import app, socketio


def main():
    "Entry point."

    from ..bot.__main__ import main as bot

    bot()
    app.logger.level = logging.INFO
    app.static_folder = join(realpath(dirname(__file__)), 'static')
    socketio.run(app, host='0.0.0.0')


if __name__ == '__main__':
    main()
