"""
Example script demonstrating DocVector usage with Mistral AI.
"""

import os
from docvector import (
    DocumentProcessor,
    SemanticChunker,
    MistralEmbeddings,
    QdrantStore,
    Config
)

def main():
    # Validate configuration
    Config.validate()
    
    # Initialize components
    chunker = SemanticChunker(
        chunk_size=Config.DEFAULT_CHUNK_SIZE,
        overlap=Config.DEFAULT_CHUNK_OVERLAP
    )
    
    # Use Mistral AI for embeddings
    embeddings = MistralEmbeddings(
        api_key=Config.MISTRAL_API_KEY,
        model=Config.MISTRAL_MODEL
    )
    
    vector_store = QdrantStore(
        url=Config.QDRANT_URL,
        collection_name="documents"
    )
    
    # Initialize document processor
    processor = DocumentProcessor(
        chunker=chunker,
        embeddings=embeddings
    )
    
    # Process a document
    document_path = "path/to/your/document.txt"
    if os.path.exists(document_path):
        # Process document
        document = processor.process(document_path)
        print(f"Processed document: {document.metadata.title}")
        print(f"Number of chunks: {len(document.chunks)}")
        
        # Store document in vector store
        doc_id = vector_store.add_document(document)
        print(f"Stored document with ID: {doc_id}")
        
        # Search for similar documents
        query = "example search query"
        results = vector_store.search(query, limit=5)
        print(f"Found {len(results)} similar documents")
    else:
        print(f"Document not found: {document_path}")

if __name__ == "__main__":
    main() 