// Check if we're in any subdirectory
const isSubdirectory = window.location.pathname.match(/\/(pages|projects)\//);
const headerPath = isSubdirectory 
    ? '../components/header.html' 
    : 'components/header.html';
const galleryPath = 'components/gallery.html';
const skillsPath = 'components/skills.html';
const skillsGridPath = 'components/skill-grid.html';
const aboutPath = 'components/about.html';

const skillsPlaceholder = document.getElementById('skills-placeholder');

// Fetching content
fetch(headerPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        new ThemeManager();
        initializeMobileMenu();
    });

fetch(galleryPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('project-gallery-placeholder').innerHTML = data;
        initializeGallery();
    });

if (skillsPlaceholder) {
    fetch(skillsPath)
        .then(response => response.text())
        .then(data => {
            skillsPlaceholder.innerHTML = data;
            
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        resolve();
                    });
                });
            });
        })
        .then(() => fetch(skillsGridPath))
        .then(response => response.text())
        .then(data => {
            const gridPlaceholder = document.getElementById('skills-grid-placeholder');
            if (gridPlaceholder) {
                gridPlaceholder.innerHTML = data;
                initializeSkills();
            }
        })
        .catch(error => {
            console.error('Skills loading error:', error);
        });
}

fetch(aboutPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('about-placeholder').innerHTML = data;
    });

document.addEventListener('DOMContentLoaded', () => {
    new TableOfContents();
});

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

        updateDisplay();
    }
}


function initializeSkills() {
    if (document.querySelector('.filter-btn')) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const skillCards = document.querySelectorAll('.skill-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
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

class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemPreference();
        this.isAnimating = false;
        this.init();
    }

    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
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
        this.applyTheme(this.theme, false);
        this.setupEventListeners();
    }

    applyTheme(theme, animate = true) {
        const button = document.getElementById('terminal-toggle');
        const textSpan = button?.querySelector('.terminal-text');
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        this.theme = theme;
        this.setStoredTheme(theme);
        
        if (!animate && textSpan) {
            textSpan.textContent = theme === 'dark' ? 'GO LIGHT...' : 'GO DARK...';
        }
    }

    setupEventListeners() {
        const button = document.getElementById('terminal-toggle');
        if (button) {
            button.addEventListener('click', () => this.toggle());
        }
    }

    async toggle() {
        if (this.isAnimating) return;
        
        const button = document.getElementById('terminal-toggle');
        const cursor = button.querySelector('.terminal-cursor');
        const textSpan = button.querySelector('.terminal-text');
        
        if (!button || !cursor || !textSpan) return;
        
        this.isAnimating = true;
        button.classList.add('animating');
        
        const newTheme = this.theme === 'dark' ? 'light' : 'dark';
        const oldText = this.theme === 'dark' ? 'GO LIGHT...' : 'GO DARK...';
        const newText = newTheme === 'dark' ? 'GO LIGHT...' : 'GO DARK...';
        
        await this.animateTyping(cursor, textSpan, oldText, newText);
        
        this.applyTheme(newTheme, false);
        
        button.classList.remove('animating');
        this.isAnimating = false;
    }

    async animateTyping(cursor, textSpan, oldText, newText) {
        const charDelay = 40;
        
        for (let i = oldText.length; i >= 0; i--) {
            textSpan.textContent = oldText.substring(0, i);
            await this.sleep(charDelay);
        }
        
        for (let i = 0; i <= newText.length; i++) {
            textSpan.textContent = newText.substring(0, i);
            await this.sleep(charDelay);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


function initializeMobileMenu() {
    if (!document.getElementById('menuToggle')) return;
    
    const menuToggle = document.getElementById('menuToggle');
    const overlayMenu = document.getElementById('overlayMenu');
    const menuClose = document.getElementById('menuClose');
    const overlayLinks = document.querySelectorAll('.overlay-menu-links a');

    menuToggle.addEventListener('click', () => {
        overlayMenu.classList.add('visible');
    });

    menuClose.addEventListener('click', () => {
        overlayMenu.classList.remove('visible');
    });

    overlayMenu.addEventListener('click', (e) => {
        if (e.target === overlayMenu) {
            overlayMenu.classList.remove('visible');
        }
    });

    overlayLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlayMenu.classList.remove('visible');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlayMenu.classList.contains('visible')) {
            overlayMenu.classList.remove('visible');
        }
    });
}
if (document.getElementById('projects-grid')) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            projectCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

class TableOfContents {
    constructor() {
        this.content = document.getElementById('project-content');
        this.tocList = document.getElementById('toc-list');
        this.tocToggle = document.getElementById('toc-toggle');
        this.tocSidebar = document.querySelector('.toc-sidebar');
        
        if (!this.content || !this.tocList) return;
        
        this.headings = [];
        this.init();
    }

    init() {
        this.generateTOC();
        this.setupScrollTracking();
        this.setupMobileToggle();
    }

    generateTOC() {
        const headings = this.content.querySelectorAll('h2, h3');
        
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = this.createSlug(heading.textContent);
            }

            this.headings.push(heading);

            const li = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.dataset.index = index;
            
            if (heading.tagName === 'H3') {
                link.classList.add('toc-h3');
            }
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                history.pushState(null, null, `#${heading.id}`);
                
                if (window.innerWidth <= 900) {
                    this.tocSidebar.classList.remove('open');
                }
            });
            
            li.appendChild(link);
            this.tocList.appendChild(li);
        });
    }

    createSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }

    setupScrollTracking() {
        const observerOptions = {
            threshold: 0,
            rootMargin: '-100px 0px -66%'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const link = this.tocList.querySelector(`a[href="#${id}"]`);
                
                if (entry.isIntersecting && link) {
                    this.tocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        }, observerOptions);

        this.headings.forEach(heading => observer.observe(heading));
    }

    setupMobileToggle() {
        if (!this.tocToggle) return;

        this.tocToggle.addEventListener('click', () => {
            this.tocSidebar.classList.toggle('open');
            
            if (this.tocSidebar.classList.contains('open')) {
                this.tocToggle.textContent = '▲';
            } else {
                this.tocToggle.textContent = '▼';
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && 
                this.tocSidebar.classList.contains('open') &&
                !this.tocSidebar.contains(e.target)) {
                this.tocSidebar.classList.remove('open');
                this.tocToggle.textContent = '▼';
            }
        });
    }
}

