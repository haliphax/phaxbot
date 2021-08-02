"phaxbot chat overlay web endpoints"

# stdlib
from os.path import dirname, join, realpath
# 3rd party
from flask import Blueprint
# local
from ...web import app

my_dir = realpath(join(dirname(__file__)))
bp = Blueprint('chat', __name__, join(my_dir, 'static'))


app.register_blueprint(bp, url_prefix='/chat_overlay')
