# DocVector: Modern Document Processing & Semantic Search Platform

![Architecture Diagram](https://github.com/jabbir-doodle/DocVector-/raw/main/arc.png)

DocVector is a modern, developer-friendly platform for document ingestion, chunking, embedding, and semantic search—ideal for chatbot developers, search engines, and LLM-powered apps.

---

## 🚀 Features
- **Drag-and-drop Web UI** for document upload and management
- **REST API** for ingestion, processing, and semantic search
- **Multi-provider Embeddings** (OpenAI, Mistral, DeepSeek, etc.)
- **Flexible Vector Storage** (Qdrant, Pinecone, Weaviate, Milvus)
- **Settings & Admin Endpoints** for easy configuration
- **No sensitive info committed**—API keys are always loaded from `.env`

---

## 🖥️ Frontend UI
- Modern drag-and-drop upload area
- Real-time feedback on upload and processing
- Settings panel for embedding/vector store selection
- Search interface for semantic queries (API-based)

---

## 🛠️ API Endpoints

| Endpoint         | Method | Description                                  |
|-----------------|--------|----------------------------------------------|
| `/upload`       | POST   | Upload a document (PDF, DOCX, TXT, etc.)     |
| `/process`      | POST   | Process a document by ID (chunk & embed)     |
| `/search`       | POST   | Semantic search for relevant chunks          |
| `/vector-stats` | GET    | Get vector store/document statistics         |
| `/clear-vectors`| POST   | Clear all vectors (admin)                    |
| `/settings`     | GET/POST | Get or update settings (embedding, store)   |

---

## ⚡ Quick Start

### 1. **Install dependencies**
```bash
pip install -e .
```

### 2. **Create your `.env` file**
```env
OPENAI_API_KEY=your_openai_key
MISTRAL_API_KEY=your_mistral_key
QDRANT_URL=http://localhost:6333
# ...other keys as needed
```

### 3. **Run the Flask app**
```bash
python app.py
```

### 4. **Open the UI**
Go to [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🧑‍💻 Example API Usage

### **Upload a Document**
```bash
curl -F "file=@yourfile.pdf" http://localhost:5000/upload
```

### **Process a Document**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"document_id": "your_doc_id"}' \
  http://localhost:5000/process
```

### **Semantic Search**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"query": "What is DocVector?"}' \
  http://localhost:5000/search
```

---

## 🛡️ Security & Best Practices
- **Never commit your `.env` or API keys.**
- `.env` is in `.gitignore` by default.
- All keys are loaded from environment variables.
- Review all staged files with `git status` before committing.

---

## 📝 Developer Notes
- **Frontend:** Edit `templates/index.html` and `static/` for UI changes.
- **Backend:** Main logic in `app.py` and `src/docvector/`.
- **Extending:** Add new embedding providers or vector stores by editing `src/docvector/` modules.
- **Testing:** See `examples/test_setup.py` for test scripts.

---

## 🤖 For Chatbot & LLM Developers
- Use `/upload` and `/search` endpoints to build RAG (retrieval-augmented generation) bots.
- Integrate with any language (Python, Node.js, etc.) using simple HTTP requests.
- See API examples above for quick integration.

---

## 📚 Documentation
- For full docs, see the [GitHub Repository](https://github.com/jabbir-doodle/DocVector-).

---

## 🪪 License
This project is licensed under the MIT License.