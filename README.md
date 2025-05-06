# DocVector: Intelligent Document Processing Agent
[![Architecture Diagram](https://github.com/jabbir-doodle/DocVector-/raw/main/docvector.png)](https://jabbir-doodle.github.io/DocVector-/index.html)

DocVector is an autonomous document‐processing agent that leverages multiple LLM providers to transform, analyze, and search through documents intelligently.

---

## 📐 Architecture Diagram
Click the diagram below to launch the full interactive, animated SVG in your browser:
[![DocVector Architecture](https://github.com/jabbir-doodle/DocVector-/raw/main/docvector.png)](https://jabbir-doodle.github.io/DocVector-/index.html)

Or open `index.html` directly to see the live GSAP–powered animation.

## Key Features
- **Autonomous Document Processing**
  - Intelligent text chunking
  - Multi-format support (PDF, DOCX)
  - Automatic metadata extraction
- **Multi-Provider LLM Integration**
  - Mistral AI
  - OpenAI
  - DeepSeek
  - Easy to extend with new providers
- **Flexible Vector Storage**
  - Pinecone
  - Qdrant
  - Weaviate
  - Extensible storage interface
- **Intelligent Search Capabilities**
  - Semantic search
  - Similarity matching
  - Context-aware retrieval

## Multi-Provider Embedding Support

DocVector offers seamless integration with multiple embedding providers:

- **OpenAI** - Industry-leading embedding models for high-quality vector representations
- **Mistral** - Advanced language model embeddings with excellent performance characteristics
- **DeepSeek** - Cutting-edge embedding technology for specialized document types

This multi-provider approach gives users flexibility to choose the best embedding solution for their specific needs, considering factors like cost, performance, and specialized capabilities.

## Installation
```bash
pip install docvector
```

## Quick Start
```python
from docvector import DocumentProcessor, MistralEmbeddings, PineconeStore

# Initialize the agent
processor = DocumentProcessor(
    embeddings=MistralEmbeddings(),
    vector_store=PineconeStore()
)

# Process a document
document = processor.process_document("path/to/document.pdf")

# Search for similar content
results = processor.search("your query here")
```

## Using Different Embedding Providers

### With OpenAI
```python
from docvector import DocumentProcessor, OpenAIEmbeddings, QdrantStore

processor = DocumentProcessor(
    embeddings=OpenAIEmbeddings(),
    vector_store=QdrantStore()
)
```

### With DeepSeek
```python
from docvector import DocumentProcessor, DeepSeekEmbeddings, WeaviateStore

processor = DocumentProcessor(
    embeddings=DeepSeekEmbeddings(),
    vector_store=WeaviateStore()
)
```

## Configuration
Create a `.env` file with your API keys:
```env
MISTRAL_API_KEY=your_mistral_key
OPENAI_API_KEY=your_openai_key
DEEPSEEK_API_KEY=your_deepseek_key
PINECONE_API_KEY=your_pinecone_key
```

## Documentation
For detailed documentation, visit our [Documentation](https://github.com/jabbir-doodle/DocVector-/blob/main/README.md).

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.