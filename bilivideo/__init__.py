import json
import re
import subprocess
import sys

import requests


def playinfo(vid: str):
    return json.loads(
        re.search(
            r'<script>window\.__playinfo__=(.+?)</script>',
            requests.get(f'https://www.bilibili.com/video/{vid}').text
        ).group(1)
    )


def aria2(vid: str):
    pi = playinfo(vid)
    quality = dict(
        zip(
            pi['data']['accept_quality'],
            pi['data']['accept_description']
        )
    )

    for video in pi['data']['dash']['video']:
        print(quality[video['id']], video['base_url'])
        subprocess.run(
            [
                'aria2c',
                f"--dir={vid}/video/{video['id']}",
                '--header=Referer: http://bilibili.com',
                video['base_url']
            ]
        )
    for audio in pi['data']['dash']['audio']:
        subprocess.run(
            [
                'aria2c',
                f"--dir={vid}/audio/{audio['id']}",
                '--referer=http://bilibili.com',
                audio['base_url']
            ]
        )


if __name__ == '__main__':
    aria2(sys.argv[1])
