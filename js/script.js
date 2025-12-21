const headerPath = '/components/header.html';
const galleryPath = '/components/gallery.html';
const skillsPath = '/components/skills.html';
const skillsGridPath = '/components/skill-grid.html';
const aboutPath = '/components/about.html';

// Fetching content
fetch(headerPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        new ThemeManager();
    });

fetch(galleryPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('project-gallery-placeholder').innerHTML = data;
        initializeGallery();
    });

fetch(skillsPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('skills-placeholder').innerHTML = data;
        
    });

fetch(skillsGridPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('skills-grid-placeholder').innerHTML = data;
        initializeSkills();
    });

fetch(aboutPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('about-placeholder').innerHTML = data;
    });


// Project Gallery System
function initializeGallery() {
    const projects = [
        {
            title: "In The Light",
            subtitle: "Solo Developer • Unreal Engine 5",
            description: "In The Light is a first person adventure game that takes place in Northern California's forests. Explore a forgotten home, find video cassettes, and learn to find peace despite pain. Utilizing experimental homemade audio cut from my own home videos, ITL is a brief 5-to-10 minute experiment in telling the tale of coming to terms with losing a family member. This is my MFA thesis project built over the span of 9 months.",
            tags: ["Unreal Engine 5", "Level Design", "First-Person", "Narrative Design"],
            status: "completed",
            images: [
                "https://img.itch.zone/aW1hZ2UvMzM4MDA3OS8yMDI1MjgzMC5wbmc=/original/EnRfIj.png",
                "https://img.itch.zone/aW1hZ2UvMzM4MDA3OS8yMDI1MjgzMi5wbmc=/original/W%2BIwMd.png",
                "https://img.itch.zone/aW1hZ2UvMzM4MDA3OS8yMDI1MjgzMy5wbmc=/original/AQmNZv.png"
            ],
            link: "https://betaversions.itch.io/itl"
        },
        {
            title: "Shader Museum",
            subtitle: "Solo Developer • Unity",
            description: "A Unity shader pack featuring five custom shaders: water, transparent outlines, silhouettes, stylized outlines, and grass. My first deep dive into shader programming, this project demonstrates technical art skills through interactive, explorable examples. Built in Unity using URP.",
            tags: ["Unity", "Shaders", "Tech Art", "Tools", "Low-poly"],
            status: "completed",
            images: [
                "https://img.itch.zone/aW1nLzYxNTcwNTEuZ2lm/original/WHhIwL.gif",
                "https://img.itch.zone/aW1nLzYxNTcwNzQuZ2lm/original/vV7Smn.gif",
                "https://img.itch.zone/aW1nLzYxNTcwOTAuZ2lm/original/awVPu0.gif"
            ],
            link: "https://betaversions.itch.io/shaders-m"
        },
        {
            title: "Sunrise City",
            subtitle: "Systems Designer, Playtest Coordinator • Tabletop",
            description: "A cooperative board game where 4-6 players work as city aldermen to combat climate change by 2030. Players balance investing in their city infrastucture with trying to afford succeeding in their own personal goals. Led systems design and coordinated playtesting sessions to refine game balance and player engagement.",
            tags: ["Systems Design", "Tabletop", "Co-op", "Educational"],
            status: "completed",
            images: [
                "https://img.itch.zone/aW1nLzEyMDc3MjEwLmpwZw==/original/vnFZJB.jpg",
                "https://img.itch.zone/aW1nLzEyMDc3MjEyLmpwZw==/original/22%2BYYI.jpg",
                "https://img.itch.zone/aW1nLzEyMzk4NzI0LnBuZw==/original/aAXZrp.png"
            ],
            link: "https://lvwatson.itch.io/sunrise"
        }
    ];

    // Only initialize gallery if the elements exist on the page
    if (document.getElementById('project-image')) {
        let currentIndex = 0;
        let currentImageIndex = 0;
        let autoRotateInterval = null;

        function updateThumbnails() {
            const project = projects[currentIndex];
            const miniGallery = document.getElementById('mini-gallery');
            
            miniGallery.innerHTML = project.images.map((img, idx) => 
                `<img src="${img}" alt="View ${idx + 1}" class="thumbnail ${idx === currentImageIndex ? 'active' : ''}" data-index="${idx}">`
            ).join('');
            
            miniGallery.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    currentImageIndex = parseInt(this.dataset.index);
                    updateMainImage();
                    resetAutoRotate();
                });
            });
        }
        
        function updateMainImage() {
            const project = projects[currentIndex];
            const img = document.getElementById('project-image');
            
            img.style.opacity = '0.7';
            
            setTimeout(() => {
                img.src = project.images[currentImageIndex];
                img.style.opacity = '1';
                
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.toggle('active', parseInt(thumb.dataset.index) === currentImageIndex);
                });
            }, 150);
        }
        
        function startAutoRotate() {
            autoRotateInterval = setInterval(() => {
                const project = projects[currentIndex];
                currentImageIndex = (currentImageIndex + 1) % project.images.length;
                updateMainImage();
            }, 4000);
        }
        
        function resetAutoRotate() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
            }
            startAutoRotate();
        }

        function updateDisplay() {
            const project = projects[currentIndex];
            currentImageIndex = 0;
            
            const img = document.getElementById('project-image');
            img.style.opacity = '0.7';
            
            setTimeout(() => {
                img.src = project.images[0];
                document.getElementById('project-title').textContent = project.title;
                document.getElementById('project-subtitle').textContent = project.subtitle;
                document.getElementById('project-description').textContent = project.description;
                
                const tagsContainer = document.getElementById('project-tags');
                tagsContainer.innerHTML = project.tags.map(tag => 
                    `<span class="tag">${tag}</span>`
                ).join('');
                
                const linksContainer = document.getElementById('project-links');
                linksContainer.innerHTML = `<a href="${project.link}" class="project-link" target="_blank">View on Itch →</a>`;
                
                img.style.opacity = '1';
            }, 150);

            updateThumbnails();
            document.getElementById('project-counter').textContent = `${currentIndex + 1} / ${projects.length}`;
            document.getElementById('prev-btn').disabled = currentIndex === 0;
            document.getElementById('next-btn').disabled = currentIndex === projects.length - 1;
            
            resetAutoRotate();
        }

        document.getElementById('prev-btn').addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateDisplay();
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            if (currentIndex < projects.length - 1) {
                currentIndex++;
                updateDisplay();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                updateDisplay();
            } else if (e.key === 'ArrowRight' && currentIndex < projects.length - 1) {
                currentIndex++;
                updateDisplay();
            }
        });

        // Initialize gallery
        updateDisplay();
    }
}


function initializeSkills() {
    // Skills Filter System
    if (document.querySelector('.filter-btn')) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const skillCards = document.querySelectorAll('.skill-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards
                skillCards.forEach(card => {
                    const category = card.dataset.category;
                    
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || 'light';
        this.init();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {}
    }

    init() {
        this.applyTheme(this.theme);
        this.setupEventListeners();
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        this.theme = theme;
        this.setStoredTheme(theme);
        this.updateActiveButton();
    }

    setupEventListeners() {
        const themeButtons = document.querySelectorAll('.theme-option');
        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.applyTheme(button.dataset.theme);
            });
        });
    }

    updateActiveButton() {
        const themeButtons = document.querySelectorAll('.theme-option');
        themeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.theme === this.theme);
        });
    }
}