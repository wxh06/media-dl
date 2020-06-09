import re

from . import bilibili


extractors = {
    'bilibili': [re.compile(r'^(?:https?://(?:www.)?bilibili.com/(?:video/)?)?(av[0-9]+|BV[0-9A-Za-z]+)'), bilibili.video]
}
