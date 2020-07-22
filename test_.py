import os
import shutil
import unittest

import mdl


class TestDownloader(unittest.TestCase):

    def test_aria2(self):
        self.assertIs(
            mdl.downloader.downloaders['aria2'],
            mdl.downloader.aria2.aria2c
        )


class TestBiliVideo(unittest.TestCase):

    def assertion(self, vid, videos=1, audios=1):
        self.assertEqual(set(os.listdir(vid)), {'audio', 'video'})
        self.assertGreaterEqual(len(os.listdir(f'{vid}/video')), videos)
        self.assertGreaterEqual(len(os.listdir(f'{vid}/audio')), audios)
        shutil.rmtree(vid)

    def test_av(self):
        mdl.download('av7')
        self.assertion('av7')

    def test_av_URLs(self):
        for url in [
            'https://www.bilibili.com/video/av7',
            'https://www.bilibili.com/av7',
            'https://bilibili.com/video/av7',
            'http://www.bilibili.com/video/av7',
            'http://bilibili.com/video/av7'
        ]:
            self.assertTrue(mdl.extract(url))

    def test_BV(self):
        mdl.download('BV1XW411M7Gu')
        self.assertion('BV1XW411M7Gu', 4, 2)

    def test_BV_URLs(self):
        for url in [
            'https://www.bilibili.com/video/BV1xx411c7m9',
            'https://www.bilibili.com/BV1xx411c7m9',
            'https://bilibili.com/video/BV1xx411c7m9',
            'http://www.bilibili.com/video/BV1xx411c7m9',
            'http://bilibili.com/video/BV1xx411c7m9'
        ]:
            self.assertTrue(mdl.extract(url))

    def test_aria2(self):
        mdl.download('av7', 'aria2')
        self.assertion('av7')

    def test_aria2c(self):
        mdl.download('av7', mdl.downloader.aria2.aria2c)
        self.assertion('av7')


class TestKugouMusic(unittest.TestCase):

    def test_aria2(self):
        mdl.download(
            'https://www.kugou.com/song/#hash='
            '5B40301A02B4A431F8CEEACBC58C50F0'
        )


if __name__ == '__main__':
    unittest.main()
