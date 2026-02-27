// Theme toggle functionality
const toggle = document.getElementById("toggleTheme");
const root = document.documentElement;

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const theme = storedTheme || (prefersDark ? 'dark' : 'light');
root.setAttribute("data-theme", theme);

toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

// Dynamic Year
document.getElementById("year").textContent = new Date().getFullYear();

// Letter Glitch Background Effect (React Bits style)
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'glitch-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const vignette = document.createElement('div');
    vignette.className = 'glitch-vignette';
    document.body.insertBefore(vignette, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>,0123456789';
    const colors = {
        dark: ['#ff9933', '#ff6600', '#ffaa00'],
        light: ['#cc6600', '#ff6600', '#ff8800']
    };
    
    let fontSize = 16;
    let charWidth = 10;
    let charHeight = 20;
    let updateSpeed = 150;
    let lastUpdate = 0;
    let currentColors = colors.dark;
    let grid = [];
    let cols, rows;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.ceil(canvas.width / charWidth);
        rows = Math.ceil(canvas.height / charHeight);
        initGrid();
    }
    
    function initGrid() {
        grid = [];
        for (let i = 0; i < cols * rows; i++) {
            grid.push({
                char: chars[Math.floor(Math.random() * chars.length)],
                color: currentColors[Math.floor(Math.random() * currentColors.length)],
                targetChar: chars[Math.floor(Math.random() * chars.length)],
                changeProgress: 0
            });
        }
    }
    
    function getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }
    
    function updateColors() {
        const theme = getTheme();
        currentColors = colors[theme];
    }
    
    function draw(timestamp) {
        const theme = getTheme();
        canvas.style.backgroundColor = theme === 'dark' ? '#000000' : '#f4f4f4';
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${fontSize}px monospace`;
        
        if (timestamp - lastUpdate > updateSpeed) {
            const updateCount = Math.floor(grid.length * 0.02);
            
            for (let i = 0; i < updateCount; i++) {
                const idx = Math.floor(Math.random() * grid.length);
                grid[idx].targetChar = chars[Math.floor(Math.random() * chars.length)];
                grid[idx].color = currentColors[Math.floor(Math.random() * currentColors.length)];
                grid[idx].changeProgress = 0;
            }
            lastUpdate = timestamp;
        }
        
        for (let i = 0; i < grid.length; i++) {
            const cell = grid[i];
            const x = (i % cols) * charWidth;
            const y = Math.floor(i / cols) * charHeight;
            
            if (cell.changeProgress < 1) {
                cell.changeProgress += 0.05;
                if (Math.random() > 0.7) {
                    cell.char = cell.targetChar;
                }
            }
            
            ctx.fillStyle = cell.color;
            ctx.fillText(cell.char, x, y);
        }
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    resize();
    updateColors();
    draw();
    
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();