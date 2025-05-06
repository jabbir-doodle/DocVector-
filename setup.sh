#!/bin/bash

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -e .

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# Mistral AI Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-embed

# Vector Store Configuration
QDRANT_URL=http://localhost:6333
WEAVIATE_URL=http://localhost:8080
MILVUS_HOST=localhost
MILVUS_PORT=19530

# Document Processing Configuration
DEFAULT_CHUNK_SIZE=1000
DEFAULT_CHUNK_OVERLAP=200
EOL
    echo "Please update the .env file with your API keys"
fi

# Create test data directory
mkdir -p test_data

echo "Setup complete! Please:"
echo "1. Update the .env file with your Mistral AI API key"
echo "2. Start the vector store (e.g., Qdrant) if needed"
echo "3. Run the test script: python examples/test_setup.py" 