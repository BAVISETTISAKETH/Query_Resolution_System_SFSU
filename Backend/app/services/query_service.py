from app.services.llm_service import LLMService
from app.db.supabase import get_supabase_client, serialize_supabase_response
from datetime import datetime
from typing import Dict, Any, List

class QueryService:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        self.supabase = get_supabase_client()
    
    async def submit_query(self, user_id: str, query_text: str) -> Dict[str, Any]:
        """
        Submit a query and get a response from the LLM
        
        Args:
            user_id: The ID of the user submitting the query
            query_text: The query text
            
        Returns:
            A dictionary with the query and response details
        """
        # Get response from LLM
        response_text, confidence = self.llm_service.get_response(query_text)
        
        # Create query data
        now = datetime.now().isoformat()
        query_data = {
            "user_id": user_id,
            "query_text": query_text,
            "response_text": response_text,
            "confidence_score": confidence,
            "status": "answered",
            "created_at": now,
            "updated_at": now
        }
        
        # Store in database
        result = self.supabase.table("queries").insert(query_data).execute()
        
        # Extract the inserted record and format for frontend
        query_record = result.data[0] if result.data else {}
        
        # Format response for frontend consumption
        return {
            "id": query_record.get("id"),
            "query_text": query_text,
            "response": {
                "response_text": response_text,
                "confidence_score": confidence
            },
            "status": "answered",
            "created_at": now,
            "updated_at": now
        }
    
    async def get_user_queries(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all queries for a specific user"""
        result = self.supabase.table("queries").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        # Process data to be frontend-friendly
        queries = []
        for query in result.data or []:
            # Format response object
            formatted_query = {
                "id": query.get("id"),
                "query_text": query.get("query_text"),
                "response": {
                    "response_text": query.get("response_text"),
                    "confidence_score": query.get("confidence_score")
                },
                "status": query.get("status"),
                "created_at": query.get("created_at"),
                "updated_at": query.get("updated_at")
            }
            queries.append(formatted_query)
            
        return queries
    
    async def get_query_by_id(self, query_id: str) -> Dict[str, Any]:
        """Get a specific query by ID"""
        result = self.supabase.table("queries").select("*").eq("id", query_id).single().execute()
        
        # Return None if not found
        if not result.data:
            return None
            
        query = result.data
        # Format for frontend consumption
        formatted_query = {
            "id": query.get("id"),
            "query_text": query.get("query_text"),
            "response": {
                "response_text": query.get("response_text"),
                "confidence_score": query.get("confidence_score")
            },
            "status": query.get("status"),
            "created_at": query.get("created_at"),
            "updated_at": query.get("updated_at"),
            "user_id": query.get("user_id")
        }
        
        return formatted_query
