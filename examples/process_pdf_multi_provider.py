"""
Example script demonstrating how to process PDF files with different embedding providers.
"""

import os
from pathlib import Path
from docvector import (
    DocumentProcessor,
    SemanticChunker,
    EmbeddingFactory,
    PineconeStore,
    Config
)

def process_pdf_with_provider(pdf_path: str, provider: str):
    """
    Process a PDF file using a specific embedding provider.
    
    Args:
        pdf_path (str): Path to the PDF file
        provider (str): Embedding provider ('openai', 'mistral', or 'deepseek')
    """
    print(f"\nProcessing PDF with {provider.upper()}: {pdf_path}")
    
    # Get API key and model for the provider
    api_key = {
        'openai': Config.OPENAI_API_KEY,
        'mistral': Config.MISTRAL_API_KEY,
        'deepseek': Config.DEEPSEEK_API_KEY
    }[provider]
    
    model = {
        'openai': Config.OPENAI_MODEL,
        'mistral': Config.MISTRAL_MODEL,
        'deepseek': Config.DEEPSEEK_MODEL
    }[provider]
    
    # Initialize embeddings using factory
    embeddings = EmbeddingFactory.create(
        provider=provider,
        api_key=api_key,
        model=model
    )
    
    # Initialize processor
    processor = DocumentProcessor(
        chunker=SemanticChunker(
            chunk_size=Config.DEFAULT_CHUNK_SIZE,
            overlap=Config.DEFAULT_CHUNK_OVERLAP
        ),
        embeddings=embeddings
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
    print(f"Embedding Provider: {provider}")
    print(f"Embedding Model: {model}")
    
    # Store in vector database
    print("\nStoring in vector database...")
    store = PineconeStore(
        api_key=Config.PINECONE_API_KEY,
        environment=Config.PINECONE_ENVIRONMENT,
        index_name=f"{Config.PINECONE_INDEX}_{provider}"
    )
    store.add_document(document)
    
    print(f"\nDocument successfully processed with {provider} and stored!")
    return document

def compare_embeddings(pdf_path: str):
    """Compare embeddings from different providers."""
    providers = ['openai', 'mistral', 'deepseek']
    documents = {}
    
    for provider in providers:
        try:
            documents[provider] = process_pdf_with_provider(pdf_path, provider)
            print(f"\nSuccessfully processed with {provider}")
        except Exception as e:
            print(f"\nError processing with {provider}: {str(e)}")
    
    return documents

def main():
    """Main function to demonstrate PDF processing with different providers."""
    # Check if PDF path is provided
    if len(os.sys.argv) < 2:
        print("Please provide a PDF file path as an argument")
        print("Usage: python process_pdf_multi_provider.py <path_to_pdf>")
        return
    
    pdf_path = os.sys.argv[1]
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        return
    
    # Process with all available providers
    documents = compare_embeddings(pdf_path)
    
    # Print summary
    print("\n=== Processing Summary ===")
    for provider, doc in documents.items():
        if doc:
            print(f"\n{provider.upper()}:")
            print(f"Chunks: {len(doc.chunks)}")
            print(f"First chunk embedding size: {len(doc.chunks[0].embedding) if doc.chunks else 'N/A'}")

if __name__ == "__main__":
    main() 