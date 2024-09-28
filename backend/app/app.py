from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from app.schema.story import Story

from tinydb import TinyDB, Query, where
from tinydb.table import Document
from tinydb.operations import increment

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
db = TinyDB(getRelPath(__file__, "db/db.json"))
StoryQuery = Query()
story_IDs = db.table("story_IDs")
story_metadata = db.table("story_metadata")
try:
    story_metadata.insert(Document({"metadata": {}}, doc_id=1))
except ValueError:
    print("Count document exists")

@app.post("/story")
def create_story(story: Story):
    if story.id == "":
        story.id = uuid4().hex
    
    story_IDs.insert({"ID": story.id})
    story_metadata.update(increment("count"), doc_ids=[1])

    with open(getRelPath(__file__, f"stories/{story.id}.story"), "w") as file:
        file.write(story.body)
    return {"status": "ok"}


@app.get("/story/get_num")
def get_num_stories():
    return {"num_stories": story_metadata.get(doc_id=1)["count"]}

@app.get("/story/{ID}")
def get_story(ID: str):
    if not story_IDs.contains(where("ID") == ID):
        return {"status": "not_found"}
    with open(getRelPath(__file__, f"stories/{ID}.story"), "r") as file:
        return {"status": "ok", "id": ID, "body": file.read()}
