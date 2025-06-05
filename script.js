
// Global variables
let videosData = {};
let currentCategory = '';
let currentVideo = null;

// DOM Elements
const pages = {
    home: document.getElementById('home-page'),
    category: document.getElementById('category-page'),
    video: document.getElementById('video-page')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    await loadVideosData();
    setupNavigation();
    showHomePage();
});

// Load videos data from JSON
async function loadVideosData() {
    try {
        const response = await fetch('videos.json');
        videosData = await response.json();
    } catch (error) {
        console.error('Error loading videos data:', error);
        videosData = {};
    }
}

// Setup navigation
function setupNavigation() {
    // Logo click
    document.querySelector('.logo').addEventListener('click', showHomePage);

    // Category navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            showCategoryPage(category);
        });
    });

    // Back buttons
    document.getElementById('back-btn').addEventListener('click', showHomePage);
    document.getElementById('video-back-btn').addEventListener('click', () => {
        showCategoryPage(currentCategory);
    });
}

// Show home page
function showHomePage() {
    hideAllPages();
    pages.home.classList.add('active');
    updateActiveNavLink('');
    renderHomePage();
    updateURL('');
}

// Show category page
function showCategoryPage(categorySlug) {
    hideAllPages();
    pages.category.classList.add('active');
    currentCategory = categorySlug;
    updateActiveNavLink(categorySlug);
    renderCategoryPage(categorySlug);
    updateURL(`category/${categorySlug}`);
}

// Show video page
function showVideoPage(videoId) {
    hideAllPages();
    pages.video.classList.add('active');
    renderVideoPage(videoId);
    updateURL(`video/${videoId}`);
}

// Hide all pages
function hideAllPages() {
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
}

// Update active navigation link
function updateActiveNavLink(categorySlug) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.category === categorySlug) {
            link.classList.add('active');
        }
    });
}

// Update URL without page reload
function updateURL(path) {
    const newURL = path ? `#${path}` : '#';
    window.history.replaceState(null, '', newURL);
}

// Render home page
function renderHomePage() {
    const categoriesContent = document.getElementById('categories-content');
    let html = '';

    const categories = {
        'enrichment': { name: 'Enrichment', description: 'תכנים מתקדמים לצמיחה מקצועית ושיפור כישורים' },
        'tech-support': { name: 'Tech Support', description: 'מדריכי פתרון בעיות וטיפים לדיבוג' },
        'be': { name: 'BE', description: 'פיתוח צד שרת, ארכיטקטורה וטכנולוגיות שרת' }
    };

    Object.keys(categories).forEach(categorySlug => {
        const category = categories[categorySlug];
        const videos = videosData[categorySlug] || [];
        const latestVideos = videos.slice(0, 2);

        html += `
            <section class="category-section">
                <div class="category-header-home">
                    <div>
                        <h2 class="category-name">${category.name}</h2>
                        <p class="category-desc">${category.description}</p>
                    </div>
                    <button class="view-all-btn" onclick="showCategoryPage('${categorySlug}')">
                        צפה בכל הסרטונים ←
                    </button>
                </div>
                <div class="videos-grid">
                    ${latestVideos.map(video => createVideoCard(video)).join('')}
                </div>
            </section>
        `;
    });

    categoriesContent.innerHTML = html;
}

// Render category page
function renderCategoryPage(categorySlug) {
    const categories = {
        'enrichment': { name: 'Enrichment', description: 'תכנים מתקדמים לצמיחה מקצועית ושיפור כישורים' },
        'tech-support': { name: 'Tech Support', description: 'מדריכי פתרון בעיות וטיפים לדיבוג' },
        'be': { name: 'BE', description: 'פיתוח צד שרת, ארכיטקטורה וטכנולוגיות שרת' }
    };

    const category = categories[categorySlug];
    const videos = videosData[categorySlug] || [];

    document.getElementById('category-title').textContent = category.name;
    document.getElementById('category-description').textContent = 
        `${category.description} • ${videos.length} סרטונים זמינים`;

    const videosGrid = document.getElementById('category-videos');
    videosGrid.innerHTML = videos.map(video => createVideoCard(video)).join('');
}

// Render video page
function renderVideoPage(videoId) {
    // Find video in all categories
    let video = null;
    Object.values(videosData).forEach(categoryVideos => {
        const found = categoryVideos.find(v => v.id === videoId);
        if (found) video = found;
    });

    if (!video) {
        document.getElementById('video-title').textContent = 'סרטון לא נמצא';
        return;
    }

    currentVideo = video;
    
    // Update video player
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.poster = video.thumbnail;
    
    // Setup HLS player
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(video.videoUrl);
        hls.attachMedia(videoPlayer);
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = video.videoUrl;
    }

    // Update video info
    document.getElementById('video-title').textContent = video.title;
    
    const externalLinkContainer = document.getElementById('video-external-link');
    if (video.externalLink) {
        externalLinkContainer.innerHTML = `
            <a href="${video.externalLink}" target="_blank" class="external-link">
                מקור חיצוני ←
            </a>
        `;
    } else {
        externalLinkContainer.innerHTML = '';
    }

    document.getElementById('video-desc-content').textContent = 
        `סרטון זה הוא חלק מסדרת ${video.category.replace('-', ' ')} שלנו, שנועדה לספק חוויות למידה מקיפות למפתחים ואנשי טכנולוגיה. כל סרטון נבנה בקפידה כדי להעביר ידע מעשי ותובנות מהעולם האמיתי.`;
}

// Create video card HTML
function createVideoCard(video) {
    return `
        <div class="video-card" onclick="showVideoPage('${video.id}')">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <div class="play-overlay">
                    <div class="play-btn">▶</div>
                </div>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                ${video.externalLink ? `<a href="${video.externalLink}" target="_blank" class="external-link" onclick="event.stopPropagation()">מקור חיצוני ←</a>` : ''}
            </div>
        </div>
    `;
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
        showHomePage();
    } else if (hash.startsWith('category/')) {
        const category = hash.split('/')[1];
        showCategoryPage(category);
    } else if (hash.startsWith('video/')) {
        const videoId = hash.split('/')[1];
        showVideoPage(videoId);
    }
});

// Initialize based on URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('category/')) {
        const category = hash.split('/')[1];
        showCategoryPage(category);
    } else if (hash.startsWith('video/')) {
        const videoId = hash.split('/')[1];
        showVideoPage(videoId);
    }
});
