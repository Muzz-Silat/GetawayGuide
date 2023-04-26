from django import template

register = template.Library()

@register.filter
def split(value, key):
    if value is None:
        return []
    return value.split(key)
