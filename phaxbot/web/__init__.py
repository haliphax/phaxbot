"phaxbot web module"

from eventlet import monkey_patch; monkey_patch()

# stdlib
from importlib import import_module
import logging
from os.path import dirname, join, realpath
# 3rd party
from flask import Flask
from flask_socketio import SocketIO
# local
from .. import config

#: The main Flask application
app = Flask(__name__)
#: SocketIO application
socketio = SocketIO(app)

MODULES = ('avatars_new', 'chat_overlay',)


for mod in MODULES:
    import_module(f'..{mod}.web', __name__)


def main():
    "Entry point."

    app.logger.level = logging.INFO
    app.static_folder = join(realpath(dirname(__file__)), 'static')

    if config.BOT:
        from ..bot import main as bot

        app.logger.info('Starting bot')
        bot()

    app.logger.info('Starting web server')
    socketio.run(app, host='0.0.0.0')
