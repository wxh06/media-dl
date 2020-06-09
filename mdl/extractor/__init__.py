import re

from . import bilibili, kugou


extractors = {
    'bilibili': [
        re.compile(
            r'^(?:https?://(?:www\.)?bilibili\.com/(?:video/)?)?'
            r'(av[0-9]+|BV[0-9A-Za-z]+)'
        ),
        bilibili.video
    ],
    'kugou': [
        re.compile(r'^https?://(?:www\.)?kugou.com/song/#hash=([0-9A-Z]{32})'),
        kugou.music
    ]
}
