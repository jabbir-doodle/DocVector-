"""
DocVector - Modern Flask Implementation

This is a complete Flask application to serve the DocVector UI
and connect with the DocVector processing engine.
"""

from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import json
import uuid
import time
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Import DocVector components (uncomment and adjust for actual use)
# try:
#     from docvector.processor import DocumentProcessor
#     from docvector.embeddings import OpenAIEmbeddings, MistralEmbeddings, DeepSeekEmbeddings
#     from docvector.vector_stores import PineconeStore, QdrantStore, WeaviateStore
#     DOCVECTOR_IMPORTED = True
# except ImportError:
#     logger.warning("DocVector modules not imported. Running in demo mode.")
#     DOCVECTOR_IMPORTED = False

# For demonstration, create mock classes
class MockEmbedding:
    def __init__(self, name="mistral"):
        self.name = name
        
    def __str__(self):
        return f"{self.name.capitalize()} Embeddings"

class MockVectorStore:
    def __init__(self, name="pinecone"):
        self.name = name
        
    def __str__(self):
        return f"{self.name.capitalize()} Store"

class MockProcessor:
    def __init__(self, embeddings=None, vector_store=None):
        self.embeddings = embeddings or MockEmbedding()
        self.vector_store = vector_store or MockVectorStore()
        
    def process_document(self, file_path):
        # Mock document processing
        time.sleep(1)  # Simulate processing time
        extension = os.path.splitext(file_path)[1].lower()
        
        # Return a simple document structure
        return {
            "id": os.path.basename(file_path),
            "path": file_path,
            "chunks": [f"Chunk {i}" for i in range(1, 13)],
            "embedding_model": str(self.embeddings),
            "vector_store": str(self.vector_store),
            "metadata": {
                "title": os.path.basename(file_path),
                "file_type": extension[1:] if extension else "unknown",
                "created_at": datetime.now().isoformat()
            }
        }
        
    def search(self, query, limit=5):
        # Mock search results
        time.sleep(0.5)  # Simulate search time
        return [
            {
                "document_id": f"doc{i}",
                "document_title": f"Sample Document {i}.pdf",
                "similarity": round(0.95 - (i * 0.05), 2),
                "chunk_text": f"This is a sample chunk {i} that matches the query '{query}'.",
                "chunk_id": f"chunk{i}"
            }
            for i in range(1, limit + 1)
        ]

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'html', 'md', 'json'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_type(filename):
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else 'unknown'

def get_embedding_provider(provider_name):
    # Uncomment for actual implementation
    # providers = {
    #     'openai': OpenAIEmbeddings(),
    #     'mistral': MistralEmbeddings(),
    #     'deepseek': DeepSeekEmbeddings()
    # }
    # return providers.get(provider_name, MistralEmbeddings())
    
    # For demo
    return MockEmbedding(provider_name)

def get_vector_store(store_name):
    # Uncomment for actual implementation
    # stores = {
    #     'pinecone': PineconeStore(),
    #     'qdrant': QdrantStore(),
    #     'weaviate': WeaviateStore()
    # }
    # return stores.get(store_name, PineconeStore())
    
    # For demo
    return MockVectorStore(store_name)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        try:
            # Generate a unique filename
            file_ext = get_file_type(file.filename)
            unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Save the file
            file.save(file_path)
            
            # Get file size
            file_size = os.path.getsize(file_path)
            
            # Create document details
            document_details = {
                'title': file.filename,
                'file_type': file_ext,
                'file_size': file_size,
                'created_at': datetime.now().isoformat(),
                'modified_at': datetime.now().isoformat(),
                'number_of_chunks': 12,  # This would be determined by the processor
                'document_id': unique_filename
            }
            
            logger.info(f"File uploaded: {file.filename} (ID: {unique_filename})")
            
            return jsonify({
                'message': 'File uploaded successfully',
                'document_details': document_details
            })
        except Exception as e:
            logger.error(f"Error uploading file: {str(e)}")
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/process', methods=['POST'])
def process_document():
    data = request.json
    
    if not data or 'document_id' not in data:
        return jsonify({'error': 'No document ID provided'}), 400
    
    try:
        document_id = data['document_id']
        embedding_provider = data.get('embedding_provider', 'mistral')
        vector_store = data.get('vector_store', 'pinecone')
        chunking_strategy = data.get('chunking_strategy', 'semantic')
        
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], document_id)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'Document not found'}), 404
        
        # Initialize processor
        # In production, use:
        # processor = DocumentProcessor(
        #     embeddings=get_embedding_provider(embedding_provider),
        #     vector_store=get_vector_store(vector_store)
        # )
        processor = MockProcessor(
            embeddings=get_embedding_provider(embedding_provider),
            vector_store=get_vector_store(vector_store)
        )
        
        # Process the document
        start_time = time.time()
        document = processor.process_document(file_path)
        processing_time = time.time() - start_time
        
        processing_result = {
            'status': 'success',
            'document_id': document_id,
            'chunks_created': len(document['chunks']) if 'chunks' in document else 0,
            'embedding_model': embedding_provider,
            'vector_store': vector_store,
            'chunking_strategy': chunking_strategy,
            'processing_time': round(processing_time, 2),
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f"Document processed: {document_id}")
        
        return jsonify(processing_result)
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/search', methods=['POST'])
def search_documents():
    data = request.json
    
    if not data or 'query' not in data:
        return jsonify({'error': 'No search query provided'}), 400
    
    try:
        query = data['query']
        vector_store = data.get('vector_store', 'pinecone')
        max_results = data.get('max_results', 5)
        similarity_threshold = data.get('similarity_threshold', 70) / 100
        
        # Initialize processor with the selected vector store
        # In production, use:
        # processor = DocumentProcessor(
        #     vector_store=get_vector_store(vector_store)
        # )
        processor = MockProcessor(
            vector_store=get_vector_store(vector_store)
        )
        
        # Perform search
        start_time = time.time()
        results = processor.search(query, max_results)
        
        # Filter by similarity threshold
        results = [r for r in results if r['similarity'] >= similarity_threshold]
        
        search_time = time.time() - start_time
        
        search_results = {
            'query': query,
            'results': results,
            'total_results': len(results),
            'search_time': round(search_time, 3),
            'vector_store': vector_store,
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f"Search performed: '{query}' ({len(results)} results)")
        
        return jsonify(search_results)
    except Exception as e:
        logger.error(f"Error searching documents: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/vector-stats', methods=['GET'])
def get_vector_stats():
    try:
        # In production, fetch actual stats from your vector store
        # For demo, create mock statistics
        stats = {
            'total_documents': 3,
            'total_chunks': 36,
            'embedding_models': ['Mistral', 'OpenAI'],
            'vector_stores': ['Pinecone'],
            'recent_documents': [
                {
                    'id': 'doc1',
                    'title': 'DocVector README.md',
                    'chunks': 12,
                    'date': datetime.now().strftime('%b %d, %Y')
                },
                {
                    'id': 'doc2',
                    'title': 'Architecture Overview.docx',
                    'chunks': 8,
                    'date': datetime.now().strftime('%b %d, %Y')
                },
                {
                    'id': 'doc3',
                    'title': 'Embedding Providers.md',
                    'chunks': 16,
                    'date': datetime.now().strftime('%b %d, %Y')
                }
            ]
        }
        
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Error fetching vector stats: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/clear-vectors', methods=['POST'])
def clear_vectors():
    try:
        # In production, call your vector store clearing method
        # For demo, just return success
        return jsonify({'status': 'success', 'message': 'Vector store cleared successfully'})
    except Exception as e:
        logger.error(f"Error clearing vector store: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        try:
            settings_data = request.json
            # In production, save settings to database or config file
            # For demo, just return success
            return jsonify({'status': 'success', 'message': 'Settings saved successfully'})
        except Exception as e:
            logger.error(f"Error saving settings: {str(e)}")
            return jsonify({'error': str(e)}), 500
    else:
        # Return default settings
        default_settings = {
            'default_embedding_provider': 'mistral',
            'default_vector_store': 'pinecone',
            'default_chunking_strategy': 'semantic',
            'api_keys': {
                'openai': '',
                'mistral': '',
                'deepseek': '',
                'pinecone': ''
            }
        }
        return jsonify(default_settings)

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    # Create the templates directory if it doesn't exist
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    # Check if index.html exists in templates, if not create a basic one
    index_path = os.path.join('templates', 'index.html')
    if not os.path.exists(index_path):
        with open(index_path, 'w') as f:
            f.write('''<!DOCTYPE html>
<html>
<head>
    <title>DocVector</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="{{ url_for('static', filename='css/main.css') }}">
</head>
<body>
    <h1>DocVector Demo</h1>
    <p>This is a placeholder. Please create a proper index.html file in the templates directory.</p>
    
    <script src="{{ url_for('static', filename='js/main.js') }}"></script>
</body>
</html>''')
        logger.warning("Created a basic index.html template. Replace with your actual UI template.")
    
    # Create the static directories if they don't exist
    for dir_name in ['css', 'js', 'img']:
        static_dir = os.path.join('static', dir_name)
        if not os.path.exists(static_dir):
            os.makedirs(static_dir)
    
    logger.info("Starting DocVector server...")
    app.run(debug=True)