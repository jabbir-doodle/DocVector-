// DocVector Architecture Animation
// This script provides the interactive animation for the architecture diagram
document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Get all animated elements
    const dataPoints = [
        document.getElementById('data1'),
        document.getElementById('data2'),
        document.getElementById('data3'),
        document.getElementById('data4'),
        document.getElementById('data5'),
        document.getElementById('data6'),
        document.getElementById('data7')
    ];

    const flowPaths = [
        document.getElementById('flow1'),
        document.getElementById('flow2'),
        document.getElementById('flow3'),
        document.getElementById('flow4'),
        document.getElementById('flow5'),
        document.getElementById('flow6')
    ];

    const mainComponents = [
        document.getElementById('document-sources'),
        document.getElementById('processing-pipeline'),
        document.getElementById('extraction'),
        document.getElementById('chunking'),
        document.getElementById('embedding'),
        document.getElementById('vector-stores'),
        document.getElementById('search-engine'),
        document.getElementById('ui-section')
    ];

    // Initialize GSAP timeline
    const timeline = gsap.timeline({ paused: true });

    // Initialize the sequence
    function initAnimation() {
        // Reset all elements
        gsap.set(dataPoints, { opacity: 0 });
        gsap.set(flowPaths, { opacity: 0, strokeDashoffset: 100 });

        // Start with fade-in of main sections
        timeline.from(mainComponents, {
            duration: 0.8,
            opacity: 0,
            stagger: 0.2,
            ease: "power1.inOut"
        });

        // Document selection animation
        timeline.to('#document-icons rect', {
            duration: 0.3,
            fill: '#64b5f6',
            stagger: 0.1,
            ease: "power1.inOut",
            repeat: 1,
            yoyo: true
        });

        // Data flow sequence
        timeline.to('#data1', { duration: 0.5, opacity: 1 })
            .to('#flow1', {
                duration: 1,
                opacity: 1,
                strokeDashoffset: 0,
                ease: "none"
            })
            .to('#data1', {
                duration: 1,
                motionPath: { path: "#path1", align: "#path1" },
                ease: "none"
            }, "-=0.8")
            .to('#extraction', {
                duration: 0.3,
                scale: 1.05,
                transformOrigin: "center",
                repeat: 1,
                yoyo: true
            })
            .to('#data1', { duration: 0.5, opacity: 0 })
            .to('#flow1', { duration: 0.5, opacity: 0 });

        // Text extraction to chunking
        timeline.to('#data2', { duration: 0.5, opacity: 1 })
            .to('#flow2', {
                duration: 0.8,
                opacity: 1,
                strokeDashoffset: 0,
                ease: "none"
            })
            .to('#data2', {
                duration: 0.8,
                motionPath: { path: "#path2", align: "#path2" },
                ease: "none"
            }, "-=0.8")
            .to('#chunking', {
                duration: 0.3,
                scale: 1.05,
                transformOrigin: "center",
                repeat: 1,
                yoyo: true
            })
            .to('#chunking-strategies', {
                duration: 0.5,
                fill: '#81c784',
                repeat: 1,
                yoyo: true
            })
            .to('#data2', { duration: 0.5, opacity: 0 })
            .to('#flow2', { duration: 0.5, opacity: 0 });

        // Chunking to embedding
        timeline.to('#data3', { duration: 0.5, opacity: 1 })
            .to('#flow3', {
                duration: 1.2,
                opacity: 1,
                strokeDashoffset: 0,
                ease: "none"
            })
            .to('#data3', {
                duration: 1.2,
                motionPath: { path: "#path3", align: "#path3" },
                ease: "none"
            }, "-=1.2")
            .to('#embedding', {
                duration: 0.3,
                scale: 1.05,
                transformOrigin: "center",
                repeat: 1,
                yoyo: true
            })
            .to('#embedding-models', {
                duration: 0.5,
                fill: '#81c784',
                repeat: 1,
                yoyo: true
            })
            .to('#data3', { duration: 0.5, opacity: 0 })
            .to('#flow3', { duration: 0.5, opacity: 0 });

        // Highlight embedding provider logos
        timeline.to('#embedding-providers rect', {
            duration: 0.3,
            fill: '#c8e6c9',
            stagger: 0.15,
            repeat: 1,
            yoyo: true
        });

        // Embedding to vector store
        timeline.to('#data4', { duration: 0.5, opacity: 1 })
            .to('#flow4', {
                duration: 1.5,
                opacity: 1,
                strokeDashoffset: 0,
                ease: "none"
            })
            .to('#data4', {
                duration: 1.5,
                motionPath: { path: "#path4", align: "#path4" },
                ease: "none"
            }, "-=1.5")
            .to('#vector-stores', {
                duration: 0.3,
                scale: 1.05,
                transformOrigin: "center",
                repeat: 1,
                yoyo: true
            })
            .to('#vector-db-icons rect', {
                duration: 0.2,
                fill: '#4fc3f7',
                stagger: 0.1,
                ease: "power1.inOut",
                repeat: 1,
                yoyo: true
            })
            .to('#data4', { duration: 0.5, opacity: 0 })
            .to('#flow4', { duration: 0.5, opacity: 0 });

        // Vector store to search
        timeline.to('#data5', { duration: 0.5, opacity: 1 })
            .to('#flow5', {
                duration: 0.8,
                opacity: 1,
                strokeDashoffset: 0,
                ease: "none"
            })
            .to('#data5', {
                duration: 0.8,
                motionPath: { path: "#path5", align: "#path5" },
                ease: "none"
            }, "-=0.8")
            .to('#search-engine', {
                duration: 0.3,
                scale: 1.05,
                transformOrigin: "center",
                repeat: 1,
                yoyo: true
            })
            .to('#data5', { duration: 0.5, opacity: 0 })
            .to('#flow5', { duration: 0.5, opacity: 0 });

        // Search to UI
        timeline.to('#data6', { duration: 0.5, opacity: 1 })
            .to('#flow6', {
                duration: 1.5,
                opacity: 1,
                strokeDashoffset: 0,
                ease: "none"
            })
            .to('#data6', {
                duration: 1.5,
                motionPath: { path: "#path6", align: "#path6" },
                ease: "none"
            }, "-=1.5")
            .to('#search-panel', {
                duration: 0.3,
                scale: 1.05,
                transformOrigin: "center",
                repeat: 1,
                yoyo: true
            })
            .to('#data6', { duration: 0.5, opacity: 0 })
            .to('#flow6', { duration: 0.5, opacity: 0 });

        // UI interaction animation
        timeline.to('#search-input', {
            duration: 0.3,
            fill: '#b39ddb',
            repeat: 1,
            yoyo: true
        })
            .to('#data7', { duration: 0.5, opacity: 1 })
            .to('#search-results', {
                duration: 0.3,
                fill: '#b39ddb',
                repeat: 1,
                yoyo: true
            })
            .to(['#result1', '#result2', '#result3'], {
                duration: 0.3,
                opacity: 0,
                stagger: 0.2
            })
            .to(['#result1', '#result2', '#result3'], {
                duration: 0.5,
                opacity: 1,
                stagger: 0.2
            })
            .to('#data7', { duration: 0.5, opacity: 0 });

        // End with highlighting all components
        timeline.to([
            '#document-sources',
            '#processing-pipeline',
            '#vector-stores',
            '#search-engine',
            '#ui-section',
            '#config-section'
        ], {
            duration: 0.8,
            stroke: '#673ab7',
            strokeWidth: 3,
            ease: "power1.inOut",
            stagger: 0.1
        })
            .to([
                '#document-sources',
                '#processing-pipeline',
                '#vector-stores',
                '#search-engine',
                '#ui-section',
                '#config-section'
            ], {
                duration: 0.8,
                stroke: ['#2196f3', '#4caf50', '#03a9f4', '#ff9800', '#9c27b0', '#ffc107'],
                strokeWidth: 2,
                ease: "power1.inOut",
            });
    }

    // Initialize the animation
    initAnimation();

    // Button event handlers
    playBtn.addEventListener('click', () => {
        timeline.play();
        playBtn.disabled = true;
        pauseBtn.disabled = false;
    });

    pauseBtn.addEventListener('click', () => {
        timeline.pause();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    });

    resetBtn.addEventListener('click', () => {
        timeline.pause();
        timeline.seek(0);
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    });

    // Initialize button states
    pauseBtn.disabled = true;
});