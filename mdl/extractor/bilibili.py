import json
import re

import requests


def playinfo(vid: str):
    return json.loads(
        re.search(
            r'<script>window\.__playinfo__=(.+?)</script>',
            requests.get(f'https://www.bilibili.com/video/{vid}').text
        ).group(1)
    )


def urls(vid: str):
    pi = playinfo(vid)
    q = dict(
       zip(
            pi['data']['accept_quality'],
            pi['data']['accept_description']
        )
    )
    return {
        'video': [
            (
                v['id'],
                v['base_url'],
                {'referer': 'http://bilibili.com'},
                q[v['id']]
            )
            for v in pi['data']['dash']['video']
        ],
        'audio': [
            (
                a['id'],
                a['base_url'],
                {'referer': 'http://bilibili.com'},
                q[int(str(a['id'])[-2:])]
            )
            for a in pi['data']['dash']['audio']
        ]
    }


def video(g):
    u = urls(g.group(1))
    return [(f[1], f"{g.group(1)}/{t}/{f[0]}", f[2]) for t in u for f in u[t]]
