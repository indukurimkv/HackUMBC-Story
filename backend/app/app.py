from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from app.schema.story import Story

from tinydb import TinyDB, Query, where
from tinydb.table import Document
from tinydb.operations import increment

from app.db import DBClient

from app.pathutil import getRelPath


class StoryApp(FastAPI):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    
app = StoryApp()


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

# Set up database with story id table and metadata table
# db = TinyDB(getRelPath(__file__, "db/db.json"))
# StoryQuery = Query()
# story_IDs = db.table("story_IDs")
# story_metadata = db.table("story_metadata")
# try:
#     story_metadata.insert(Document({"metadata": {}}, doc_id=1))
# except ValueError:
#     print("Count document exists")

db_client = DBClient(getRelPath(__file__, "db/db.json"))

@app.post("/story")
def create_story(story: Story):
    if story.id == "":
        story.id = uuid4().hex
    
    if db_client.story_ID_table.contains(where("ID") == story.id):
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
def get_num_stories():
    return {"num_stories": db_client.getCount()}

@app.get("/story/{ID}")
def get_story(ID: str):
    if not db_client.story_ID_table.contains(where("ID") == ID):
        return {"status": "not_found"}
    with open(getRelPath(__file__, f"stories/{ID}.story"), "r") as file:
        return {"status": "ok", "id": ID, "body": file.read()}
