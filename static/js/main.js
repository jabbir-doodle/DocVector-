/**
 * DocVector - Main JavaScript
 * 
 * This file contains all the core functionality for the DocVector UI.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the UI
    initUI();

    // Initialize event listeners
    initEventListeners();

    // Check for current document
    const documentId = localStorage.getItem('currentDocumentId');
    const documentName = localStorage.getItem('currentDocumentName');
    if (documentId && documentName) {
        document.getElementById('currentDocument').textContent = documentName;
    }

    // Update vector stats
    updateVectorStats();
});

/**
 * Initialize the UI components
 */
function initUI() {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'false') {
        document.body.classList.add('light-theme');
        document.getElementById('themeToggleIcon').className = 'fas fa-sun';
    }

    // Initialize similarity threshold display if exists
    const similarityThreshold = document.getElementById('similarityThreshold');
    const thresholdValue = document.getElementById('thresholdValue');
    if (similarityThreshold && thresholdValue) {
        thresholdValue.textContent = similarityThreshold.value;
    }
}

/**
 * Initialize all event listeners
 */
function initEventListeners() {
    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if (toggleBtn) {
        const toggleIcon = toggleBtn.querySelector('i');
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-collapsed');
            toggleIcon.classList.toggle('fa-chevron-left');
            toggleIcon.classList.toggle('fa-chevron-right');
        });
    }

    // Mobile navigation toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleTabNavigation);
    });

    // Provider and Store selection
    const providerOptions = document.querySelectorAll('[data-provider]');
    providerOptions.forEach(option => {
        option.addEventListener('click', () => selectProvider(option));
    });

    const storeOptions = document.querySelectorAll('[data-store]');
    storeOptions.forEach(option => {
        option.addEventListener('click', () => selectStore(option));
    });

    // File upload handling
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileChange);
    }

    // Process button
    const startProcessingBtn = document.getElementById('startProcessingBtn');
    if (startProcessingBtn) {
        startProcessingBtn.addEventListener('click', processDocument);
    }

    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Similarity threshold range input
    const similarityThreshold = document.getElementById('similarityThreshold');
    const thresholdValue = document.getElementById('thresholdValue');
    if (similarityThreshold && thresholdValue) {
        similarityThreshold.addEventListener('input', function () {
            thresholdValue.textContent = this.value;
        });
    }

    // Vector Store Management
    const refreshVectorsBtn = document.getElementById('refreshVectorsBtn');
    if (refreshVectorsBtn) {
        refreshVectorsBtn.addEventListener('click', refreshVectorStats);
    }

    const clearVectorsBtn = document.getElementById('clearVectorsBtn');
    if (clearVectorsBtn) {
        clearVectorsBtn.addEventListener('click', clearVectorStore);
    }

    // Settings Management
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }

    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', resetSettings);
    }

    // Password visibility toggle
    const toggleVisibilityBtns = document.querySelectorAll('.toggle-visibility-btn');
    if (toggleVisibilityBtns) {
        toggleVisibilityBtns.forEach(btn => {
            btn.addEventListener('click', togglePasswordVisibility);
        });
    }
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isDarkTheme = !document.body.classList.contains('light-theme');
    localStorage.setItem('darkTheme', isDarkTheme);

    const themeToggleIcon = document.getElementById('themeToggleIcon');
    themeToggleIcon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
}

/**
 * Handle tab navigation
 */
function handleTabNavigation(e) {
    e.preventDefault();

    const tabId = this.getAttribute('data-tab');
    const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');

    // Update active nav items
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(nav => nav.classList.add('active'));

    // Show corresponding tab content
    tabContents.forEach(tab => {
        tab.style.display = 'none';
        if (tab.id === `${tabId}-tab`) {
            tab.style.display = 'block';
        }
    });

    // Update page title
    const titleElement = this.querySelector('.nav-text, .mobile-nav-text');
    if (titleElement && pageTitle) {
        pageTitle.textContent = titleElement.textContent;
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
    }
}

/**
 * Select embedding provider
 */
function selectProvider(option) {
    const providerOptions = document.querySelectorAll('[data-provider]');
    providerOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    // Update selected provider in process tab
    const selectedProvider = option.querySelector('.option-item-left span').textContent;
    const selectedEmbeddingModel = document.getElementById('selectedEmbeddingModel');
    if (selectedEmbeddingModel) {
        selectedEmbeddingModel.textContent = selectedProvider;
    }

    // Update in vector tab
    const embeddingModel = document.getElementById('embeddingModel');
    if (embeddingModel) {
        embeddingModel.textContent = selectedProvider;
    }
}

/**
 * Select vector store
 */
function selectStore(option) {
    const storeOptions = document.querySelectorAll('[data-store]');
    storeOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    // Update selected store in various locations
    const selectedStore = option.querySelector('.option-item-left span').textContent;

    const selectedVectorStore = document.getElementById('selectedVectorStore');
    if (selectedVectorStore) {
        selectedVectorStore.textContent = selectedStore;
    }

    const searchVectorStore = document.getElementById('searchVectorStore');
    if (searchVectorStore) {
        searchVectorStore.textContent = selectedStore;
    }

    const vectorStore = document.getElementById('vectorStore');
    if (vectorStore) {
        vectorStore.textContent = selectedStore;
    }
}

/**
 * Handle drag over event for file upload
 */
function handleDragOver(e) {
    e.preventDefault();
    this.style.borderColor = '#3b82f6';
}

/**
 * Handle drag leave event for file upload
 */
function handleDragLeave() {
    this.style.borderColor = '';
}

/**
 * Handle drop event for file upload
 */
function handleDrop(e) {
    e.preventDefault();
    this.style.borderColor = '';
    const files = e.dataTransfer.files;
    if (files.length) handleFile(files[0]);
}

/**
 * Handle file input change
 */
function handleFileChange(e) {
    if (e.target.files.length) handleFile(e.target.files[0]);
}

/**
 * Process the uploaded file
 */
function handleFile(file) {
    const dropZone = document.getElementById('dropZone');
    const formData = new FormData();
    formData.append('file', file);

    // Show loading state
    dropZone.innerHTML = '<i class="fas fa-spinner fa-spin upload-icon"></i><p class="upload-text">Processing...</p>';

    // Send file to server
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showResult(data.error, false);
                showNotification(data.error, 'error');
            } else {
                showResult(data, true);
                updateDocumentDetails(data.document_details);

                // Store document ID and name
                localStorage.setItem('currentDocumentId', data.document_details.document_id);
                localStorage.setItem('currentDocumentName', data.document_details.title);

                // Update current document in process tab
                const currentDocument = document.getElementById('currentDocument');
                if (currentDocument) {
                    currentDocument.textContent = data.document_details.title;
                }

                showNotification('Document uploaded successfully!', 'success');
            }
        })
        .catch(error => {
            showResult('Error uploading file: ' + error, false);
            showNotification('Error uploading file: ' + error, 'error');
        })
        .finally(() => {
            // Reset upload area
            resetUploadArea();
        });
}

/**
 * Reset the upload area to its initial state
 */
function resetUploadArea() {
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.innerHTML = '<i class="fas fa-cloud-upload-alt upload-icon"></i><p class="upload-text">Drag and drop your documents</p><p class="upload-hint">or click to select files (PDF, DOCX, TXT, HTML)</p>';
    }
}

/**
 * Show the upload result
 */
function showResult(data, isSuccess) {
    const resultPanel = document.getElementById('resultPanel');
    if (!resultPanel) return;

    resultPanel.style.display = 'block';
    const resultHeader = resultPanel.querySelector('.result-header');
    const resultTitle = document.getElementById('resultTitle');
    const documentDetails = document.querySelector('.document-details');

    if (isSuccess) {
        resultHeader.classList.remove('error');
        resultTitle.textContent = data.message;
        if (documentDetails) {
            documentDetails.style.display = 'block';
        }
    } else {
        resultHeader.classList.add('error');
        resultTitle.textContent = data;
        if (documentDetails) {
            documentDetails.style.display = 'none';
        }
    }

    // Scroll to result panel
    resultPanel.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Update document details in the result panel
 */
function updateDocumentDetails(details) {
    document.getElementById('docTitle').textContent = details.title;
    document.getElementById('docType').textContent = details.file_type.toUpperCase();
    document.getElementById('docSize').textContent = formatFileSize(details.file_size);
    document.getElementById('docCreated').textContent = new Date(details.created_at).toLocaleString();
    document.getElementById('docModified').textContent = new Date(details.modified_at).toLocaleString();
    document.getElementById('docChunks').textContent = details.number_of_chunks;
    document.getElementById('docId').textContent = details.document_id;
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Show a notification
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notificationsContainer = document.getElementById('notificationsContainer');
    if (!notificationsContainer) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type ? 'notification-' + type : ''}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas fa-${getIconForType(type)}"></i>
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    notificationsContainer.appendChild(notification);

    // Auto-dismiss after duration
    const dismissTimeout = setTimeout(() => {
        notification.classList.add('notification-hiding');
        setTimeout(() => notification.remove(), 300);
    }, duration);

    // Manual dismiss
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(dismissTimeout);
        notification.classList.add('notification-hiding');
        setTimeout(() => notification.remove(), 300);
    });
}

/**
 * Get the appropriate icon for notification type
 */
function getIconForType(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

/**
 * Process the document
 */
function processDocument() {
    const documentId = localStorage.getItem('currentDocumentId');
    const documentName = document.getElementById('currentDocument').textContent;

    if (documentName === 'Not selected' || !documentId) {
        showNotification('Please upload a document first', 'warning');
        return;
    }

    // Get selected provider and store
    const selectedProvider = document.querySelector('.option-item[data-provider].selected')?.dataset.provider || 'mistral';
    const selectedStore = document.querySelector('.option-item[data-store].selected')?.dataset.store || 'pinecone';
    const chunkingStrategy = document.getElementById('chunkingStrategy')?.value || 'semantic';

    // Show processing notification
    showNotification('Processing started...', 'info');

    // Call the processing API
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            document_id: documentId,
            embedding_provider: selectedProvider,
            vector_store: selectedStore,
            chunking_strategy: chunkingStrategy
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'error');
            } else {
                showNotification(`Document processed successfully! Created ${data.chunks_created} chunks in ${data.processing_time}s.`, 'success');

                // Start the visualization if available
                startVisualization();

                // Update vector stats
                updateVectorStats();
            }
        })
        .catch(error => {
            showNotification('Error processing document: ' + error, 'error');
        });
}

/**
 * Start the document processing visualization
 */
function startVisualization() {
    if (typeof DocVectorVisualization !== 'undefined') {
        const vizContainer = document.getElementById('processingVisualization');
        if (vizContainer) {
            // Clear previous visualization
            vizContainer.innerHTML = '<h3 class="visualization-title">Processing Pipeline Visualization</h3>';

            // Create new visualization
            const visualization = new DocVectorVisualization(vizContainer);
            visualization.play();
        }
    }
}

/**
 * Perform semantic search
 */
function performSearch() {
    const searchQuery = document.getElementById('searchQuery');
    if (!searchQuery) return;

    const query = searchQuery.value.trim();

    if (!query) {
        showNotification('Please enter a search query', 'warning');
        return;
    }

    // Get search options
    const vectorStore = document.querySelector('.option-item[data-store].selected')?.dataset.store || 'pinecone';
    const maxResults = document.getElementById('maxResults')?.value || 5;
    const similarityThreshold = document.getElementById('similarityThreshold')?.value || 70;

    // Show searching notification
    showNotification('Searching...', 'info');

    // Call the search API
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            vector_store: vectorStore,
            max_results: maxResults,
            similarity_threshold: similarityThreshold
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'error');
            } else {
                displaySearchResults(data);
                showNotification(`Search completed! Found ${data.total_results} results.`, 'success');
            }
        })
        .catch(error => {
            showNotification('Error searching documents: ' + error, 'error');
        });
}

/**
 * Display search results
 */
function displaySearchResults(data) {
    const resultsContainer = document.getElementById('searchResults');
    const resultsList = document.getElementById('resultsList');
    const resultsCount = document.getElementById('resultsCount');
    const searchTime = document.getElementById('searchTime');

    if (!resultsContainer || !resultsList) return;

    // Show results container
    resultsContainer.style.display = 'block';

    // Update results count and search time
    if (resultsCount) resultsCount.textContent = data.total_results;
    if (searchTime) searchTime.textContent = data.search_time;

    // Clear previous results
    resultsList.innerHTML = '';

    // Add each result
    if (data.results && data.results.length > 0) {
        data.results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';

            const similarityPercent = Math.round(result.similarity * 100);

            resultItem.innerHTML = `
                <div class="result-header">
                    <div class="result-title">${result.document_title}</div>
                    <div class="result-score">${similarityPercent}% match</div>
                </div>
                <div class="result-content">
                    <p>${result.chunk_text}</p>
                </div>
                <div class="result-footer">
                    <div class="result-meta">Document ID: ${result.document_id}</div>
                    <div class="result-meta">Chunk ID: ${result.chunk_id}</div>
                </div>
            `;

            resultsList.appendChild(resultItem);
        });
    } else {
        resultsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search empty-icon"></i>
                <p>No results found for "${data.query}"</p>
            </div>
        `;
    }

    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Update vector store statistics
 */
function updateVectorStats() {
    const totalDocuments = document.getElementById('totalDocuments');
    const totalChunks = document.getElementById('totalChunks');
    const documentList = document.getElementById('documentList');

    if (!totalDocuments || !totalChunks || !documentList) return;

    // Call the stats API
    fetch('/vector-stats')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'error');
            } else {
                // Update stats
                totalDocuments.textContent = data.total_documents;
                totalChunks.textContent = data.total_chunks;

                // Update document list
                documentList.innerHTML = '';

                if (data.recent_documents && data.recent_documents.length > 0) {
                    data.recent_documents.forEach(doc => {
                        const docItem = document.createElement('div');
                        docItem.className = 'document-item';
                        docItem.innerHTML = `
                        <div class="document-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="document-info">
                            <div class="document-title">${doc.title}</div>
                            <div class="document-meta">
                                <span>${doc.chunks} chunks</span>
                                <span>|</span>
                                <span>${doc.date}</span>
                            </div>
                        </div>
                        <div class="document-actions">
                            <button class="doc-action-btn" title="View Details" data-document-id="${doc.id}">
                                <i class="fas fa-info-circle"></i>
                            </button>
                            <button class="doc-action-btn" title="Remove" data-document-id="${doc.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                        documentList.appendChild(docItem);
                    });

                    // Add event listeners to document action buttons
                    document.querySelectorAll('.doc-action-btn').forEach(btn => {
                        btn.addEventListener('click', handleDocumentAction);
                    });
                } else {
                    documentList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search empty-icon"></i>
                        <p>No documents found in vector store</p>
                    </div>
                `;
                }
            }
        })
        .catch(error => {
            showNotification('Error updating vector stats: ' + error, 'error');
        });
}

/**
 * Refresh vector store statistics
 */
function refreshVectorStats() {
    updateVectorStats();
    showNotification('Vector store statistics refreshed', 'info');
}

/**
 * Clear the vector store
 */
function clearVectorStore() {
    if (confirm('Are you sure you want to clear the vector store? This action cannot be undone.')) {
        fetch('/clear-vectors', {
            method: 'POST'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    showNotification(data.error, 'error');
                } else {
                    document.getElementById('totalDocuments').textContent = '0';
                    document.getElementById('totalChunks').textContent = '0';
                    document.getElementById('documentList').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search empty-icon"></i>
                        <p>No documents found in vector store</p>
                    </div>
                `;
                    showNotification('Vector store cleared successfully', 'success');
                }
            })
            .catch(error => {
                showNotification('Error clearing vector store: ' + error, 'error');
            });
    }
}

/**
 * Handle document action (view details or remove)
 */
function handleDocumentAction() {
    const action = this.title;
    const documentId = this.getAttribute('data-document-id');

    if (action === 'View Details') {
        showNotification(`Viewing details for document ${documentId}`, 'info');
        // Implement document details view
    } else if (action === 'Remove') {
        if (confirm(`Are you sure you want to remove document ${documentId}?`)) {
            showNotification(`Document ${documentId} removed`, 'success');
            // Implement document removal
            this.closest('.document-item').remove();
        }
    }
}

/**
 * Save settings
 */
function saveSettings() {
    const settings = {
        default_embedding_provider: document.getElementById('defaultEmbeddingProvider')?.value,
        default_vector_store: document.getElementById('defaultVectorStore')?.value,
        default_chunking_strategy: document.getElementById('defaultChunkingStrategy')?.value,
        api_keys: {
            openai: document.getElementById('openaiKey')?.value,
            mistral: document.getElementById('mistralKey')?.value,
            deepseek: document.getElementById('deepseekKey')?.value,
            pinecone: document.getElementById('pineconeKey')?.value
        }
    };

    fetch('/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                showNotification(data.error, 'error');
            } else {
                showNotification('Settings saved successfully', 'success');
            }
        })
        .catch(error => {
            showNotification('Error saving settings: ' + error, 'error');
        });
}

/**
 * Reset settings to defaults
 */
function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        // Reset form fields to defaults
        const defaultEmbeddingProvider = document.getElementById('defaultEmbeddingProvider');
        const defaultVectorStore = document.getElementById('defaultVectorStore');
        const defaultChunkingStrategy = document.getElementById('defaultChunkingStrategy');
        const openaiKey = document.getElementById('openaiKey');
        const mistralKey = document.getElementById('mistralKey');
        const deepseekKey = document.getElementById('deepseekKey');
        const pineconeKey = document.getElementById('pineconeKey');

        if (defaultEmbeddingProvider) defaultEmbeddingProvider.value = 'mistral';
        if (defaultVectorStore) defaultVectorStore.value = 'pinecone';
        if (defaultChunkingStrategy) defaultChunkingStrategy.value = 'semantic';

        // Clear API keys
        if (openaiKey) openaiKey.value = '';
        if (mistralKey) mistralKey.value = '';
        if (deepseekKey) deepseekKey.value = '';
        if (pineconeKey) pineconeKey.value = '';

        showNotification('Settings reset to defaults', 'info');
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}