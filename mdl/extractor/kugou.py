import json
from urllib.request import urlopen
import uuid


def music(match):
    res = json.loads(
        urlopen(
            'https://wwwapi.kugou.com/yy/index.php?r=play/getdata'
            f'&hash={match.group(1)}&mid={uuid.uuid4().hex}'
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
