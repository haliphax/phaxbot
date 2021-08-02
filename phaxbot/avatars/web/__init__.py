"phaxbot avatars web endpoints"

# stdlib
import json
from os.path import dirname, join, realpath
# 3rd party
from flask import Blueprint
from flask_socketio import emit
# local
from ...web import app, socketio
from .. import config, Global

my_dir = realpath(join(dirname(__file__)))
bp = Blueprint('avatars', __name__, join(my_dir, 'static'))


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


@bp.get('/api/list')
def get_avatars():
    return Global.AVATARS


app.register_blueprint(bp, url_prefix='/avatars')
