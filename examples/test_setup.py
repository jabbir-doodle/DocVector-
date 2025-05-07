"""
Test script to verify DocVector setup and functionality.
"""

import os
import sys
from pathlib import Path
from docvector import (
    DocumentProcessor,
    SemanticChunker,
    OpenAIEmbeddings,
    QdrantStore,
    Config
)

def create_test_document(directory: str) -> str:
    """Create a test document."""
    test_content = """
    This is a test document for DocVector.
    It contains multiple sentences to test chunking.
    We will use this to verify the document processing pipeline.
    The document will be processed and stored in the vector database.
    """
    
    test_file = Path(directory) / "test_document.txt"
    test_file.write_text(test_content)
    return str(test_file)

def test_embeddings():
    """Test OpenAI embeddings."""
    print("\nTesting OpenAI embeddings...")
    try:
        embeddings = OpenAIEmbeddings(
            api_key=Config.OPENAI_API_KEY
        )
        test_text = "This is a test for embeddings."
        result = embeddings.embed_text(test_text)
        print(f"✓ Embeddings generated successfully (dimension: {len(result)})")
        return True
    except Exception as e:
        print(f"✗ Embeddings test failed: {str(e)}")
        return False

def test_vector_store():
    """Test vector store connection."""
    print("\nTesting vector store connection...")
    try:
        store = QdrantStore(
            url=Config.QDRANT_URL,
            collection_name="test_collection"
        )
        print("✓ Vector store connection successful")
        return True
    except Exception as e:
        print(f"✗ Vector store test failed: {str(e)}")
        return False

def test_document_processing():
    """Test document processing pipeline."""
    print("\nTesting document processing...")
    try:
        # Create test document
        test_file = create_test_document("test_data")
        
        # Initialize processor
        processor = DocumentProcessor(
            chunker=SemanticChunker(),
            embeddings=OpenAIEmbeddings(
                api_key=Config.OPENAI_API_KEY
            )
        )
        
        # Process document
        document = processor.process(test_file)
        print(f"✓ Document processed successfully")
        print(f"  - Title: {document.metadata.title}")
        print(f"  - Chunks: {len(document.chunks)}")
        print(f"  - Has embeddings: {document.embedding is not None}")
        
        # Clean up
        os.remove(test_file)
        return True
    except Exception as e:
        print(f"✗ Document processing test failed: {str(e)}")
        return False

def main():
    """Run all tests."""
    print("Starting DocVector setup verification...")
    
    # Create test directory
    os.makedirs("test_data", exist_ok=True)
    
    # Run tests
    tests = [
        ("Configuration", Config.validate),
        ("Embeddings", test_embeddings),
        ("Vector Store", test_vector_store),
        ("Document Processing", test_document_processing)
    ]
    
    results = []
    for name, test_func in tests:
        print(f"\n=== Testing {name} ===")
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"✗ {name} test failed with error: {str(e)}")
            results.append((name, False))
    
    # Print summary
    print("\n=== Test Summary ===")
    all_passed = True
    for name, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{name}: {status}")
        if not result:
            all_passed = False
    
    # Clean up
    if os.path.exists("test_data"):
        for file in os.listdir("test_data"):
            os.remove(os.path.join("test_data", file))
        os.rmdir("test_data")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main()) 