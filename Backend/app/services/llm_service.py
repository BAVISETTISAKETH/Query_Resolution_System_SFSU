import json
import os
from typing import Tuple, Dict
from pathlib import Path

class LLMService:
    """Interface for LLM service, to be replaced with actual LLM integration later"""
    
    def get_response(self, query: str) -> Tuple[str, float]:
        """
        Get a response to a query from the LLM service.
        
        Args:
            query: The query text
            
        Returns:
            Tuple of (response_text, confidence_score)
        """
        raise NotImplementedError("Subclasses must implement this method")

class MockLLMService(LLMService):
    """Mock implementation using predefined responses"""
    
    def __init__(self):
        # Load predefined responses from JSON file
        mock_data_path = Path(__file__).parents[2] / "mock_data" / "mock_responses.json"
        with open(mock_data_path, "r") as f:
            self.responses: Dict[str, str] = json.load(f)
    
    def get_response(self, query: str) -> Tuple[str, float]:
        # Simple keyword matching
        for keyword, response in self.responses.items():
            if keyword.lower() in query.lower():
                return response, 0.9
        
        # Default response
        return "I don't have information about that specific topic yet. Please contact your department for more details.", 0.3
