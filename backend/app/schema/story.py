from pydantic import BaseModel


class Story(BaseModel):
    id: str
    content: str