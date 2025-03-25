from fastapi import APIRouter, Depends, HTTPException, status
from app.models.queries import QueryCreate, QueryInDB
from app.core.security import get_current_user
from app.services.llm_service import MockLLMService
from app.services.query_service import QueryService
from typing import List, Dict, Any

router = APIRouter()

# Initialize services
llm_service = MockLLMService()
query_service = QueryService(llm_service)

@router.post("/submit", response_model=Dict[str, Any])
async def submit_query(query: QueryCreate, current_user = Depends(get_current_user)):
    """Submit a new query and get a response"""
    result = await query_service.submit_query(current_user.id, query.query_text)
    return result

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_query_history(current_user = Depends(get_current_user)):
    """Get the query history for the current user"""
    queries = await query_service.get_user_queries(current_user.id)
    return queries

@router.get("/{query_id}", response_model=Dict[str, Any])
async def get_query(query_id: str, current_user = Depends(get_current_user)):
    """Get a specific query by ID"""
    query = await query_service.get_query_by_id(query_id)
    
    # Check if query exists
    if not query:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Query not found"
        )
    
    # Check if user is authorized to view this query
    if query["user_id"] != current_user.id and current_user.user_metadata.get("role") != "faculty":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this query"
        )
    
    return query
