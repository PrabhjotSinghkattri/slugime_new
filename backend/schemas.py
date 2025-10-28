from marshmallow import Schema, fields, validate

# ---- Report Schemas ----
class ReportCreateSchema(Schema):
    title = fields.Str(
        required=True, 
        validate=validate.Length(min=2, max=200)
    )
    category = fields.Str(required=False, allow_none=True)
    body = fields.Str(
        required=True, 
        validate=validate.Length(min=1)
    )

class MessageCreateSchema(Schema):
    body = fields.Str(
        required=True, 
        validate=validate.Length(min=1)
    )

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


# ---- Auth & User Schemas ----
class RegisterSchema(Schema):
    email = fields.Email(required=True)
    name = fields.Str(
        required=True, 
        validate=validate.Length(min=2, max=120)
    )
    password = fields.Str(
        required=True, 
        validate=validate.Length(min=6)
    )

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class UserPublicSchema(Schema):
    id = fields.Int()
    email = fields.Email()
    name = fields.Str()
    avatar_url = fields.Str(allow_none=True)
    verified = fields.Bool()


# ---- Comment & Post Schemas ----
class CommentPublicSchema(Schema):
    id = fields.Int()
    body = fields.Str()
    created_at = fields.DateTime()
    user = fields.Nested(UserPublicSchema)

class PostPublicSchema(Schema):
    id = fields.Int()
    image_url = fields.Str()
    caption = fields.Str(allow_none=True)
    created_at = fields.DateTime()
    author = fields.Nested(UserPublicSchema)
    like_count = fields.Int()
    comment_count = fields.Int()
    saved = fields.Bool()
    liked = fields.Bool()
    # Optional preview of comments
    comments = fields.List(fields.Nested(CommentPublicSchema))
