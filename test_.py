import os
import unittest

import mdl


class TestDownloader(unittest.TestCase):

    def test_aria2(self):
        self.assertIs(
            mdl.downloader.downloaders['aria2'],
            mdl.downloader.aria2.aria2c
        )


class TestBiliVideo(unittest.TestCase):

    def assertion(self, vid):
        self.assertEqual(set(os.listdir('av7')), {'audio', 'video'})
        self.assertGreater(len(os.listdir('av7/video')), 0)
        self.assertGreater(len(os.listdir('av7/audio')), 0)

    def test_default(self):
        mdl.download('av7')
        self.assertion('av7')

    def test_aria2(self):
        mdl.download('av7', 'aria2')
        self.assertion('av7')

    def test_aria2c(self):
        mdl.download('av7', mdl.downloader.aria2.aria2c)
        self.assertion('av7')


if __name__ == '__main__':
    unittest.main()
