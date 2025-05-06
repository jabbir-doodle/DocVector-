"""
Example script demonstrating how to process PDF files with DocVector.
"""

import os
from pathlib import Path
from docvector import (
    DocumentProcessor,
    SemanticChunker,
    MistralEmbeddings,
    QdrantStore,
    Config
)

def process_pdf(pdf_path: str, collection_name: str = "pdf_documents"):
    """
    Process a PDF file and store it in the vector database.
    
    Args:
        pdf_path (str): Path to the PDF file
        collection_name (str): Name of the vector store collection
    """
    print(f"\nProcessing PDF: {pdf_path}")
    
    # Initialize components
    processor = DocumentProcessor(
        chunker=SemanticChunker(
            chunk_size=Config.DEFAULT_CHUNK_SIZE,
            overlap=Config.DEFAULT_CHUNK_OVERLAP
        ),
        embeddings=MistralEmbeddings(
            api_key=Config.MISTRAL_API_KEY,
            model=Config.MISTRAL_MODEL
        )
    )
    
    # Process the PDF
    print("Processing document...")
    document = processor.process(pdf_path)
    
    # Print document information
    print("\nDocument Information:")
    print(f"Title: {document.metadata.title}")
    print(f"Source: {document.metadata.source}")
    print(f"Content Type: {document.metadata.content_type}")
    print(f"Number of chunks: {len(document.chunks)}")
    
    # Store in vector database
    print("\nStoring in vector database...")
    store = QdrantStore(
        url=Config.QDRANT_URL,
        collection_name=collection_name
    )
    store.add_document(document)
    
    print("\nDocument successfully processed and stored!")
    return document

def search_similar_documents(query: str, collection_name: str = "pdf_documents", top_k: int = 3):
    """
    Search for similar documents in the vector database.
    
    Args:
        query (str): Search query
        collection_name (str): Name of the vector store collection
        top_k (int): Number of results to return
    """
    print(f"\nSearching for documents similar to: {query}")
    
    # Initialize vector store
    store = QdrantStore(
        url=Config.QDRANT_URL,
        collection_name=collection_name
    )
    
    # Search for similar documents
    results = store.search(query, top_k=top_k)
    
    # Print results
    print("\nSearch Results:")
    for i, (doc, score) in enumerate(results, 1):
        print(f"\n{i}. {doc.metadata.title} (Score: {score:.4f})")
        print(f"Source: {doc.metadata.source}")
        print(f"Content Type: {doc.metadata.content_type}")
    
    return results

def main():
    """Main function to demonstrate PDF processing and searching."""
    # Check if PDF path is provided
    if len(os.sys.argv) < 2:
        print("Please provide a PDF file path as an argument")
        print("Usage: python process_pdf.py <path_to_pdf>")
        return
    
    pdf_path = os.sys.argv[1]
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        return
    
    # Process the PDF
    document = process_pdf(pdf_path)
    
    # Example search
    print("\nPerforming example search...")
    search_query = "What are the main topics in this document?"
    search_similar_documents(search_query)

if __name__ == "__main__":
    main() 