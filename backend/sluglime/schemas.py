from marshmallow import Schema, fields

class ReportCreateSchema(Schema):
    title = fields.Str(required=True)
    category = fields.Str(required=False, allow_none=True)
    body = fields.Str(required=True)

class ReportPublicSchema(Schema):
    ticket = fields.Str()
    title = fields.Str()
    category = fields.Str(allow_none=True)
    status = fields.Str()
    created_at = fields.DateTime()

class MessageSchema(Schema):
    role = fields.Str()
    body = fields.Str()
    created_at = fields.DateTime()