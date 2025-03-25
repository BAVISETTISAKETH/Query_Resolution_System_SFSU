from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class QueryBase(BaseModel):
    query_text: str

class QueryCreate(QueryBase):
    pass

class QueryResponse(BaseModel):
    response_text: str
    confidence_score: Optional[float] = None

class QueryInDB(QueryBase):
    id: str
    user_id: str
    response: Optional[QueryResponse] = None
    status: str = "pending"  # pending, answered, flagged
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
