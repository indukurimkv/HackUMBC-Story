from tinydb import TinyDB, where
from tinydb.table import Document
from tinydb.operations import *

from app.pathutil import getRelPath

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
    def getID(self, index):
        metadata = self.metadata_table.get(doc_id=index)
        return metadata[]
