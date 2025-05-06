// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin);

// Animation elements
const paths = ["#path1", "#path2", "#path3", "#path4", "#path5", "#path6"];
const dots = ["#dot1", "#dot2", "#dot3", "#dot4", "#dot5", "#dot6"];
const logos = ["#logo-openai", "#logo-mistral", "#logo-deepseek"];

// Build the timeline
const tl = gsap.timeline({ paused: true });

// Fade in and pulse logos
logos.forEach(sel => {
    tl.to(sel, {
        opacity: 1,
        duration: 0.8,
        ease: "power1.inOut",
        onStart() {
            gsap.to(sel, {
                scale: 1.2,
                transformOrigin: "center center",
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
    }, 0);
});

// Animate dots along each arrow
paths.forEach((p, i) => {
    tl.to(dots[i], { opacity: 1, duration: 0.2 }, 0);
    tl.to(dots[i], {
        duration: 1.5,
        motionPath: { path: p, align: p, autoRotate: true },
        repeat: -1,
        ease: "none"
    }, 0);
});

// Control buttons
document.getElementById('play-btn').addEventListener('click', () => {
    tl.play();
    document.getElementById('play-btn').disabled = true;
    document.getElementById('pause-btn').disabled = false;
});

document.getElementById('pause-btn').addEventListener('click', () => {
    tl.pause();
    document.getElementById('play-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
});

document.getElementById('reset-btn').addEventListener('click', () => {
    tl.pause().seek(0);
    document.getElementById('play-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
});

// Initialize button states
document.getElementById('pause-btn').disabled = true; 