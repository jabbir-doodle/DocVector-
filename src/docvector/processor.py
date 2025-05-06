"""
Document processing module.
"""

import os
from typing import Optional, List, Dict, Any
from datetime import datetime
import magic
from .types import Document, Metadata, Chunk
from .chunking import BaseChunker, SemanticChunker
from .embeddings import BaseEmbeddings

class DocumentProcessor:
    """Document processing class."""
    
    def __init__(
        self,
        chunker: Optional[BaseChunker] = None,
        embeddings: Optional[BaseEmbeddings] = None
    ):
        self.chunker = chunker or SemanticChunker()
        self.embeddings = embeddings
    
    def process(self, file_path: str) -> Document:
        """Process a document file."""
        # Read file content
        content = self._read_file(file_path)
        
        # Extract metadata
        metadata = self._extract_metadata(file_path)
        
        # Create document
        document = Document(
            content=content,
            metadata=metadata
        )
        
        # Chunk document
        document.chunks = self.chunker.chunk_text(content, metadata)
        
        # Generate embeddings if available
        if self.embeddings:
            document.embedding = self.embeddings.embed_text(content)
            for chunk in document.chunks:
                chunk.embedding = self.embeddings.embed_text(chunk.text)
        
        return document
    
    def _read_file(self, file_path: str) -> str:
        """Read file content based on file type."""
        file_type = magic.from_file(file_path, mime=True)
        
        if file_type == "text/plain":
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        elif file_type == "application/pdf":
            # TODO: Implement PDF reading
            return ""
        elif file_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            # TODO: Implement DOCX reading
            return ""
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
    
    def _extract_metadata(self, file_path: str) -> Metadata:
        """Extract metadata from file."""
        file_stats = os.stat(file_path)
        
        return Metadata(
            title=os.path.basename(file_path),
            file_type=magic.from_file(file_path, mime=True),
            file_size=file_stats.st_size,
            created_at=datetime.fromtimestamp(file_stats.st_ctime),
            modified_at=datetime.fromtimestamp(file_stats.st_mtime)
        ) 