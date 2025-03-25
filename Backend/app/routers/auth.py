from fastapi import APIRouter, Depends, HTTPException, status, Response
from app.models.users import UserCreate, UserResponse
from app.db.supabase import get_supabase_client
from app.core.security import get_current_user
from supabase import Client
from typing import Dict, Any

router = APIRouter()

@router.post("/register", response_model=Dict[str, str])
async def register_user(user_data: UserCreate, supabase: Client = Depends(get_supabase_client)):
    """Register a new user (student or faculty)"""
    try:
        # Register user with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name,
                    "role": user_data.role
                }
            }
        })
        
        # For development: auto-confirm email if using a fake email
        # Remove this in production
        if "example.com" in user_data.email:
            try:
                # This is just for easier development testing
                supabase.auth.admin.update_user_by_id(
                    auth_response.user.id,
                    {"email_confirm": True}
                )
            except:
                pass  # Ignore if admin API not available
        
        return {
            "message": "User registered successfully. Please check your email to confirm your account.",
            "status": "success"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Dict[str, str])
async def login_user(
    response: Response,
    email: str, 
    password: str, 
    supabase: Client = Depends(get_supabase_client)
):
    """Login and get authentication token"""
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        # Set cookies for better frontend integration
        response.set_cookie(
            key="supabase-auth-token",
            value=auth_response.session.access_token,
            httponly=True,
            max_age=3600 * 24 * 7,  # 1 week
            samesite="lax",
            secure=False  # Set to True in production with HTTPS
        )
        
        return {
            "access_token": auth_response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": auth_response.user.id,
                "email": auth_response.user.email,
                "role": auth_response.user.user_metadata.get("role", ""),
                "full_name": auth_response.user.user_metadata.get("full_name", "")
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}"
        )

@router.post("/logout")
async def logout_user(
    response: Response,
    supabase: Client = Depends(get_supabase_client), 
    current_user = Depends(get_current_user)
):
    """Logout the current user"""
    try:
        supabase.auth.sign_out()
        
        # Clear auth cookie
        response.delete_cookie(key="supabase-auth-token")
        
        return {"message": "Successfully logged out", "status": "success"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.get("/me", response_model=Dict[str, Any])
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get information about the currently authenticated user"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.user_metadata.get("full_name", ""),
        "role": current_user.user_metadata.get("role", ""),
        "last_login": current_user.last_sign_in_at
    }
