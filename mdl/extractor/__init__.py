import re

from . import bilibili


extractors = {
    'bilibili': [re.compile(r'(av[0-9]|BV[0-9A-Za-z])'), bilibili.video]
}
