from marshmallow import Schema, fields, validate

class ReportCreateSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=2, max=200))
    category = fields.Str(required=False, allow_none=True)
    body = fields.Str(required=True, validate=validate.Length(min=1))

class MessageCreateSchema(Schema):
    body = fields.Str(required=True, validate=validate.Length(min=1))

class MessagePublicSchema(Schema):
    id = fields.Int()
    body = fields.Str()
    author = fields.Str()
    created_at = fields.DateTime()

class ReportPublicSchema(Schema):
    ticket = fields.Str()
    title = fields.Str()
    category = fields.Str(allow_none=True)
    body = fields.Str()
    status = fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    messages = fields.List(fields.Nested(MessagePublicSchema))
