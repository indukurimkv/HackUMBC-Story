

def get_doc_string():
    doc_string = """
    This API handles story management for the story maker app.

    ## /story 

    These routes are reserved for directly interacting with the stories. You can perform the following operations:
    - Get a list of all story ids
    - Get story content based on story id(you need to fetch "/story/{storyID}")
    - edit a story
    - create a story

    ## /story/get_num

    - returns the number of current stories

    ## /story/lock

    These routes are reserved for locking and unlocking stories. You can:
    - lock a specific story("/story/lock/{ID}")
    - unlock a specific story("/story/lock/{ID}?unlock=true")
    - lock all stories("/story/lock")
    - unlock all stores("/story/lock?unlock=true")

    ## /story/sync

    Theoretically doesn't need to be used in production. Make a call to this to sync the db with stories currently stored in the stories directory. Note that this only checks if all stories in the db exist in the directory, but it does not add missing stories to the db(yet).

"""
    return doc_string