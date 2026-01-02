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

function fixNavigationLinks() {
    const isInPages = window.location.pathname.includes('/pages/');
    const isInProjects = window.location.pathname.includes('/projects/');
    
    const links = document.querySelectorAll('.nav-links a, .overlay-menu-links a');
    
    // Safety check - if no links found, exit early
    if (!links || links.length === 0) return;
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip hash links and external links
        if (!href || href.startsWith('#') || href.startsWith('http')) return;
        
        // From /pages/ or /projects/ directories
        if (isInPages || isInProjects) {
            // Links to index.html need to go up one level
            if (href === 'index.html' || href.startsWith('index.html#')) {
                link.setAttribute('href', '../' + href);
            }
            // Links to pages/ directory
            else if (href.startsWith('pages/')) {
                if (isInPages) {
                    // Already in /pages/, just remove the 'pages/' prefix
                    link.setAttribute('href', href.replace('pages/', ''));
                } else {
                    // In /projects/, need to go ../pages/
                    link.setAttribute('href', '../' + href);
                }
            }
        }
    });
}
// Fetching content
fetch(headerPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
        fixNavigationLinks();
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
                "images/ITLOne.png",
                "images/ITLTwo.png",
                "images/ITLThree.png"
            ],
            plink: "https://betaversions.itch.io/itl",
            link: "../projects/InTheLight.html"
        },
        {
            title: "Shader Museum",
            subtitle: "Solo Developer • Unity",
            description: "A Unity shader pack featuring five custom shaders: water, transparent outlines, silhouettes, stylized outlines, and grass. This was my first deep dive into shader programming. It also features a level to walk around and see the shaders in! Built in Unity using URP.",
            tags: ["Unity", "Shaders", "Tech Art", "Tools", "Low-poly", "ShaderGraph"],
            status: "completed",
            images: [
                "images/SMSquare.gif",
                "images/SMTwo.gif",
                "images/SMThree.gif"
            ],
            plink: "https://betaversions.itch.io/shaders-m",
            link: "../projects/ShaderMuseum.html"
        },
        {
            title: "Sunrise City",
            subtitle: "Systems Designer, Playtest Coordinator • Tabletop",
            description: "A cooperative board game where 4-6 players work together as city aldermen to combat climate change by 2030. Players balance investing in their city infrastucture with trying to afford succeeding in their own personal goals. I was on systems design and coordinated playtesting sessions to refine game balance and player engagement.",
            tags: ["Systems Design", "Tabletop", "Co-op", "Social Impact Games", "Politics"],
            status: "completed",
            images: [
                "images/SCOne.jpg",
                "images/SCTwo.jpg"
            ],
            plink: "https://lvwatson.itch.io/sunrise",
            link: "../projects/SunriseCity.html"
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
                linksContainer.innerHTML = `
    ${project.plink ? `<a href="${project.plink}" class="project-link" target="_blank">View on Itch →</a>` : ''}
    ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">Read Writeup →</a>` : ''}
`;
                
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
    const yearFilter = document.getElementById('year-filter');
    const projectCards = document.querySelectorAll('.project-card');
    
    let activeCategory = 'all';
    let activeYear = 'all';
    
    function populateYearFilter() {
        const years = new Set();
        
        projectCards.forEach(card => {
            const year = card.dataset.year;
            if (year) {
                years.add(year);
            }
        });
        
        const sortedYears = Array.from(years).sort((a, b) => b - a);
        
        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }
    
    function filterProjects() {
        projectCards.forEach(card => {
            const categories = card.dataset.category.split(' ');
            const year = card.dataset.year;
            
            const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
            const matchesYear = activeYear === 'all' || year === activeYear;
            
            if (matchesCategory && matchesYear) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            activeCategory = this.dataset.filter;
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProjects();
        });
    });
    
    yearFilter.addEventListener('change', function() {
        activeYear = this.value;
        filterProjects();
    });
    
    populateYearFilter();
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
        this.setupCollapsibleSections();
    }

   generateTOC() {
    const headings = this.content.querySelectorAll('h2, h3, h4');
    let currentH3Li = null;
    let h4Container = null;
    
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
        
        if (heading.tagName === 'H2') {
            link.classList.add('toc-h2');
            this.tocList.appendChild(li);
            currentH3Li = null;
            h4Container = null;
        } else if (heading.tagName === 'H3') {
            link.classList.add('toc-h3');
            currentH3Li = li;
            this.tocList.appendChild(li);
            h4Container = null;
        } else if (heading.tagName === 'H4') {
            link.classList.add('toc-h4');
            
            if (!h4Container && currentH3Li) {
                h4Container = document.createElement('ul');
                h4Container.classList.add('toc-h4-container');
                currentH3Li.appendChild(h4Container);
                
                const h3Link = currentH3Li.querySelector('a');
                if (h3Link && !h3Link.querySelector('.toc-arrow')) {
                    const arrow = document.createElement('span');
                    arrow.classList.add('toc-arrow');
                    arrow.textContent = '▶';
                    h3Link.prepend(arrow);
                }
            }
            
            if (h4Container) {
                h4Container.appendChild(li);
            }
        }
        
        link.addEventListener('click', (e) => {
            const hasChildren = link.classList.contains('toc-h3') && link.querySelector('.toc-arrow');
            if (hasChildren) return;
            
            e.preventDefault();
            heading.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            history.pushState(null, null, `#${heading.id}`);
            
            if (window.innerWidth <= 900) {
                this.tocSidebar.classList.remove('open');
                this.tocToggle.textContent = '▼';
            }
        });
        
        li.appendChild(link);
    });
    
    if (window.innerWidth <= 900) {
        this.collapseAll();
    } else {
        this.expandAll();
    }
}

    setupCollapsibleSections() {
    const h3Links = this.tocList.querySelectorAll('.toc-h3');
    
    h3Links.forEach(link => {
        const arrow = link.querySelector('.toc-arrow');
        if (!arrow) return;
        
        arrow.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const li = link.closest('li');
            const container = li.querySelector('.toc-h4-container');
            
            if (container) {
                this.toggleSection(li, container, arrow);
            }
        });
        

        link.addEventListener('click', (e) => {
            if (e.target === arrow) return;
            
            e.preventDefault();
            const heading = this.content.querySelector(`#${link.href.split('#')[1]}`);
            if (heading) {
                heading.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                history.pushState(null, null, `#${heading.id}`);
            }
            
        });
    });
}

    toggleSection(li, container, arrow) {
        const isCollapsed = li.classList.contains('collapsed');
        
        if (isCollapsed) {
            li.classList.remove('collapsed');
            arrow.style.transform = 'rotate(90deg)';
            container.style.maxHeight = container.scrollHeight + 'px';
        } else {
            li.classList.add('collapsed');
            arrow.style.transform = 'rotate(0deg)';
            container.style.maxHeight = '0';
        }
    }

    collapseAll() {
        const h3Items = this.tocList.querySelectorAll('li:has(.toc-h3)');
        h3Items.forEach(li => {
            const container = li.querySelector('.toc-h4-container');
            const arrow = li.querySelector('.toc-arrow');
            if (container && arrow) {
                li.classList.add('collapsed');
                arrow.style.transform = 'rotate(0deg)';
                container.style.maxHeight = '0';
            }
        });
    }

    expandAll() {
        const h3Items = this.tocList.querySelectorAll('li:has(.toc-h3)');
        h3Items.forEach(li => {
            const container = li.querySelector('.toc-h4-container');
            const arrow = li.querySelector('.toc-arrow');
            if (container && arrow) {
                li.classList.remove('collapsed');
                arrow.style.transform = 'rotate(90deg)';
                container.style.maxHeight = container.scrollHeight + 'px';
            }
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

class Lightbox {
    constructor() {
        this.createLightboxHTML();
        this.overlay = document.getElementById('lightbox-overlay');
        this.image = document.getElementById('lightbox-image');
        this.caption = document.getElementById('lightbox-caption');
        this.closeBtn = document.getElementById('lightbox-close');
        this.prevBtn = document.getElementById('lightbox-prev');
        this.nextBtn = document.getElementById('lightbox-next');
        
        this.currentGallery = [];
        this.currentIndex = 0;
        
        this.init();
    }
    
    createLightboxHTML() {
        const lightboxHTML = `
            <div class="lightbox-overlay" id="lightbox-overlay">
                <div class="lightbox-content">
                    <button class="lightbox-close" id="lightbox-close" aria-label="Close">×</button>
                    <img src="" alt="" class="lightbox-image" id="lightbox-image">
                    <div class="lightbox-caption" id="lightbox-caption"></div>
                </div>
                <button class="lightbox-nav prev" id="lightbox-prev" aria-label="Previous image">‹</button>
                <button class="lightbox-nav next" id="lightbox-next" aria-label="Next image">›</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }
    
    init() {
        this.attachGalleryListeners('.full-width-gallery img');
        this.attachGalleryListeners('.inline-gallery img');
        this.attachGalleryListeners('.grid-gallery-item img');
        
        this.closeBtn.addEventListener('click', () => this.close());
        
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
            if (e.key === 'ArrowLeft' && this.overlay.classList.contains('active')) {
                this.prev();
            }
            if (e.key === 'ArrowRight' && this.overlay.classList.contains('active')) {
                this.next();
            }
        });
        
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
    }
    
    attachGalleryListeners(selector) {
        const galleries = document.querySelectorAll(selector);
        
        galleries.forEach((img, index) => {
            const isMobile = window.innerWidth <= 768;
            
            if (true) {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const galleryContainer = img.closest('.full-width-gallery, .inline-gallery, .grid-gallery');
                    if (galleryContainer) {
                        this.currentGallery = Array.from(galleryContainer.querySelectorAll('img'));
                        this.currentIndex = this.currentGallery.indexOf(img);
                    } else {
                        this.currentGallery = [img];
                        this.currentIndex = 0;
                    }
                    
                    this.open(img);
                });
            }
        });
    }
    
    open(img) {
        this.image.src = img.src;
        this.image.alt = img.alt;
        this.caption.textContent = img.alt || '';
        
        this.overlay.setAttribute('data-gallery-size', this.currentGallery.length);
        
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    prev() {
        if (this.currentGallery.length <= 1) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.currentGallery.length) % this.currentGallery.length;
        this.updateImage();
    }
    
    next() {
        if (this.currentGallery.length <= 1) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.currentGallery.length;
        this.updateImage();
    }
    
    updateImage() {
        const img = this.currentGallery[this.currentIndex];
        this.image.src = img.src;
        this.image.alt = img.alt;
        this.caption.textContent = img.alt || '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});

