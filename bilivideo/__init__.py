import json
from pprint import pprint
import re
import sys

import requests


playinfo = json.loads(
    re.search(
        r'<script>window\.__playinfo__=(.+?)</script>',
        requests.get(f'https://www.bilibili.com/video/{sys.argv[1]}').text
    ).group(1)
)
pprint(playinfo['data'])
