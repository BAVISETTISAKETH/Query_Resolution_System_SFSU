from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, queries, feedback
from app.core.config import settings
import uvicorn
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for University Query Resolution System"
)

# Enhanced CORS configuration for frontend compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),  # Use the method to get the list of origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization", "Content-Length"]
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(queries.router, prefix="/api/queries", tags=["Queries"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["Feedback"])

@app.get("/")
async def root():
    return {"message": "University Query Resolution System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=f"{app.openapi_url}",
        title=f"{app.title} - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4/swagger-ui.css",
    )

@app.get("/api.json", include_in_schema=False)
async def get_open_api_endpoint():
    """Return the API schema for frontend consumption"""
    return get_openapi(
        title=app.title,
        version="1.0.0", 
        description=app.description,
        routes=app.routes
    )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
