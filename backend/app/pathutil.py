from pathlib import Path


def getRelPath(filePath, relpath) -> str:
    return Path(filePath).parent.joinpath(relpath).absolute()


if __name__ == "__main__":
    print(getRelPath(__file__, "db/db.json"))
    print(getRelPath(__file__, "stories/db.story"))
    
