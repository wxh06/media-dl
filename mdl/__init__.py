import re
import sys

from . import extractor, downloader


def extract(url: str):
    for e in extractor.extractors:
        match = re.search(extractor.extractors[e][0], url)
        if match:
            return extractor.extractors[e][1](match)


def download(url: str, dler: str = downloader.aria2.aria2c):
    for u in extract(url):
        try:
            dler(*u)
        except TypeError:
            downloader.downloaders[dler](*u)


if __name__ == '__main__':
    download(sys.argv[1])
