from django import template
import json

register = template.Library()

@register.filter
def json_decode(value):
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return []
