"""
Core data models for DocVector.
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class Metadata(BaseModel):
    """Document metadata."""
    title: Optional[str] = None
    author: Optional[str] = None
    created_at: Optional[datetime] = None
    modified_at: Optional[datetime] = None
    file_type: Optional[str] = None
    file_size: Optional[int] = None
    page_count: Optional[int] = None
    custom: Dict[str, Any] = Field(default_factory=dict)

class Chunk(BaseModel):
    """A chunk of text from a document."""
    text: str
    metadata: Metadata = Field(default_factory=Metadata)
    start_index: int
    end_index: int
    embedding: Optional[List[float]] = None

class Document(BaseModel):
    """A processed document."""
    content: str
    metadata: Metadata = Field(default_factory=Metadata)
    chunks: List[Chunk] = Field(default_factory=list)
    embedding: Optional[List[float]] = None
    id: Optional[str] = None 