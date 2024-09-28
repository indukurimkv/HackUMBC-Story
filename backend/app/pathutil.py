from pathlib import Path


def getRelPath(filePath, relpath):
    return Path(filePath).parent.joinpath(relpath).absolute()


if __name__ == "__main__":
    print(getRelPath(__file__, "db/db.json"))
