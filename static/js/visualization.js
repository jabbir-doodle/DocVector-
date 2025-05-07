/**
 * DocVector Processing Visualization
 * 
 * This script adds an interactive visualization to demonstrate the document processing pipeline.
 * It shows text extraction, chunking, embedding, and vector storage with animations.
 */

// Add this script to static/js/visualization.js

document.addEventListener('DOMContentLoaded', function () {
    // Check if visualization container exists on the page
    const visualizationContainer = document.getElementById('processingVisualization');
    if (!visualizationContainer) return;

    // Initialize the visualization
    const visualization = new DocVectorVisualization(visualizationContainer);

    // Add control buttons
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'viz-controls';
    controlsContainer.innerHTML = `
        <button id="vizPlayBtn" class="viz-btn primary">Play Animation</button>
        <button id="vizStepBtn" class="viz-btn">Step Forward</button>
        <button id="vizResetBtn" class="viz-btn">Reset</button>
    `;
    visualizationContainer.appendChild(controlsContainer);

    // Set up event listeners
    document.getElementById('vizPlayBtn').addEventListener('click', function () {
        if (this.textContent === 'Play Animation') {
            this.textContent = 'Pause';
            visualization.play();
        } else {
            this.textContent = 'Play Animation';
            visualization.pause();
        }
    });

    document.getElementById('vizStepBtn').addEventListener('click', function () {
        document.getElementById('vizPlayBtn').textContent = 'Play Animation';
        visualization.stepForward();
    });

    document.getElementById('vizResetBtn').addEventListener('click', function () {
        document.getElementById('vizPlayBtn').textContent = 'Play Animation';
        visualization.reset();
    });
});

/**
 * DocVector Visualization Class
 */
class DocVectorVisualization {
    constructor(container) {
        this.container = container;
        this.currentStep = 0;
        this.maxSteps = 4;
        this.isPlaying = false;
        this.animationInterval = null;

        // Sample document content
        this.documentContent = `# DocVector AI Agent

DocVector is an autonomous document processing agent that leverages 
multiple LLM providers to transform, analyze, and search through 
documents intelligently.

## Key Features
- Intelligent text chunking
- Multi-format support
- Automatic metadata extraction
- Multi-Provider LLM Integration`;

        // Sample chunks
        this.chunks = [
            "# DocVector AI Agent\nDocVector is an autonomous document processing agent that leverages multiple LLM providers",
            "to transform, analyze, and search through documents intelligently.\n\n## Key Features",
            "- Intelligent text chunking\n- Multi-format support\n- Automatic metadata extraction\n- Multi-Provider LLM Integration"
        ];

        // Sample embeddings (2D projections for visualization)
        this.embeddings = [
            { x: 0.2, y: 0.7, text: this.chunks[0] },
            { x: 0.4, y: 0.3, text: this.chunks[1] },
            { x: 0.8, y: 0.5, text: this.chunks[2] }
        ];

        // Create visualization containers
        this.createVisualizations();

        // Initialize the visualization
        this.updateVisualization();
    }

    createVisualizations() {
        // Create main visualization grid
        const vizGrid = document.createElement('div');
        vizGrid.className = 'viz-grid';
        this.container.appendChild(vizGrid);

        // Document view
        const docPanel = document.createElement('div');
        docPanel.className = 'viz-panel';
        docPanel.innerHTML = `
            <div class="viz-panel-header">
                <h3><i class="fas fa-file-alt"></i> Original Document</h3>
            </div>
            <div class="viz-panel-body" id="documentPanel"></div>
        `;
        vizGrid.appendChild(docPanel);

        // Chunks view
        const chunksPanel = document.createElement('div');
        chunksPanel.className = 'viz-panel';
        chunksPanel.innerHTML = `
            <div class="viz-panel-header">
                <h3><i class="fas fa-puzzle-piece"></i> Semantic Chunks</h3>
            </div>
            <div class="viz-panel-body" id="chunksPanel"></div>
        `;
        vizGrid.appendChild(chunksPanel);

        // Embeddings view
        const embeddingsPanel = document.createElement('div');
        embeddingsPanel.className = 'viz-panel';
        embeddingsPanel.innerHTML = `
            <div class="viz-panel-header">
                <h3><i class="fas fa-project-diagram"></i> Vector Embeddings</h3>
            </div>
            <div class="viz-panel-body" id="embeddingsPanel"></div>
        `;
        vizGrid.appendChild(embeddingsPanel);

        // Progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'viz-progress';
        progressBar.innerHTML = `
            <div class="viz-progress-track">
                <div class="viz-progress-fill" id="progressFill"></div>
            </div>
            <div class="viz-steps" id="progressSteps"></div>
        `;
        this.container.insertBefore(progressBar, vizGrid);

        // Create steps
        const stepsContainer = document.getElementById('progressSteps');
        const steps = [
            { icon: 'fas fa-file-alt', label: 'Document' },
            { icon: 'fas fa-puzzle-piece', label: 'Chunking' },
            { icon: 'fas fa-microchip', label: 'Embedding' },
            { icon: 'fas fa-database', label: 'Storage' },
            { icon: 'fas fa-search', label: 'Search Ready' }
        ];

        steps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'viz-step';
            stepEl.dataset.step = index;
            stepEl.innerHTML = `
                <div class="viz-step-icon"><i class="${step.icon}"></i></div>
                <div class="viz-step-label">${step.label}</div>
            `;
            stepsContainer.appendChild(stepEl);
        });
    }

    updateVisualization() {
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${(this.currentStep / this.maxSteps) * 100}%`;

        // Update steps
        const steps = document.querySelectorAll('.viz-step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index === this.currentStep) {
                step.classList.add('active');
            } else if (index < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update document panel
        const documentPanel = document.getElementById('documentPanel');
        if (this.currentStep >= 0) {
            documentPanel.innerHTML = `<pre class="doc-content">${this.documentContent}</pre>`;
            documentPanel.classList.add('active');
        } else {
            documentPanel.innerHTML = '';
            documentPanel.classList.remove('active');
        }

        // Update chunks panel
        const chunksPanel = document.getElementById('chunksPanel');
        if (this.currentStep >= 1) {
            chunksPanel.innerHTML = this.chunks.map((chunk, i) =>
                `<div class="chunk" data-index="${i}"><div class="chunk-label">Chunk ${i + 1}</div><pre>${chunk}</pre></div>`
            ).join('');

            setTimeout(() => {
                document.querySelectorAll('.chunk').forEach(el => {
                    el.classList.add('visible');
                });
            }, 100);

            chunksPanel.classList.add('active');
        } else {
            chunksPanel.innerHTML = '';
            chunksPanel.classList.remove('active');
        }

        // Update embeddings panel
        const embeddingsPanel = document.getElementById('embeddingsPanel');
        if (this.currentStep >= 2) {
            embeddingsPanel.innerHTML = '<div class="embedding-space"></div>';
            const embeddingSpace = embeddingsPanel.querySelector('.embedding-space');

            // Add vectors with delay for animation
            setTimeout(() => {
                this.embeddings.forEach((emb, i) => {
                    const vector = document.createElement('div');
                    vector.className = 'vector';
                    vector.style.left = `${emb.x * 100}%`;
                    vector.style.top = `${emb.y * 100}%`;
                    vector.dataset.index = i;

                    // Connect vectors with lines
                    if (i > 0) {
                        const prevEmb = this.embeddings[i - 1];
                        const line = document.createElement('div');
                        line.className = 'vector-line';

                        const angle = Math.atan2(emb.y - prevEmb.y, emb.x - prevEmb.x);
                        const distance = Math.sqrt(
                            Math.pow(emb.x - prevEmb.x, 2) +
                            Math.pow(emb.y - prevEmb.y, 2)
                        ) * 100;

                        line.style.width = `${distance}%`;
                        line.style.left = `${prevEmb.x * 100}%`;
                        line.style.top = `${prevEmb.y * 100}%`;
                        line.style.transform = `rotate(${angle}rad)`;
                        line.style.transformOrigin = 'left center';

                        embeddingSpace.appendChild(line);
                    }

                    embeddingSpace.appendChild(vector);

                    // Add tooltip with chunk text
                    const tooltip = document.createElement('div');
                    tooltip.className = 'vector-tooltip';
                    tooltip.innerHTML = `<pre>${this.chunks[i]}</pre>`;
                    vector.appendChild(tooltip);

                    // Show with delay for animation
                    setTimeout(() => {
                        vector.classList.add('visible');
                        if (i > 0) {
                            document.querySelectorAll('.vector-line')[i - 1].classList.add('visible');
                        }
                    }, i * 200);
                });
            }, 300);

            embeddingsPanel.classList.add('active');
        } else {
            embeddingsPanel.innerHTML = '';
            embeddingsPanel.classList.remove('active');
        }

        // Add database storage visualization if step is 3 or higher
        if (this.currentStep >= 3) {
            const dbContainer = document.createElement('div');
            dbContainer.className = 'db-container';
            dbContainer.innerHTML = `
                <div class="db-icon"><i class="fas fa-database"></i></div>
                <div class="db-label">Vectors stored in database</div>
                <div class="db-items">
                    ${this.chunks.map((_, i) => `<div class="db-item" data-index="${i}"></div>`).join('')}
                </div>
            `;
            embeddingsPanel.appendChild(dbContainer);

            // Animate DB items
            setTimeout(() => {
                document.querySelectorAll('.db-item').forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('stored');
                    }, i * 200);
                });
            }, 500);
        }

        // Add search visualization if step is 4
        if (this.currentStep >= 4) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-icon"><i class="fas fa-search"></i></div>
                <div class="search-label">Search index ready</div>
                <div class="search-demo">
                    <div class="search-input">
                        <input type="text" placeholder="Sample query: document processing" disabled>
                        <button disabled><i class="fas fa-search"></i></button>
                    </div>
                    <div class="search-results">
                        <div class="search-result">
                            <div class="result-score">92% match</div>
                            <div class="result-text">${this.chunks[0]}</div>
                        </div>
                    </div>
                </div>
            `;

            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results-container';
            resultsContainer.appendChild(searchContainer);

            this.container.appendChild(resultsContainer);
        } else {
            const existingSearch = document.querySelector('.search-results-container');
            if (existingSearch) {
                existingSearch.remove();
            }
        }
    }

    play() {
        this.isPlaying = true;
        this.animationInterval = setInterval(() => {
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.updateVisualization();
            } else {
                this.pause();
                document.getElementById('vizPlayBtn').textContent = 'Play Animation';
            }
        }, 2000);
    }

    pause() {
        this.isPlaying = false;
        clearInterval(this.animationInterval);
    }

    stepForward() {
        this.pause();
        if (this.currentStep < this.maxSteps) {
            this.currentStep++;
            this.updateVisualization();
        }
    }

    reset() {
        this.pause();
        this.currentStep = 0;
        this.updateVisualization();

        // Remove search container if it exists
        const existingSearch = document.querySelector('.search-results-container');
        if (existingSearch) {
            existingSearch.remove();
        }
    }
}