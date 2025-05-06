# DocVector

Intelligent Document Processing & Vector Database Integration System

## Overview

DocVector is a powerful document processing and vector database integration system that enables efficient document ingestion, processing, and semantic search capabilities. It provides a unified interface for working with various document types and vector databases.

## Features

- **Document Processing**
  - Support for multiple document formats (PDF, DOCX, TXT, etc.)
  - Intelligent text extraction and cleaning
  - Metadata extraction and management

- **Vector Database Integration**
  - Support for multiple vector databases (Qdrant, Weaviate, Milvus)
  - Efficient document indexing and retrieval
  - Semantic search capabilities

- **Embedding Models**
  - Multiple embedding model support (OpenAI, Sentence Transformers, Cohere)
  - Custom embedding model integration
  - Batch processing capabilities

- **Chunking Strategies**
  - Semantic chunking
  - Code-aware chunking
  - Token-based chunking
  - Custom chunking strategies

## Installation

```bash
pip install docvector
```

## Quick Start

```python
from docvector import DocumentProcessor, VectorStore

# Initialize document processor
processor = DocumentProcessor()

# Process a document
doc = processor.process("path/to/document.pdf")

# Initialize vector store
store = VectorStore("qdrant")

# Store document
store.add_document(doc)

# Search similar documents
results = store.search("query text", limit=5)
```

## Documentation

For detailed documentation, visit our [Documentation](https://github.com/jabbir-doodle/DocVector-/blob/main/README.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 