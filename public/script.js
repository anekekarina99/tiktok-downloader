// DOM Elements
const downloadForm = document.getElementById('download-form');
const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('download-btn');
const btnText = document.querySelector('.btn-text');
const btnLoading = document.querySelector('.btn-loading');
const statusMessage = document.getElementById('status-message');
const downloadResults = document.getElementById('download-results');
const downloadLinks = document.getElementById('download-links');

// Video info elements
const videoThumbnail = document.getElementById('video-thumbnail');
const videoTitle = document.getElementById('video-title');
const videoAuthor = document.getElementById('video-author');
const videoDuration = document.getElementById('video-duration');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add form submit listener
    downloadForm.addEventListener('submit', handleFormSubmit);
    
    // Add input validation
    videoUrlInput.addEventListener('input', validateUrl);
    
    // Initialize FAQ toggles
    initializeFAQ();
    
    // Add smooth scrolling for navigation
    initializeSmoothScrolling();
    
    console.log('🚀 TikTok Downloader initialized');
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const url = videoUrlInput.value.trim();
    const format = getSelectedFormat();
    
    // Validate URL
    if (!validateTikTokUrl(url)) {
        showError('Mohon masukkan URL TikTok yang valid');
        return;
    }
    
    // Start download process
    await processDownload(url, format);
}

// Get selected format from radio buttons
function getSelectedFormat() {
    const formatRadios = document.querySelectorAll('input[name="format"]');
    for (const radio of formatRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return 'both'; // default
}

// Validate TikTok URL
function validateTikTokUrl(url) {
    const tiktokPatterns = [
        /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
        /^https?:\/\/(www\.)?tiktok\.com\/.*\/video\/\d+/,
        /^https?:\/\/vm\.tiktok\.com\/\w+/,
        /^https?:\/\/(www\.)?tiktok\.com\/t\/\w+/
    ];
    
    return tiktokPatterns.some(pattern => pattern.test(url));
}

// Real-time URL validation
function validateUrl() {
    const url = videoUrlInput.value.trim();
    
    if (url && !validateTikTokUrl(url)) {
        videoUrlInput.style.borderColor = '#dc3545';
        showError('Format URL TikTok tidak valid');
    } else {
        videoUrlInput.style.borderColor = '';
        hideStatus();
    }
}

// Process download request
async function processDownload(url, format) {
    try {
        // Show loading state
        setLoadingState(true);
        hideStatus();
        hideResults();
        
        console.log(`📥 Starting download: ${url} (${format})`);
        
        // Make API request
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, format })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Download gagal');
        }
        
        // Show success and results
        showSuccess('Video berhasil diproses!');
        displayResults(data.data);
        
        console.log('✅ Download successful:', data);
        
    } catch (error) {
        console.error('❌ Download error:', error);
        showError(error.message || 'Terjadi kesalahan saat memproses video');
    } finally {
        setLoadingState(false);
    }
}

// Set loading state
function setLoadingState(isLoading) {
    downloadBtn.disabled = isLoading;
    
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
    } else {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
    }
}

// Display download results
function displayResults(data) {
    // Set video info
    if (data.thumbnail) {
        videoThumbnail.src = data.thumbnail;
        videoThumbnail.style.display = 'block';
    } else {
        videoThumbnail.style.display = 'none';
    }
    
    videoTitle.textContent = data.title || 'Video TikTok';
    videoAuthor.textContent = data.author || '@user';
    videoDuration.textContent = data.duration || '';
    
    // Create download links
    downloadLinks.innerHTML = '';
    
    if (data.downloads.mp4) {
        const mp4Link = createDownloadLink(
            data.downloads.mp4.url,
            `📹 Download MP4 (${data.downloads.mp4.quality})`,
            'mp4',
            data.downloads.mp4.size
        );
        downloadLinks.appendChild(mp4Link);
    }
    
    if (data.downloads.mp3) {
        const mp3Link = createDownloadLink(
            data.downloads.mp3.url,
            `🎵 Download MP3 (${data.downloads.mp3.quality})`,
            'mp3',
            data.downloads.mp3.size
        );
        downloadLinks.appendChild(mp3Link);
    }
    
    // Show results
    downloadResults.style.display = 'block';
    
    // Scroll to results
    downloadResults.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
}

// Create download link element
function createDownloadLink(url, text, type, size) {
    const link = document.createElement('a');
    link.href = url;
    link.className = `download-link ${type}`;
    link.download = true;
    link.target = '_blank';
    
    link.innerHTML = `
        <span>${text}</span>
        <small style="opacity: 0.8; font-size: 0.8em;">${size}</small>
    `;
    
    // Add click tracking
    link.addEventListener('click', () => {
        console.log(`📥 Download clicked: ${type} - ${url}`);
        
        // Show download started message
        showSuccess(`Download ${type.toUpperCase()} dimulai...`);
    });
    
    return link;
}

// Show error message
function showError(message) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message error';
    statusMessage.style.display = 'block';
}

// Show success message
function showSuccess(message) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message success';
    statusMessage.style.display = 'block';
}

// Hide status message
function hideStatus() {
    statusMessage.style.display = 'none';
}

// Hide results
function hideResults() {
    downloadResults.style.display = 'none';
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Initialize smooth scrolling for navigation
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add paste functionality
videoUrlInput.addEventListener('paste', (e) => {
    // Small delay to ensure pasted content is processed
    setTimeout(() => {
        validateUrl();
    }, 100);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (videoUrlInput.value.trim()) {
            downloadForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        videoUrlInput.value = '';
        hideStatus();
        hideResults();
        videoUrlInput.focus();
    }
});

// Auto-focus on input when page loads
window.addEventListener('load', () => {
    videoUrlInput.focus();
});

// Add error handling for network issues
window.addEventListener('online', () => {
    showSuccess('Koneksi internet tersambung kembali');
    setTimeout(hideStatus, 3000);
});

window.addEventListener('offline', () => {
    showError('Koneksi internet terputus. Periksa koneksi Anda.');
});
