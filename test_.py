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
        mdl.download('https://www.bilibili.com/video/av7')
        self.assertion('av7')
        mdl.download('https://www.bilibili.com/av7')
        self.assertion('av7')
        mdl.download('https://bilibili.com/video/av7')
        self.assertion('av7')
        mdl.download('http://www.bilibili.com/video/av7')
        self.assertion('av7')
        mdl.download('http://bilibili.com/video/av7')
        self.assertion('av7')

    def test_BV(self):
        mdl.download('BV1XW411M7Gu')
        self.assertion('BV1XW411M7Gu', 4, 2)

    def test_BV_URLs(self):
        mdl.download('https://www.bilibili.com/video/BV1xx411c7m9')
        self.assertion('BV1xx411c7m9')
        mdl.download('https://www.bilibili.com/BV1xx411c7m9')
        self.assertion('BV1xx411c7m9')
        mdl.download('https://bilibili.com/video/BV1xx411c7m9')
        self.assertion('BV1xx411c7m9')
        mdl.download('http://www.bilibili.com/video/BV1xx411c7m9')
        self.assertion('BV1xx411c7m9')
        mdl.download('http://bilibili.com/video/BV1xx411c7m9')
        self.assertion('BV1xx411c7m9')

    def test_aria2(self):
        mdl.download('av7', 'aria2')
        self.assertion('av7')

    def test_aria2c(self):
        mdl.download('av7', mdl.downloader.aria2.aria2c)
        self.assertion('av7')


class TestKugouMusic(unittest.TestCase):

    def test_aria2(self):
        mdl.download('https://www.kugou.com/song/#hash=7C465E76DF08FFB597501B9B94C48390')


if __name__ == '__main__':
    unittest.main()
