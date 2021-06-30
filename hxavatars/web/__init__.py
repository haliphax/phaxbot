"hxAvatars web module"

from eventlet import monkey_patch; monkey_patch()

# stdlib
import json
import logging
from os.path import dirname, join, realpath
# 3rd party
from flask import Flask
from flask_socketio import emit, SocketIO
# local
from .. import config, Global

#: The main Flask application
app = Flask('hxAvatars')
#: SocketIO application
socketio = SocketIO(app)


@socketio.on('connect')
def connect():
    app.logger.info('emitting init')
    emit('init', Global.AVATARS)


@socketio.on('ready.chatters')
def ready_chatters():
    with open(config.CHATTERS_FILE, 'r') as chatters_file:
        app.logger.info('emitting chatters')
        emit('chatters', json.loads(chatters_file.read()))


@socketio.on('ready.choices')
def ready_choices():
    with open(config.CHOICES_FILE, 'r') as choices_file:
        app.logger.info('emitting choices')
        emit('choices', json.loads(choices_file.read()))


@app.get('/api/avatars')
def get_avatars():
    return Global.AVATARS


def main():
    "Entry point."

    if config.BOT:
        from ..bot import main as bot

        bot()

    app.logger.level = logging.INFO
    app.static_folder = join(realpath(dirname(__file__)), 'static')

    socketio.run(app, host='0.0.0.0')
