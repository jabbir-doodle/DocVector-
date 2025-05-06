"""
Embedding models for document vectorization.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
import numpy as np

class BaseEmbeddings(ABC):
    """Base class for embedding models."""
    
    @abstractmethod
    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for a single text."""
        pass
    
    @abstractmethod
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        pass

class OpenAIEmbeddings(BaseEmbeddings):
    """OpenAI embeddings implementation."""
    
    def __init__(self, api_key: str, model: str = "text-embedding-3-small"):
        """
        Initialize OpenAI embeddings.
        
        Args:
            api_key (str): OpenAI API key
            model (str): Model name (text-embedding-3-small or text-embedding-3-large)
        """
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key)
            self.model = model
        except ImportError:
            raise ImportError("Please install openai: pip install openai")
    
    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for a single text using OpenAI."""
        response = self.client.embeddings.create(
            model=self.model,
            input=text,
            encoding_format="float"
        )
        return response.data[0].embedding
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts using OpenAI."""
        response = self.client.embeddings.create(
            model=self.model,
            input=texts,
            encoding_format="float"
        )
        return [data.embedding for data in response.data]

class MistralEmbeddings(BaseEmbeddings):
    """Mistral AI embeddings implementation."""
    
    def __init__(self, api_key: str, model: str = "mistral-embed"):
        """
        Initialize Mistral embeddings.
        
        Args:
            api_key (str): Mistral AI API key
            model (str): Model name
        """
        try:
            from mistralai.client import MistralClient
            from mistralai.models.chat_completion import ChatMessage
            self.client = MistralClient(api_key=api_key)
            self.model = model
        except ImportError:
            raise ImportError("Please install mistralai: pip install mistralai")
    
    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for a single text using Mistral."""
        response = self.client.embeddings(
            model=self.model,
            input=[text]
        )
        return response.data[0].embedding
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts using Mistral."""
        response = self.client.embeddings(
            model=self.model,
            input=texts
        )
        return [data.embedding for data in response.data]

class DeepSeekEmbeddings(BaseEmbeddings):
    """DeepSeek embeddings implementation."""
    
    def __init__(self, api_key: str, model: str = "deepseek-embed"):
        """
        Initialize DeepSeek embeddings.
        
        Args:
            api_key (str): DeepSeek API key
            model (str): Model name
        """
        try:
            import deepseek
            self.client = deepseek.Client(api_key=api_key)
            self.model = model
        except ImportError:
            raise ImportError("Please install deepseek: pip install deepseek")
    
    def embed_text(self, text: str) -> List[float]:
        """Generate embeddings for a single text using DeepSeek."""
        response = self.client.embeddings.create(
            model=self.model,
            input=text
        )
        return response.embeddings[0]
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts using DeepSeek."""
        response = self.client.embeddings.create(
            model=self.model,
            input=texts
        )
        return response.embeddings

class EmbeddingFactory:
    """Factory class for creating embedding instances."""
    
    @staticmethod
    def create(provider: str, api_key: str, model: Optional[str] = None) -> BaseEmbeddings:
        """
        Create an embedding instance based on the provider.
        
        Args:
            provider (str): Provider name ('openai', 'mistral', or 'deepseek')
            api_key (str): API key for the provider
            model (str, optional): Model name
        
        Returns:
            BaseEmbeddings: An instance of the embedding class
        """
        providers = {
            'openai': (OpenAIEmbeddings, "text-embedding-3-small"),
            'mistral': (MistralEmbeddings, "mistral-embed"),
            'deepseek': (DeepSeekEmbeddings, "deepseek-embed")
        }
        
        if provider not in providers:
            raise ValueError(f"Unsupported provider: {provider}. Choose from {list(providers.keys())}")
        
        EmbeddingClass, default_model = providers[provider]
        return EmbeddingClass(api_key=api_key, model=model or default_model) 