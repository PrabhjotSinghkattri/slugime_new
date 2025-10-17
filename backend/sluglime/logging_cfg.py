import logging
from logging.handlers import RotatingFileHandler

class HealthFilter(logging.Filter):
    def filter(self, record):
        # drop noisy health/metrics logs if any
        msg = record.getMessage()
        return not ("/health" in msg or "/favicon.ico" in msg)

def configure_logging(app):
    handler = RotatingFileHandler('sluglime.log', maxBytes=1_000_000, backupCount=3)
    handler.setLevel(logging.INFO)
    handler.addFilter(HealthFilter())
    app.logger.addHandler(handler)
