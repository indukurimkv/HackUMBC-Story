from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from src.schema.story import Story

from typing import Union

from src.db import DBClient

from src.utils.pathutil import getRelPath

from src.doc import get_doc_string


class StoryApp(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.locked_stories = set()

    
app = StoryApp(description=get_doc_string())


# Setup up CORS to allow react to access the api
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# client to handle database
db_client = DBClient(getRelPath(__file__, "db/db.json"))

@app.post("/story")
async def create_story(story: Story):
    if story.id == "":
        story.id = uuid4().hex
    
    if db_client.checkStoryExists(story.id):
        return {"status": "already_exists"}

    db_client.story_ID_table.insert({"ID": story.id})
    num_stories = db_client.getCount()
    if num_stories < 0:
        db_client.setCount(1)
    else:
        db_client.setCount(num_stories + 1)

    with open(getRelPath(__file__, f"stories/{story.id}.story"), "w") as file:
        file.write(story.content)
    return {"status": "ok"}


@app.get("/story/get_num")
async def get_num_stories():
    return {"num_stories": db_client.getCount()}


@app.get("/story")
async def get_story_ids():
    return {"status": "ok", "IDs": db_client.getIDS()}

@app.put("/story")
async def edit_story(story: Story, mode: Union[str, None]):
    if not db_client.checkStoryExists(story.id):
        return {"status": "not_found"}
    if story.id in app.locked_stories:
        return {"status": "story_locked"}
    if not mode in ("a", "w"):
        return {"status": "invalid_mode"}
    with open(getRelPath(__file__, f"stories/{story.id}.story"), mode) as file:
        file.write(story.content)
    return {"status": "ok"}

@app.put("/story/sync")
async def sync_stories():
    db_client.syncStories()
    return {"status": "ok"}

@app.get("/story/{ID}")
async def get_story(ID: str):
    try:
        if not db_client.checkStoryExists(ID):
            return {"status": "not_found"}
        with open(getRelPath(__file__, f"stories/{ID}.story"), "r") as file:
            return {"status": "ok", "id": ID, "body": file.read()}
    except:
        print(f"Erro on ID: {ID}")

@app.post("/story/lock")
async def lock_all(unlock: Union[bool, None] = None):
    stories = [i["ID"] for i in db_client.story_ID_table.all()]
    if unlock:
        for story in stories:
            if (await lock_story(story, unlock=True))["status"] == "story_does_not_exist":
                return {
                    "status": "story_does_not_exist",
                    "ID": story
                }
        print(app.locked_stories)
        return {"status": "ok"}
    
    for story in stories:
        await lock_story(story)
        print(app.locked_stories)
    return {"status": "ok"}


@app.post("/story/lock/{ID}")
async def lock_story(ID: str, unlock: Union[bool, None] = None):
    if unlock:
        try:
            app.locked_stories.remove(ID)
            return {"status": "ok"}
        except KeyError:
            return {"status": "story_does_not_exist"}
    app.locked_stories.add(ID)
    return {"status": "ok"}

@app.get("/story/lock/{ID}")
async def get_story_locked(ID: str):
    return {"locked": ID in app.locked_stories}
