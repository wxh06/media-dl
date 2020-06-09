import json
from urllib.request import urlopen


def music(match):
    res = json.loads(
        urlopen(
            'https://wwwapi.kugou.com/yy/index.php?r=play/getdata'
            f'&hash={match.group(1)}&mid=d41d8cd98f00b204e9800998ecf8427e'
        ).read()
    )
    assert res['status'] and not res['err_code']
    return [
        [
            res['data']['play_url'],
            f"{res['data']['album_id']} {res['data']['album_name']}/"
            f"{res['data']['audio_name']}"
        ]
    ]
