"""
DocVector: Intelligent Document Processing & Vector Database Integration System
"""

__version__ = "0.1.0"

from .types import Document, Chunk, Metadata
from .processor import DocumentProcessor
from .chunking import BaseChunker, SemanticChunker, CodeChunker, TokenChunker
from .embeddings import BaseEmbeddings, OpenAIEmbeddings
from .vector_stores import BaseVectorStore, QdrantStore, WeaviateStore, MilvusStore
from .config import Config

__all__ = [
    "Document",
    "Chunk",
    "Metadata",
    "DocumentProcessor",
    "BaseChunker",
    "SemanticChunker",
    "CodeChunker",
    "TokenChunker",
    "BaseEmbeddings",
    "OpenAIEmbeddings",
    "BaseVectorStore",
    "QdrantStore",
    "WeaviateStore",
    "MilvusStore",
] 