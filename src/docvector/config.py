"""
Configuration settings for DocVector.
"""

import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration settings."""
    
    # Mistral AI settings
    MISTRAL_API_KEY: Optional[str] = os.getenv("MISTRAL_API_KEY")
    MISTRAL_MODEL: str = os.getenv("MISTRAL_MODEL", "mistral-embed")
    
    # Pinecone settings
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY")
    PINECONE_ENVIRONMENT: str = os.getenv("PINECONE_ENVIRONMENT", "us-west1-gcp")
    PINECONE_INDEX: str = os.getenv("PINECONE_INDEX", "docvector")
    
    # OpenAI settings
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "text-embedding-ada-002")
    
    # Cohere settings
    COHERE_API_KEY: Optional[str] = os.getenv("COHERE_API_KEY")
    COHERE_MODEL: str = os.getenv("COHERE_MODEL", "embed-english-v3.0")
    
    # Vector store settings
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    WEAVIATE_URL: str = os.getenv("WEAVIATE_URL", "http://localhost:8080")
    MILVUS_HOST: str = os.getenv("MILVUS_HOST", "localhost")
    MILVUS_PORT: int = int(os.getenv("MILVUS_PORT", "19530"))
    
    # Document processing settings
    DEFAULT_CHUNK_SIZE: int = int(os.getenv("DEFAULT_CHUNK_SIZE", "1000"))
    DEFAULT_CHUNK_OVERLAP: int = int(os.getenv("DEFAULT_CHUNK_OVERLAP", "200"))
    
    @classmethod
    def validate(cls) -> None:
        """Validate required configuration settings."""
        if not cls.MISTRAL_API_KEY:
            print("Warning: MISTRAL_API_KEY not set")
        if not cls.OPENAI_API_KEY:
            print("Warning: OPENAI_API_KEY not set")
        if not cls.COHERE_API_KEY:
            print("Warning: COHERE_API_KEY not set")
        if not cls.PINECONE_API_KEY:
            raise ValueError("PINECONE_API_KEY is required") 