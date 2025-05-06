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
    
    # Embedding Provider Configuration
    EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "mistral")  # openai, mistral, or deepseek
    
    # OpenAI settings
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "text-embedding-3-small")
    
    # Mistral AI settings
    MISTRAL_API_KEY: Optional[str] = os.getenv("MISTRAL_API_KEY")
    MISTRAL_MODEL: str = os.getenv("MISTRAL_MODEL", "mistral-embed")
    
    # DeepSeek settings
    DEEPSEEK_API_KEY: Optional[str] = os.getenv("DEEPSEEK_API_KEY")
    DEEPSEEK_MODEL: str = os.getenv("DEEPSEEK_MODEL", "deepseek-embed")
    
    # Vector store settings
    VECTOR_STORE_PROVIDER = os.getenv("VECTOR_STORE_PROVIDER", "pinecone")  # pinecone, qdrant, weaviate, or milvus
    
    # Pinecone settings
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY")
    PINECONE_ENVIRONMENT: str = os.getenv("PINECONE_ENVIRONMENT", "us-west1-gcp")
    PINECONE_INDEX: str = os.getenv("PINECONE_INDEX", "docvector")
    
    # Qdrant settings
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    
    # Weaviate settings
    WEAVIATE_URL: str = os.getenv("WEAVIATE_URL", "http://localhost:8080")
    
    # Milvus settings
    MILVUS_HOST: str = os.getenv("MILVUS_HOST", "localhost")
    MILVUS_PORT: int = int(os.getenv("MILVUS_PORT", "19530"))
    
    # Document processing settings
    DEFAULT_CHUNK_SIZE: int = int(os.getenv("DEFAULT_CHUNK_SIZE", "1000"))
    DEFAULT_CHUNK_OVERLAP: int = int(os.getenv("DEFAULT_CHUNK_OVERLAP", "200"))
    
    @classmethod
    def get_embedding_api_key(cls) -> str:
        """Get the API key for the selected embedding provider."""
        provider_keys = {
            'openai': cls.OPENAI_API_KEY,
            'mistral': cls.MISTRAL_API_KEY,
            'deepseek': cls.DEEPSEEK_API_KEY
        }
        api_key = provider_keys.get(cls.EMBEDDING_PROVIDER)
        if not api_key:
            raise ValueError(f"API key not found for provider: {cls.EMBEDDING_PROVIDER}")
        return api_key
    
    @classmethod
    def get_embedding_model(cls) -> str:
        """Get the model name for the selected embedding provider."""
        provider_models = {
            'openai': cls.OPENAI_MODEL,
            'mistral': cls.MISTRAL_MODEL,
            'deepseek': cls.DEEPSEEK_MODEL
        }
        return provider_models.get(cls.EMBEDDING_PROVIDER)
    
    @classmethod
    def validate(cls) -> None:
        """Validate configuration settings."""
        # Validate embedding provider
        if cls.EMBEDDING_PROVIDER not in ['openai', 'mistral', 'deepseek']:
            raise ValueError("Invalid EMBEDDING_PROVIDER. Choose from: openai, mistral, deepseek")
        
        # Validate vector store provider
        if cls.VECTOR_STORE_PROVIDER not in ['pinecone', 'qdrant', 'weaviate', 'milvus']:
            raise ValueError("Invalid VECTOR_STORE_PROVIDER. Choose from: pinecone, qdrant, weaviate, milvus")
        
        # Validate required API keys
        if not cls.get_embedding_api_key():
            raise ValueError(f"API key required for {cls.EMBEDDING_PROVIDER}")
        
        # Validate Pinecone settings if using Pinecone
        if cls.VECTOR_STORE_PROVIDER == 'pinecone':
            if not cls.PINECONE_API_KEY:
                raise ValueError("PINECONE_API_KEY is required when using Pinecone") 