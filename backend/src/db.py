from tinydb import TinyDB, where, Query
from tinydb.table import Document
from tinydb.operations import *

from src.utils.pathutil import getRelPath

import os

class DBClient(TinyDB):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.story_ID_table = self.table("story_IDs")
        self.metadata_table = self.table("story_metadata")
    def setup_metadata(self):
        if self.metadata_table.contains(doc_id=1):
            return
        self.metadata_table.insert(Document({"metadata": {}}, doc_id=1))

    def setCount(self, count):
        metadata = self.metadata_table.get(doc_id=1)
        if "count" in metadata:
            self.metadata_table.update(set("count", count), doc_ids=[1])
        else:
            self.metadata_table.upsert(Document({"count": count}, doc_id=1))
    def getCount(self):
        metadata = self.metadata_table.get(doc_id=1)
        if "count" in metadata:
            return metadata["count"]
        return -1
    def getIDS(self):
        return [i["ID"] for i in self.story_ID_table.all()]
    
    def syncStories(self):
        # Match file names with ids. Remove non-matching file ids
        # note that the .story extension will be replaced so it can't be used in ids
        files =  [filename.replace(".story", "") for filename in os.listdir(getRelPath(__file__, "stories"))]
        self.setCount(len(files))

        self.story_ID_table.remove(Query().ID.test(lambda id: not id in files))
        return files
    
    def checkStoryExists(self, uuid):
        return self.story_ID_table.contains(Query().ID == uuid)

if __name__ == "__main__":
    client= DBClient(getRelPath(__file__, "db/db.json"))

    print(client.syncStories())
