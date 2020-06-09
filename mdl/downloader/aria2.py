import subprocess


def aria2c(url, dir, kwargs={}):
    args = []
    if 'referer' in kwargs:
        args.append(f"--referer={kwargs['referer']}")
    subprocess.run(
        [
            'aria2c',
            f'--dir={dir}',
            *args,
            url
        ]
    )
