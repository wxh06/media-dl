import os
import unittest

from bilivideo import aria2


class TestBiliVideo(unittest.TestCase):

    def test_aria2(self):
        aria2('av7')
        self.assertEqual(set(os.listdir('av7')), {'audio', 'video'})
        self.assertGreater(len(os.listdir('av7/video')), 0)
        self.assertGreater(len(os.listdir('av7/audio')), 0)


if __name__ == '__main__':
    unittest.main()
