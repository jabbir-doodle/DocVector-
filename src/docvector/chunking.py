"""
Chunking strategies for document processing.
"""

from abc import ABC, abstractmethod
from typing import List, Optional
import re
from .types import Chunk, Metadata

class BaseChunker(ABC):
    """Base class for chunking strategies."""
    
    def __init__(self, chunk_size: int = 1000, overlap: int = 200):
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    @abstractmethod
    def chunk_text(self, text: str, metadata: Optional[Metadata] = None) -> List[Chunk]:
        """Split text into chunks."""
        pass

class SemanticChunker(BaseChunker):
    """Chunks text based on semantic boundaries (sentences, paragraphs)."""
    
    def chunk_text(self, text: str, metadata: Optional[Metadata] = None) -> List[Chunk]:
        """Split text into chunks based on semantic boundaries."""
        # Split into sentences (simple approach)
        sentences = re.split(r'(?<=[.!?])\s+', text)
        chunks = []
        current_chunk = []
        current_length = 0
        
        for sentence in sentences:
            sentence_length = len(sentence)
            if current_length + sentence_length > self.chunk_size and current_chunk:
                # Create chunk from current sentences
                chunk_text = ' '.join(current_chunk)
                chunks.append(Chunk(
                    text=chunk_text,
                    metadata=metadata or Metadata(),
                    start_index=text.find(chunk_text),
                    end_index=text.find(chunk_text) + len(chunk_text)
                ))
                # Keep overlap
                overlap_text = ' '.join(current_chunk[-self.overlap:])
                current_chunk = [overlap_text]
                current_length = len(overlap_text)
            current_chunk.append(sentence)
            current_length += sentence_length
        
        # Add remaining text as chunk
        if current_chunk:
            chunk_text = ' '.join(current_chunk)
            chunks.append(Chunk(
                text=chunk_text,
                metadata=metadata or Metadata(),
                start_index=text.find(chunk_text),
                end_index=text.find(chunk_text) + len(chunk_text)
            ))
        
        return chunks

class CodeChunker(BaseChunker):
    """Chunks code based on language-specific boundaries."""
    
    def chunk_text(self, text: str, metadata: Optional[Metadata] = None) -> List[Chunk]:
        """Split code into chunks based on function/class boundaries."""
        # Simple approach: split on function/class definitions
        # This is a basic implementation and should be enhanced for specific languages
        chunks = []
        current_pos = 0
        
        # Find function/class definitions
        pattern = r'(?:def|class)\s+\w+'
        matches = list(re.finditer(pattern, text))
        
        for i, match in enumerate(matches):
            start = match.start()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
            
            chunk_text = text[start:end]
            chunks.append(Chunk(
                text=chunk_text,
                metadata=metadata or Metadata(),
                start_index=start,
                end_index=end
            ))
        
        return chunks

class TokenChunker(BaseChunker):
    """Chunks text based on token boundaries."""
    
    def chunk_text(self, text: str, metadata: Optional[Metadata] = None) -> List[Chunk]:
        """Split text into chunks based on token boundaries."""
        # Simple word-based tokenization
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            word_length = len(word) + 1  # +1 for space
            if current_length + word_length > self.chunk_size and current_chunk:
                # Create chunk from current words
                chunk_text = ' '.join(current_chunk)
                chunks.append(Chunk(
                    text=chunk_text,
                    metadata=metadata or Metadata(),
                    start_index=text.find(chunk_text),
                    end_index=text.find(chunk_text) + len(chunk_text)
                ))
                # Keep overlap
                overlap_words = current_chunk[-self.overlap:]
                current_chunk = overlap_words
                current_length = sum(len(w) + 1 for w in overlap_words)
            current_chunk.append(word)
            current_length += word_length
        
        # Add remaining words as chunk
        if current_chunk:
            chunk_text = ' '.join(current_chunk)
            chunks.append(Chunk(
                text=chunk_text,
                metadata=metadata or Metadata(),
                start_index=text.find(chunk_text),
                end_index=text.find(chunk_text) + len(chunk_text)
            ))
        
        return chunks 