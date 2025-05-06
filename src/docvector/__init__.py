"""
DocVector: Intelligent Document Processing & Vector Database Integration System
"""

__version__ = "0.1.0"

from .types import Document, Chunk, Metadata
from .processor import DocumentProcessor
from .chunking import BaseChunker, SemanticChunker, CodeChunker, TokenChunker
from .embeddings import BaseEmbeddings, OpenAIEmbeddings, SentenceTransformerEmbeddings, CohereEmbeddings
from .vector_stores import BaseVectorStore, QdrantStore, WeaviateStore, MilvusStore

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
    "SentenceTransformerEmbeddings",
    "CohereEmbeddings",
    "BaseVectorStore",
    "QdrantStore",
    "WeaviateStore",
    "MilvusStore",
] 