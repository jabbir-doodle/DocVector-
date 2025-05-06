"""
Tests for the document processor.
"""

import os
import pytest
from docvector import DocumentProcessor, SemanticChunker, OpenAIEmbeddings
from docvector.types import Document, Metadata

def test_document_processor_initialization():
    """Test document processor initialization."""
    processor = DocumentProcessor()
    assert processor.chunker is not None
    assert processor.embeddings is None
    
    chunker = SemanticChunker()
    embeddings = OpenAIEmbeddings(api_key="dummy_key")
    processor = DocumentProcessor(chunker=chunker, embeddings=embeddings)
    assert processor.chunker == chunker
    assert processor.embeddings == embeddings

def test_document_processing(tmp_path):
    """Test document processing."""
    # Create a test file
    test_file = tmp_path / "test.txt"
    test_content = "This is a test document.\nIt has multiple lines.\nFor testing purposes."
    test_file.write_text(test_content)
    
    # Process the file
    processor = DocumentProcessor()
    document = processor.process(str(test_file))
    
    # Check document structure
    assert isinstance(document, Document)
    assert document.content == test_content
    assert isinstance(document.metadata, Metadata)
    assert document.metadata.title == "test.txt"
    assert document.metadata.file_type == "text/plain"
    assert document.metadata.file_size > 0
    assert document.metadata.created_at is not None
    assert document.metadata.modified_at is not None
    
    # Check chunks
    assert len(document.chunks) > 0
    for chunk in document.chunks:
        assert chunk.text in test_content
        assert chunk.start_index >= 0
        assert chunk.end_index <= len(test_content)
        assert chunk.metadata == document.metadata

def test_unsupported_file_type(tmp_path):
    """Test processing of unsupported file type."""
    # Create a test file with unsupported extension
    test_file = tmp_path / "test.xyz"
    test_file.write_text("test content")
    
    # Process the file
    processor = DocumentProcessor()
    with pytest.raises(ValueError):
        processor.process(str(test_file)) 