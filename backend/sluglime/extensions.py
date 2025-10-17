from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_talisman import Talisman

_db = SQLAlchemy()
_ma = Marshmallow()
_cors = CORS()
_talisman = Talisman()

db = _db
ma = _ma
cors = _cors
talisman = _talisman