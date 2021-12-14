"phaxbot chat overlay web endpoints"

# stdlib
from os.path import dirname, join, realpath
# 3rd party
from flask import Blueprint
import requests
# local
from ... import config
from ...web import app
from ...bot import user

my_dir = realpath(dirname(__file__))
bp = Blueprint('chat', __name__, join(my_dir, 'static'))


@bp.get('/init')
def init():
    my_badges = requests.get(
        f'https://badges.twitch.tv/v1/badges/channels/{user.id}/display') \
        .json()['badge_sets']
    global_badges = requests.get(
        f'https://badges.twitch.tv/v1/badges/global/display') \
        .json()['badge_sets']

    return {
        'badges': {
            'channel': my_badges,
            'global': global_badges,
        },
        'user': {
            'username': config.USERNAME,
        },
    }

app.register_blueprint(bp, url_prefix='/chat_overlay')
