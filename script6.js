// ============================================
// PERFORMANCE UTILITIES - OPTIMIZED
// ============================================
(function() {
    'use strict';
    
    // Performance: Disable expensive features on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                           (navigator.deviceMemory && navigator.deviceMemory <= 2);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Debounce function untuk optimize event listeners (improved)
    window.debounce = function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    
    // Throttle function (improved)
    window.throttle = function(func, limit) {
        let inThrottle, lastFunc, lastRan;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                lastRan = Date.now();
                inThrottle = true;
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };
    
    // requestIdleCallback polyfill (improved)
    window.requestIdleCallback = window.requestIdleCallback || function(cb, options) {
        const start = Date.now();
        const timeout = options && options.timeout || 0;
        return setTimeout(function() {
            cb({
                didTimeout: timeout > 0 && (Date.now() - start) >= timeout,
                timeRemaining: function() {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    };
    
    window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
        clearTimeout(id);
    };
    
    // Optimized IntersectionObserver untuk lazy loading
    if ('IntersectionObserver' in window) {
        window.lazyImageObserver = new IntersectionObserver(function(entries) {
            // Batch process entries for better performance
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        // Use requestIdleCallback for non-critical image loading
                        if (isLowEndDevice) {
                            requestIdleCallback(function() {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                img.classList.remove('lazy');
                            });
                        } else {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                        }
                        window.lazyImageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: isLowEndDevice ? '100px' : '50px',
            threshold: 0.01
        });
    }
    
    // Batch DOM updates for better performance
    window.batchDOMUpdates = function(callback) {
        if (window.requestIdleCallback) {
            requestIdleCallback(callback, { timeout: 2000 });
        } else {
            setTimeout(callback, 0);
        }
    };
    
    // Optimized querySelector caching
    const queryCache = new Map();
    window.$cached = function(selector, forceRefresh) {
        if (forceRefresh || !queryCache.has(selector)) {
            const element = document.querySelector(selector);
            if (element) {
                queryCache.set(selector, element);
            }
            return element;
        }
        return queryCache.get(selector);
    };
    
    // Clear cache when DOM changes significantly
    if ('MutationObserver' in window) {
        const cacheClearObserver = new MutationObserver(window.debounce(function() {
            if (queryCache.size > 50) {
                queryCache.clear();
            }
        }, 5000));
        cacheClearObserver.observe(document.body, { childList: true, subtree: true });
    }
    
    // Passive event listeners helper
    window.addPassiveEventListener = function(element, event, handler) {
        element.addEventListener(event, handler, { passive: true, capture: false });
    };
    
    // Defer non-critical scripts
    window.deferNonCritical = function(callback, delay) {
        if (delay === undefined) {
            delay = isLowEndDevice ? 2000 : 500;
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(callback, delay);
            });
        } else {
            setTimeout(callback, delay);
        }
    };
    
    // Optimize animations for low-end devices
    if (isLowEndDevice || prefersReducedMotion) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Preconnect to important domains
    const preconnectDomains = [
        'https://cdn.robootassets.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    preconnectDomains.forEach(function(domain) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = '';
        document.head.appendChild(link);
    });
})();

// ============================================
// 1. RUNNING TEXT BANNER
// ============================================
(function () {
    'use strict';
    const MESSAGE = 'Selamat Datang Di EDUTOTO ! Situs Slot Gacor Gampang Menang & Togel Toto Online Diskon Terbaik.';

    const CSS = `
        .ninfo {
            display: flex;
            align-items: center;
            background: linear-gradient(90deg, rgba(255, 87, 34, 0.9) 0%, rgba(255, 152, 0, 0.9) 100%);
            color: #fff;
            padding: 8px 15px;
            margin: 0;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
        }
        .ninfo .nicon {
            flex-shrink: 0;
            margin-right: 10px;
            font-size: 1.2em;
        }
        .ninfo .ntxt-wrapper {
            flex: 1;
            overflow: hidden;
            position: relative;
        }
        .ninfo .ntxt {
            display: inline-block;
            white-space: nowrap;
            animation: scroll-text 30s linear infinite;
            font-weight: 600;
            font-size: 0.9em;
        }
        @keyframes scroll-text {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
            .ninfo {
                padding: 6px 10px;
                font-size: 0.85em;
            }
            .ninfo .nicon {
                font-size: 1em;
                margin-right: 8px;
            }
        }
    `;

    (function injectStyleOnce(){
        if (!document.getElementById('running-text-css')) {
        const s = document.createElement('style'); s.id = 'running-text-css'; s.textContent = CSS;
        document.head.appendChild(s);
        }
    })();

    function createBar(){
        let bar = document.getElementById('running-text-bar');
        if (bar) return bar;
        bar = document.createElement('div');
        bar.id = 'running-text-bar';
        bar.className = 'ninfo';
        bar.setAttribute('role','region');
        bar.setAttribute('aria-label','Pengumuman');
        bar.innerHTML = `
        <div class="nicon"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i></div>
        <div class="ntxt-wrapper"><div class="ntxt">${MESSAGE}</div></div>
        `;

        const faLoaded = !!document.querySelector('link[href*="fontawesome"],script[src*="fontawesome"]');
        if (!faLoaded) {
        const EMOJI = {
            mega: String.fromCodePoint(0x1F4E3),  // ðŸ“£
        };
        const i = bar.querySelector('.nicon i');
        if (i) i.outerHTML = `<span role="img" aria-label="Info">${EMOJI.mega}</span>`;
        }
        requestAnimationFrame(() => {
        const txt = bar.querySelector('.ntxt'), wrap = bar.querySelector('.ntxt-wrapper'); if (!txt || !wrap) return;
        const base = txt.innerHTML; let n = 1;
        while (txt.scrollWidth < wrap.clientWidth * 1.5 && n < 6) { txt.innerHTML += ' &nbsp;&nbsp; ' + base; n++; }
        });
        return bar;
    }

    function placeBarStrict() {
        const navMobile  = document.querySelector('nav.menubar.navbar.navbar-dark.bg-dark.py-2.px-2.d-xl-none');
        const navDesktop = document.querySelector('nav.menubar.navbar.navbar-dark.bg-dark.py-2.px-2.d-none.d-xl-block');
        if (!navMobile || !navDesktop) return false;

        const bar = createBar();

        if (navMobile.parentElement === navDesktop.parentElement) {
        const parent = navDesktop.parentElement;
        if (bar.parentElement !== parent || bar.nextElementSibling !== navDesktop) {
            parent.insertBefore(bar, navDesktop);
        }
        if (bar.previousElementSibling !== navMobile) {
            parent.insertBefore(bar, navDesktop);
        }
        return true;
        }

        if (bar.parentElement !== navMobile.parentElement || bar.previousElementSibling !== navMobile) {
        navMobile.insertAdjacentElement('afterend', bar);
        }
        return true;
    }

    function boot() {
        if (placeBarStrict()) return;
        const debouncedPlace = window.debounce(() => { if (placeBarStrict()) obs.disconnect(); }, 100);
        const obs = new MutationObserver(debouncedPlace);
        obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once:true });
    } else {
        boot();
    }

    // Optimized MutationObserver dengan debounce
    const debouncedKeep = window.debounce(placeBarStrict, 150);
    const keep = new MutationObserver(debouncedKeep);
    keep.observe(document.documentElement, { childList: true, subtree: true });
})();

// ============================================
// 3. VIDEO CAROUSEL
// ============================================
(function () {
    if (typeof $ === 'undefined') return; 
    $(document).ready(function () {
        const isHomePage = window.location.pathname === '/' || 
                          window.location.pathname === '/index.html' ||
                          window.location.pathname === '';
        if (!isHomePage) return;

        const banners = [
            'https://cdn.cobanih.com/banner/banner-edu-1.webp'
        ];

        const $carousel = $('<div id="main-video-carousel" class="owl-carousel owl-theme"></div>');

        // Helper function to detect if file is image or video
        function isImageFile(src) {
            const imageExts = ['.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg'];
            const lowerSrc = src.toLowerCase();
            return imageExts.some(ext => lowerSrc.endsWith(ext));
        }

        // OPTIMIZED: Only load first media, others load on demand (lazy loading)
        banners.forEach(function (src, index) {
            const isImage = isImageFile(src);
            let $media;
            
            if (isImage) {
                // Create img element for images (webp, jpg, png, etc)
                $media = $('<img>', {
                    loading: index === 0 ? 'eager' : 'lazy',
                    alt: 'Banner'
                });
                
                // Only set src for first image, others use data-src for lazy loading
                if (index === 0) {
                    $media.attr('src', src);
                } else {
                    $media.attr('data-src', src);
                }
                
                // Style for images
                $media.css({
                    width: '100%',
                    height: 'auto',
                    display: 'block'
                });
            } else {
                // Create video element for videos (webm, mp4, etc)
                $media = $('<video>', { 
                    loop: false, 
                    muted: true, 
                    playsinline: true, 
                    preload: index === 0 ? 'auto' : 'none'
                });
                $media.attr('webkit-playsinline', '');
                $media.prop('muted', true);
                
                // Only set src for first video, others use data-src for lazy loading
                if (index === 0) {
                    $media.attr('src', src);
                    $media.on('canplaythrough', function () { 
                        try { this.play(); } catch(e){} 
                    });
                } else {
                    $media.attr('data-src', src);
                }
            }
            
            const $item = $('<div class="item"></div>').append($media);
            $carousel.append($item);
        });

        const $target = $('#content');
        if ($target.length) $target.prepend($carousel);

        function playActiveMedia(owlEvent) {
            const $root = $(owlEvent?.target || '#main-video-carousel');
            const $active = $root.find('.owl-item.active');
            const activeVideo = $active.find('video').get(0);
            const activeImage = $active.find('img').get(0);
            
            // Pause all other videos (but don't unload them)
            $root.find('video').each(function () { 
                if (this !== activeVideo) { 
                    try { 
                        this.pause(); 
                        // Don't unload videos to prevent them from disappearing
                    } catch(e){} 
                } 
            });
            
            // Handle images - lazy load if needed
            if (activeImage) {
                if (activeImage.dataset.src && !activeImage.src) {
                    activeImage.src = activeImage.dataset.src;
                    activeImage.removeAttribute('data-src');
                }
                // Images don't need auto-advance, but we can set a timer if needed
                // For now, images will stay until user manually navigates
            }
            
            // Handle videos
            if (activeVideo) {
                // Lazy load video if not loaded yet
                if (activeVideo.dataset.src && !activeVideo.src) {
                    activeVideo.src = activeVideo.dataset.src;
                    activeVideo.removeAttribute('data-src');
                    // Wait for video to load before playing
                    activeVideo.addEventListener('loadeddata', function() {
                        playVideoNow();
                    }, { once: true });
                    // Also try to load immediately
                    activeVideo.load();
                } else {
                    playVideoNow();
                }
                
                function playVideoNow() {
                    activeVideo.currentTime = 0;
                    if (activeVideo._advanceTimer) clearTimeout(activeVideo._advanceTimer);
                    let attempts = 0;
                    const tryPlay = () => {
                        attempts++;
                        const p = activeVideo.play();
                        if (p?.then) {
                            p.catch(() => { 
                                if (attempts < 8) setTimeout(tryPlay, 120); 
                            });
                        }
                    };
                    tryPlay();
                    
                    const dur = (isFinite(activeVideo.duration) && activeVideo.duration > 0) ? activeVideo.duration : 3.0;
                    activeVideo._advanceTimer = setTimeout(() => {
                        if ($active.hasClass('active')) $carousel.trigger('next.owl.carousel');
                    }, Math.ceil(dur * 1000) + 150);
                }
            }
        }

        function attachPerVideoHandlers() {
            $carousel.find('video').each(function () {
                const videoEl = this;
                if (videoEl._handlersBound) return;
                videoEl._handlersBound = true;
                $(videoEl).on('ended timeupdate', function () {
                    const d = videoEl.duration;
                    if ($(videoEl).closest('.owl-item').hasClass('active') && (isFinite(d) && d > 0 && videoEl.currentTime >= d - 0.05)) {
                        $carousel.trigger('next.owl.carousel');
                    }
                });
            });
        }

        function initOwl() {
            if (typeof $.fn.owlCarousel === 'undefined') {
                return false;
            }
            $carousel.owlCarousel({
                items: 1, loop: true, autoplay: false, nav: true, dots: false,
                onInitialized: function (e) { attachPerVideoHandlers(); playActiveMedia(e); },
                onTranslated: function (e) { playActiveMedia(e); }
            });
            setTimeout(() => playActiveMedia({ target: $carousel.get(0) }), 60);
            return true;
        }

        if (!initOwl()) {
            let tries = 0;
            const timer = setInterval(function () { tries++; if (initOwl() || tries > 20) clearInterval(timer); }, 150);
        }
        document.addEventListener('visibilitychange', function () { if (!document.hidden) { playActiveMedia({ target: $carousel.get(0) }); } });
        $carousel.on('mouseenter', function () { $carousel.find('video').each(function () { if (!this.muted) this.muted = true; }); });
    });
})();

// ============================================
// 4. CONSOLIDATED DOM MONITOR (Replaces Sections 4, 9, 10)
// ============================================
// Single MutationObserver handles: Headings
// Image limiting removed - all images are displayed
// ============================================
(function() {
    'use strict';
    
    // Emoji helper using code points to avoid charset issues
    const EMOJI = {
        sparkle: String.fromCodePoint(0x2728),   // âœ¨
        money:   String.fromCodePoint(0x1F4B0),  // ðŸ’°
        fire:    String.fromCodePoint(0x1F525),  // ðŸ”¥
        game:    String.fromCodePoint(0x1F3AE),  // ðŸŽ®
        mega:    String.fromCodePoint(0x1F4E3),  // ðŸ“£
    };
    
    // Title replacements (from Section 9)
    const titleReplacements = {
        'pasaran togel': 'Pasaran Togel Resmi',
        'terbaru': `Slot Terbaru ${EMOJI.sparkle}`,
        '100 rp': `Slot Bet 100 ${EMOJI.money}`,
        'populer': `Slot Gacor ${EMOJI.fire}`,
        'provider kami': `${EMOJI.game} Provider Kami`
    };
    
    const normalize = (s) => (s || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    
    // Icon alt texts that need custom class
    const customIconAlts = [
        'Home Icon',
        'Login Icon',
        'Register Icon',
        'Promo Icon',
        'Chat Icon',
        'Slot Icon',
        'Casino Icon',
        'Sport Icon',
        'Togel Icon',
        'Table Icon',
        'Fishing Icon',
        'COCK F. Icon',
        'Arcade Icon',
        'MEGAGACOR Icon'
    ];
    
    // Helper functions
    function processHeading(h) {
        if (h.dataset.titleReplaced === '1') return;
        const k = normalize(h.textContent);
        const v = titleReplacements[k];
        if (v) {
            h.textContent = v;
            h.classList.add('stylish-heading');
            h.dataset.titleReplaced = '1';
        }
    }
    
    function addCustomIconClass(img) {
        if (img.dataset.customIconProcessed) return;
        if (img.tagName !== 'IMG') return;
        
        const alt = img.getAttribute('alt') || '';
        if (customIconAlts.includes(alt)) {
            img.classList.add('down-cus-icon');
            img.dataset.customIconProcessed = 'true';
        }
    }
    
    function adjustOwlItemMargin(element) {
        // Check if element has class 'owl-item active'
        if (element.classList && element.classList.contains('owl-item') && element.classList.contains('active')) {
            const currentMargin = element.style.marginRight || '';
            // Check if margin-right is 30px or contains 30px
            if (currentMargin.includes('30px') || currentMargin === '30px') {
                element.style.marginRight = '15px';
            }
        }
    }
    
    // REMOVED: limitRowImages function - no longer limiting images to 3
    // All images will be displayed as before
    
    // Restore images that were previously limited
    function restoreLimitedImages(row) {
        if (!row.dataset.imagesLimited) return;
        
        const columns = row.querySelectorAll(':scope > div[class*="col-"]');
        columns.forEach(function(col) {
            // Restore display
            if (col.style.display === 'none') {
                col.style.display = '';
            }
            
            // Restore image src if it was stored in data-src
            const img = col.querySelector('img');
            if (img && img.dataset.src && !img.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
        
        // Remove the limit marker
        row.removeAttribute('data-images-limited');
    }
    
    // Main handler for mutations - batch processing for performance
    function handleMutations(mutations) {
        const workToDo = {
            headings: [],
            customIcons: [],
            owlItems: []
        };
        
        // Collect all work first (batch processing)
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType !== 1) return; // Skip text nodes
                    
                    // Collect headings
                    if (node.tagName === 'H3' && (node.classList.contains('my-2') || node.classList.contains('text-center'))) {
                        workToDo.headings.push(node);
                    }
                    
                    // Collect custom icons
                    if (node.tagName === 'IMG') {
                        workToDo.customIcons.push(node);
                    }
                    
                    // Collect owl-item active elements
                    if (node.classList && node.classList.contains('owl-item') && node.classList.contains('active')) {
                        workToDo.owlItems.push(node);
                    }
                    
                    // Restore images if row was previously limited
                    if (node.classList && node.classList.contains('row') && 
                        node.classList.contains('mb-3') && 
                        node.classList.contains('g-1')) {
                        restoreLimitedImages(node);
                    }
                    
                    // Check children
                    if (node.querySelectorAll) {
                        node.querySelectorAll('h3.my-2, h3.text-center').forEach(function(h) {
                            workToDo.headings.push(h);
                        });
                        
                        node.querySelectorAll('img').forEach(function(img) {
                            workToDo.customIcons.push(img);
                        });
                        
                        node.querySelectorAll('.owl-item.active').forEach(function(item) {
                            workToDo.owlItems.push(item);
                        });
                        
                        // Restore images in existing rows
                        node.querySelectorAll('.row.mb-3.g-1').forEach(function(row) {
                            restoreLimitedImages(row);
                        });
                    }
                });
            }
            
            // Also check for attribute changes (class and style changes)
            if (mutation.type === 'attributes') {
                const target = mutation.target;
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    if (target.classList && target.classList.contains('owl-item') && target.classList.contains('active')) {
                        workToDo.owlItems.push(target);
                    }
                }
            }
        });
        
        // Execute all work in batch
        workToDo.headings.forEach(processHeading);
        workToDo.customIcons.forEach(addCustomIconClass);
        workToDo.owlItems.forEach(adjustOwlItemMargin);
    }
    
    // Initial processing on DOM ready
    function initialProcess() {
        // Restore any previously limited images
        document.querySelectorAll('.row.mb-3.g-1[data-images-limited="true"]').forEach(restoreLimitedImages);
        
        // Then process other elements
        document.querySelectorAll('h3.my-2, h3.text-center').forEach(processHeading);
        
        // Process custom icons
        document.querySelectorAll('img').forEach(addCustomIconClass);
        
        // Process owl-item active elements
        document.querySelectorAll('.owl-item.active').forEach(adjustOwlItemMargin);
    }
    
    // Run initial processing - restore images immediately
    if (document.readyState === 'loading') {
        // Restore images immediately (before DOM ready)
        const restoreImagesNow = function() {
            document.querySelectorAll('.row.mb-3.g-1[data-images-limited="true"]').forEach(restoreLimitedImages);
        };
        restoreImagesNow();
        
        document.addEventListener('DOMContentLoaded', function() {
            restoreImagesNow(); // Run again after DOM ready
            window.requestIdleCallback(function() {
                initialProcess();
            }, { timeout: 500 });
        });
    } else {
        // Restore images immediately
        document.querySelectorAll('.row.mb-3.g-1[data-images-limited="true"]').forEach(restoreLimitedImages);
        window.requestIdleCallback(function() {
            initialProcess();
        }, { timeout: 500 });
    }
    
    // Single consolidated MutationObserver with aggressive debouncing
    const debouncedHandleMutations = window.debounce(handleMutations, 200);
    const observer = new MutationObserver(debouncedHandleMutations);
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'], // Only watch class and style changes
        characterData: false // Skip text changes for performance
    });
    
    // Auto-disconnect after 30 seconds to save resources
    setTimeout(function() {
        observer.disconnect();
    }, 30000);
})();

// ============================================
// 5. ENSURE ANNOUNCEMENT ELEMENT
// ============================================
(function() {
    let announcementCreated = false;
    
    function ensureAnnouncementElement() {
        if (announcementCreated || document.getElementById('announcement')) {
            announcementCreated = true;
            return;
        }
        
        const mainContent = document.querySelector('#maincontent');
        if (!mainContent) {
            setTimeout(ensureAnnouncementElement, 100);
            return;
        }
        
        // Find first .container inside #maincontent (login menu container)
        const containers = mainContent.querySelectorAll('.container');
        if (containers.length === 0) {
            setTimeout(ensureAnnouncementElement, 100);
            return;
        }
        
        // Use first container (login menu container)
        const firstContainer = containers[0];
        
        // Check if announcement wrapper already exists
        const existingWrapper = mainContent.querySelector('.my-3:has(#announcement)');
        if (existingWrapper) {
            announcementCreated = true;
            return;
        }
        
        const announcementDiv = document.createElement('div');
        announcementDiv.className = 'my-3';
        announcementDiv.innerHTML = `
            <div id="announcement" class="d-flex bg-primary p-1 align-items-center" style="color:var(--bs-body-bg)">
                <i class="fa-solid fa-bullhorn ms-2"></i>
                <marquee>www.edutoto.com</marquee>
            </div>
        `;
        
        // Insert announcement wrapper AFTER first container inside #maincontent, not inside container
        // Structure should be: #maincontent > .container (login) > .my-3 (announcement) > ...
        if (firstContainer.nextSibling) {
            mainContent.insertBefore(announcementDiv, firstContainer.nextSibling);
        } else {
            mainContent.appendChild(announcementDiv);
        }
        
        announcementCreated = true;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureAnnouncementElement);
    } else {
        ensureAnnouncementElement();
    }
    // Also try after delays to catch late-loading elements
    setTimeout(ensureAnnouncementElement, 200);
    setTimeout(ensureAnnouncementElement, 500);
})();

// ============================================
// 6. WINNERS TICKER & CAROUSEL - REMOVED
// ============================================

// ============================================
// 7. ANNOUNCEMENT TABLES - REMOVED
// ============================================

// ============================================
// 8. REMOVE LIVECHAT ICON FROM FIXED BOTTOM MENUBAR
// ============================================
(function() {
    'use strict';
    function removeLivechatIcon() {
        try {
            // Find all livechat links/elements
            const livechatElements = document.querySelectorAll('a[href="/livechat"], a[href*="livechat"], img[alt*="Livechat"], img[alt*="LIVECHAT"]');
            
            livechatElements.forEach(function(element) {
                // Find parent div with class flex-grow-1
                const parentDiv = element.closest('.flex-grow-1.text-center.align-middle');
                if (parentDiv) {
                    // Check if this div only contains livechat content
                    const link = parentDiv.querySelector('a[href="/livechat"], a[href*="livechat"]');
                    if (link) {
                        parentDiv.remove();
                    }
                }
            });
        } catch (err) {
            // Silently fail if there's an error
            return;
        }
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', removeLivechatIcon);
        }
    } else {
        removeLivechatIcon();
    }
    
    // Also run after a delay to catch dynamically added content
    if (typeof setTimeout !== 'undefined') {
        setTimeout(removeLivechatIcon, 500);
        setTimeout(removeLivechatIcon, 1000);
        setTimeout(removeLivechatIcon, 2000);
    }
    
    // Watch for dynamically added livechat elements
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'A' && (node.href && node.href.includes('livechat'))) {
                            shouldCheck = true;
                        }
                        if (node.tagName === 'IMG' && (node.alt && node.alt.toLowerCase().includes('livechat'))) {
                            shouldCheck = true;
                        }
                        if (node.querySelector && (node.querySelector('a[href*="livechat"]') || node.querySelector('img[alt*="Livechat"]'))) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(removeLivechatIcon, 100);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// 9. HEADING REPLACER
// ============================================
(function () {
    // Emoji helper using code points to avoid charset issues
    const EMOJI = {
        sparkle: String.fromCodePoint(0x2728),   // âœ¨
        money:   String.fromCodePoint(0x1F4B0),  // ðŸ’°
        fire:    String.fromCodePoint(0x1F525),  // ðŸ”¥
        game:    String.fromCodePoint(0x1F3AE),  // ðŸŽ®
        mega:    String.fromCodePoint(0x1F4E3),  // ðŸ“£
    };
    
    const titleReplacements = {
        'pasaran togel': 'Pasaran Togel Resmi',
        'terbaru': `Slot Terbaru ${EMOJI.sparkle}`,
        '100 rp': `Slot Bet 100 ${EMOJI.money}`,
        'populer': `Slot Gacor ${EMOJI.fire}`,
        'provider kami': `${EMOJI.game} Provider Kami`
    };
    
    const normalize = (s) => (s || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    let t;
    
    function updateHeadings() {
        document.querySelectorAll('h3.my-2, h3.text-center').forEach((h) => {
            if (h.dataset.titleReplaced === '1') return;
            const k = normalize(h.textContent);
            const v = titleReplacements[k];
            if (v) {
                h.textContent = v;
                h.classList.add('stylish-heading');
                h.dataset.titleReplaced = '1';
            }
        });
    }
    
    updateHeadings();
    // Optimized MutationObserver dengan debounce yang lebih agresif
    const debouncedUpdateHeadings = window.debounce(updateHeadings, 150);
    const observer = new MutationObserver(debouncedUpdateHeadings);
    observer.observe(document.body, { childList: true, subtree: true, characterData: false }); // characterData: false untuk performance
})();

// ============================================
// 11. REMOVED - Now handled by CSS in panel-moneysite-style.css
// See CSS rule: #navbar-top, #content, .menubar { background: none !important; background-image: none !important; }
// ============================================

// ============================================
// 13. RESTORE ALL GAME IMAGES IN ROW MB-3 G-1
// ============================================
// Restores all images that were previously limited/hidden
// ============================================
(function() {
    'use strict';
    
    function restoreAllGameImages() {
        // Find all row mb-3 g-1 containers
        const gameRows = document.querySelectorAll('.row.mb-3.g-1');
        
        gameRows.forEach(function(row) {
            const columns = row.querySelectorAll(':scope > div[class*="col-"]');
            
            // Restore all hidden columns and images
            columns.forEach(function(col) {
                // Restore display if hidden
                if (col.style.display === 'none') {
                    col.style.display = '';
                }
                
                // Restore image src if it was stored in data-src
                const img = col.querySelector('img');
                if (img) {
                    if (img.dataset.src && !img.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    // Restore srcset if it was stored
                    if (img.dataset.srcset && !img.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                }
            });
            
            // Remove the limit marker
            row.removeAttribute('data-images-limited');
        });
    }
    
    // Run immediately to restore any previously limited images
    restoreAllGameImages();
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            restoreAllGameImages();
        });
    } else {
        restoreAllGameImages();
    }
    
    // Also restore images when new rows are added
    if ('MutationObserver' in window) {
        const observer = new MutationObserver(window.debounce(function(mutations) {
            let shouldRestore = false;
            for (let i = 0; i < mutations.length; i++) {
                const mutation = mutations[i];
                if (mutation.addedNodes.length > 0) {
                    for (let j = 0; j < mutation.addedNodes.length; j++) {
                        const node = mutation.addedNodes[j];
                        if (node.nodeType === 1) { // Element node
                            if (node.classList && node.classList.contains('row') && 
                                node.classList.contains('mb-3') && 
                                node.classList.contains('g-1')) {
                                shouldRestore = true;
                                break;
                            } else if (node.querySelector && node.querySelector('.row.mb-3.g-1')) {
                                shouldRestore = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldRestore) break;
            }
            if (shouldRestore) {
                restoreAllGameImages();
            }
        }, 300));
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Disconnect after 30 seconds to save resources
        setTimeout(function() {
            observer.disconnect();
        }, 30000);
    }
})();

// ============================================
// 14. COMPREHENSIVE PERFORMANCE OPTIMIZATIONS
// ============================================
(function() {
    'use strict';
    
    // Critical: Load scripts in priority order
    const scriptPriority = {
        critical: [],    // Run immediately
        high: [],        // Run after DOM ready
        low: [],         // Run after page load
        idle: []         // Run during idle time
    };
    
    // Optimize all images globally
    function optimizeAllImages() {
        window.requestIdleCallback(function() {
            const images = document.querySelectorAll('img:not([data-optimized])');
            images.forEach(function(img) {
                // Mark as optimized
                img.dataset.optimized = 'true';
                
                // Add loading="lazy" if not present and image is below the fold
                if (!img.loading && !img.hasAttribute('loading')) {
                    const rect = img.getBoundingClientRect();
                    if (rect.top > window.innerHeight) {
                        img.loading = 'lazy';
                    }
                }
                
                // Add decoding="async" for better performance
                if (!img.decoding && !img.hasAttribute('decoding')) {
                    img.decoding = 'async';
                }
                
                // Optimize images that are not visible
                // BUT skip images inside modals (they may be hidden initially but will be shown later)
                const isInModal = img.closest('.modal, .modal-content, .modal-body, [class*="modal"]');
                if (img.offsetParent === null && !isInModal) {
                    img.style.display = 'none';
                }
            });
        }, { timeout: 2000 });
    }
    
    // Restore images in modals when modal is shown
    function restoreModalImages() {
        // Listen for modal show events
        document.addEventListener('show.bs.modal', function(e) {
            const modal = e.target;
            if (!modal) return;
            
            // Find all images in the modal that have display: none
            const images = modal.querySelectorAll('img[data-optimized="true"]');
            images.forEach(function(img) {
                // Remove display: none if it was set by our optimization
                if (img.style.display === 'none' && img.offsetParent !== null) {
                    img.style.display = '';
                }
            });
        }, true);
        
        // Also check when modal is fully shown
        document.addEventListener('shown.bs.modal', function(e) {
            const modal = e.target;
            if (!modal) return;
            
            const images = modal.querySelectorAll('img[data-optimized="true"]');
            images.forEach(function(img) {
                // Ensure image is visible when modal is shown
                if (img.style.display === 'none') {
                    img.style.display = '';
                }
            });
        }, true);
    }
    
    // Defer non-critical CSS animations
    function optimizeAnimations() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.id = 'reduce-motion';
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Limit MutationObserver usage
    let observerCount = 0;
    const maxObservers = 5;
    window.createOptimizedObserver = function(callback, options) {
        if (observerCount >= maxObservers) {
            console.warn('Too many MutationObservers, using debounced fallback');
            return {
                observe: function() {},
                disconnect: function() {},
                takeRecords: function() { return []; }
            };
        }
        observerCount++;
        const observer = new MutationObserver(window.debounce(callback, 300));
        setTimeout(function() {
            observerCount--;
        }, 30000); // Auto cleanup after 30s
        return observer;
    };
    
    // Optimize scroll events
    let scrollTimeout;
    window.addOptimizedScrollListener = function(element, handler, throttleMs) {
        throttleMs = throttleMs || 100;
        const throttledHandler = window.throttle(handler, throttleMs);
        window.addPassiveEventListener(element || window, 'scroll', throttledHandler);
    };
    
    // Preload critical resources
    function preloadCriticalResources() {
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');
        criticalImages.forEach(function(img) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src || img.dataset.src;
            document.head.appendChild(link);
        });
    }
    
    // Monitor and log performance
    if (window.PerformanceObserver) {
        try {
            const perfObserver = new PerformanceObserver(function(list) {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'longtask') {
                        console.warn('Long task detected:', entry.duration, 'ms');
                    }
                }
            });
            perfObserver.observe({ entryTypes: ['longtask'] });
        } catch(e) {
            // PerformanceObserver not fully supported
        }
    }
    
    // Initialize optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            restoreModalImages(); // Restore modal images when modals are shown
            window.deferNonCritical(optimizeAllImages, 500);
            optimizeAnimations();
            preloadCriticalResources();
        });
    } else {
        restoreModalImages(); // Restore modal images when modals are shown
        window.deferNonCritical(optimizeAllImages, 500);
        optimizeAnimations();
        preloadCriticalResources();
    }
    
    // Optimize on page load
    window.addEventListener('load', function() {
        window.requestIdleCallback(function() {
            optimizeAllImages();
            // Clean up any unused observers
            if (observerCount > maxObservers) {
                console.warn('Cleaning up excess observers');
            }
        }, { timeout: 5000 });
    }, { passive: true, once: true });
})();

// ============================================
// SLOT CAROUSEL (TERBARU, BET 100, GACOR)
// ============================================
(function() {
    'use strict';
    if (typeof $ === 'undefined') return;
    
    // List of headings to convert to carousel
    const carouselHeadings = [
        'Slot Terbaru',
        'Terbaru',
        'Slot Bet 100',
        '100 rp',
        'Slot Gacor',
        'Populer',
        'Gacor'
    ];
    
    function initSlotCarousel() {
        // Find all headings that match our list
        const headings = document.querySelectorAll('h3.my-2, h3.stylish-heading');
        const processedHeadings = new Set();
        
        headings.forEach(function(heading) {
            // Skip if already processed
            if (heading.dataset.carouselProcessed === 'true') return;
            
            const text = heading.textContent.trim().toLowerCase();
            let shouldProcess = false;
            
            // Check if heading matches any of our carousel headings
            carouselHeadings.forEach(function(carouselHeading) {
                if (text.includes(carouselHeading.toLowerCase())) {
                    shouldProcess = true;
                }
            });
            
            if (!shouldProcess) return;
            
            // Mark as processed
            heading.dataset.carouselProcessed = 'true';
            processedHeadings.add(heading);
            
            // Process this heading
            processHeadingCarousel(heading);
        });
    }
    
    function processHeadingCarousel(heading) {
        // Find the parent container (usually .d-flex or .container)
        const parentContainer = heading.closest('.container') || heading.parentElement;
        if (!parentContainer) return;
        
        // Find the next row mb-3 g-1 after this heading within the same parent
        let nextElement = heading.nextElementSibling;
        let rowFound = null;
        
        // First, try to find immediate next sibling
        while (nextElement && nextElement !== parentContainer) {
            if (nextElement.classList && nextElement.classList.contains('row') && 
                nextElement.classList.contains('mb-3') && 
                nextElement.classList.contains('g-1')) {
                rowFound = nextElement;
                break;
            }
            nextElement = nextElement.nextElementSibling;
        }
        
        // If not found, search in parent container
        if (!rowFound) {
            const allRows = parentContainer.querySelectorAll('.row.mb-3.g-1');
            // Find the first row that comes after the heading
            allRows.forEach(function(row) {
                if (!rowFound && row.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_PRECEDING) {
                    rowFound = row;
                }
            });
        }
        
        if (!rowFound || rowFound.dataset.carouselInitialized === 'true') return;
        
        // Check if this row has more than 3 items
        const items = rowFound.querySelectorAll(':scope > div[class*="col-"]');
        if (items.length <= 3) return; // Don't convert if 3 or fewer items
        
        // Mark as initialized
        rowFound.dataset.carouselInitialized = 'true';
        
        // Convert to owl carousel
        const $row = $(rowFound);
        $row.addClass('owl-carousel owl-theme slot-carousel');
        $row.removeClass('row mb-3 g-1');
        
        // Wrap each column in item div
        const columns = rowFound.querySelectorAll(':scope > div[class*="col-"]');
        columns.forEach(function(col) {
            const $col = $(col);
            const $item = $('<div class="item"></div>');
            $col.contents().appendTo($item);
            $col.replaceWith($item);
        });
        
        // Initialize owl carousel with 3 items visible, autoplay enabled, smooth animation only for autoplay
        if (typeof $.fn.owlCarousel !== 'undefined') {
            const owlInstance = $row.owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                dots: false,
                autoplay: true,
                autoplayTimeout: 3000,
                autoplayHoverPause: true,
                autoplaySpeed: 1000,
                smartSpeed: 800,
                slideSpeed: 0, // Instant for manual drag (no smooth)
                dragClass: 'owl-drag-active',
                responsive: {
                    0: { items: 3 },
                    600: { items: 3 },
                    1000: { items: 3 }
                }
            });
            
            // Handle manual drag/touch - pause autoplay while dragging, no delay
            let isDragging = false;
            let autoplayResumeTimer = null;
            
            $row.on('drag.owl.carousel', function() {
                isDragging = true;
                owlInstance.trigger('stop.owl.autoplay');
                // Disable smooth transition during manual drag
                $row.find('.owl-stage').css('transition', 'none');
                // Clear any existing resume timer
                if (autoplayResumeTimer) {
                    clearTimeout(autoplayResumeTimer);
                }
            });
            
            $row.on('dragged.owl.carousel', function() {
                isDragging = false;
                // Re-enable smooth transition for autoplay
                $row.find('.owl-stage').css('transition', 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)');
                // Resume autoplay immediately (minimal delay)
                autoplayResumeTimer = setTimeout(function() {
                    if (!isDragging) {
                        owlInstance.trigger('play.owl.autoplay');
                    }
                }, 300); // Minimal delay for immediate response
            });
            
            // Also handle touch events for mobile - immediate response
            let touchStartX = 0;
            let touchEndX = 0;
            let isTouching = false;
            
            $row.on('touchstart', function(e) {
                touchStartX = e.originalEvent.touches[0].clientX;
                isTouching = true;
                owlInstance.trigger('stop.owl.autoplay');
                // Disable smooth transition during touch
                $row.find('.owl-stage').css('transition', 'none');
                if (autoplayResumeTimer) {
                    clearTimeout(autoplayResumeTimer);
                }
            });
            
            $row.on('touchmove', function(e) {
                touchEndX = e.originalEvent.touches[0].clientX;
            });
            
            $row.on('touchend', function() {
                isTouching = false;
                // Re-enable smooth transition for autoplay
                $row.find('.owl-stage').css('transition', 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)');
                // Resume autoplay immediately (minimal delay)
                autoplayResumeTimer = setTimeout(function() {
                    if (!isTouching && !isDragging) {
                        owlInstance.trigger('play.owl.autoplay');
                    }
                }, 300); // Minimal delay for immediate response
            });
        }
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initSlotCarousel, 500);
        });
    } else {
        setTimeout(initSlotCarousel, 500);
    }
    
    // Also watch for dynamic content
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if new heading was added
                        if (node.tagName === 'H3') {
                            const text = node.textContent.trim().toLowerCase();
                            carouselHeadings.forEach(function(carouselHeading) {
                                if (text.includes(carouselHeading.toLowerCase())) {
                                    shouldCheck = true;
                                }
                            });
                        }
                        // Check if new row was added
                        if (node.classList && node.classList.contains('row') && node.classList.contains('mb-3') && node.classList.contains('g-1')) {
                            shouldCheck = true;
                        }
                        // Check if container with heading and row was added
                        if (node.querySelector && node.querySelector('h3') && node.querySelector('.row.mb-3.g-1')) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(initSlotCarousel, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// PROVIDER KAMI - SHOW/HIDE ALL PROVIDERS
// ============================================
(function() {
    'use strict';
    
    const MAX_VISIBLE = 6;
    
    function initProviderKamiToggle() {
        // Find "Provider Kami" heading
        const headings = document.querySelectorAll('h3.text-center.stylish-heading, h3.text-center');
        let providerHeading = null;
        
        headings.forEach(function(heading) {
            const text = heading.textContent.trim();
            if (text.includes('Provider Kami') || text.includes('ÃƒÂ°Ã…Â¸Ã…Â½Ã‚Â® Provider Kami')) {
                providerHeading = heading;
            }
        });
        
        if (!providerHeading) return;
        
        // Find the row with provider images
        const parentContainer = providerHeading.closest('.my-5') || providerHeading.parentElement;
        if (!parentContainer) return;
        
        const row = parentContainer.querySelector('.row.g-1');
        if (!row) return;
        
        // Check if already initialized
        if (row.dataset.providerToggleInitialized === 'true') return;
        row.dataset.providerToggleInitialized = 'true';
        
        const providerItems = row.querySelectorAll(':scope > div[class*="col-"]');
        
        // If there are 6 or fewer items, no need for toggle
        if (providerItems.length <= MAX_VISIBLE) return;
        
        // Hide items beyond MAX_VISIBLE
        providerItems.forEach(function(item, index) {
            if (index >= MAX_VISIBLE) {
                item.style.display = 'none';
                item.dataset.providerHidden = 'true';
            }
        });
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'btn btn-primary provider-toggle-btn mt-3 mb-3';
        toggleButton.style.cssText = 'width: 100%; padding: 0px; font-size: 20px; font-weight: 600; border-radius: 10px;';
        toggleButton.innerHTML = '<span>Lihat Seluruh Provider</span> <i class="fa-solid fa-angles-right"></i>';
        
        let isExpanded = false;
        
        toggleButton.addEventListener('click', function() {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                // Show all items
                providerItems.forEach(function(item) {
                    item.style.display = '';
                    item.removeAttribute('data-provider-hidden');
                    
                    // Restore images inside this item that were hidden by optimization
                    const images = item.querySelectorAll('img');
                    images.forEach(function(img) {
                        // Remove display: none from images
                        if (img.style.display === 'none') {
                            img.style.display = '';
                        }
                        
                        // If image has lazy loading attributes, trigger load
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.remove('lazy');
                        }
                        
                        // Force image to reload if it failed to load
                        if (!img.complete || img.naturalWidth === 0) {
                            const originalSrc = img.src;
                            img.src = '';
                            setTimeout(function() {
                                img.src = originalSrc;
                            }, 10);
                        }
                    });
                });
                
                // Trigger IntersectionObserver to observe newly visible images
                if (window.lazyImageObserver) {
                    providerItems.forEach(function(item) {
                        const images = item.querySelectorAll('img[data-src]');
                        images.forEach(function(img) {
                            window.lazyImageObserver.observe(img);
                        });
                    });
                }
                
                toggleButton.innerHTML = '<span>Sembunyikan</span> <i class="fa-solid fa-angles-right"></i>';
            } else {
                // Hide items beyond MAX_VISIBLE
                providerItems.forEach(function(item, index) {
                    if (index >= MAX_VISIBLE) {
                        item.style.display = 'none';
                        item.dataset.providerHidden = 'true';
                    }
                });
                toggleButton.innerHTML = '<span>Lihat Seluruh Provider</span> <i class="fa-solid fa-angles-right"></i>';
            }
        });
        
        // Insert button after the row
        row.parentNode.insertBefore(toggleButton, row.nextSibling);
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initProviderKamiToggle, 500);
        });
    } else {
        setTimeout(initProviderKamiToggle, 500);
    }
    
    // Watch for dynamic content
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'H3') {
                            const text = node.textContent.trim();
                            if (text.includes('Provider Kami') || text.includes('ÃƒÂ°Ã…Â¸Ã…Â½Ã‚Â® Provider Kami')) {
                                shouldCheck = true;
                            }
                        }
                        if (node.classList && node.classList.contains('row') && node.classList.contains('g-1')) {
                            shouldCheck = true;
                        }
                        if (node.querySelector && node.querySelector('h3') && node.querySelector('.row.g-1')) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(initProviderKamiToggle, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// REMOVE MODAL BACKDROP
// ============================================
(function() {
    'use strict';
    
    function removeModalBackdrop() {
        // Find all modal backdrop elements
        const backdrops = document.querySelectorAll('.modal-backdrop.fade.show');
        
        backdrops.forEach(function(backdrop) {
            backdrop.remove();
        });
        
        // Also remove from body class if exists
        if (document.body.classList.contains('modal-open')) {
            document.body.classList.remove('modal-open');
        }
    }
    
    // Run immediately and on DOM ready
    removeModalBackdrop();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeModalBackdrop);
    }
    
    // Watch for dynamically added modal backdrops
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if added node is a backdrop
                        if (node.classList && node.classList.contains('modal-backdrop')) {
                            node.remove();
                            if (document.body.classList.contains('modal-open')) {
                                document.body.classList.remove('modal-open');
                            }
                        }
                        // Check if backdrop was added inside the node
                        if (node.querySelectorAll) {
                            const backdrops = node.querySelectorAll('.modal-backdrop');
                            backdrops.forEach(function(backdrop) {
                                backdrop.remove();
                            });
                        }
                    }
                });
            }
        });
        
        // Also check for existing backdrops periodically
        removeModalBackdrop();
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Also run periodically to catch any missed backdrops
    setInterval(removeModalBackdrop, 500);
})();

// ============================================
// ADD TEXT-LIGHT CLASS TO H4 TEXT-WHITE
// ============================================
(function() {
    'use strict';
    
    function addTextLightClass() {
        // Find all h4 elements with class text-white
        const h4Elements = document.querySelectorAll('h4.text-white');
        
        h4Elements.forEach(function(h4) {
            // Add text-light class if not already present
            if (!h4.classList.contains('text-light')) {
                h4.classList.add('text-light');
            }
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addTextLightClass, 500);
        });
    } else {
        setTimeout(addTextLightClass, 500);
    }
    
    // Watch for dynamically added h4 elements
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if new h4 with text-white was added
                        if (node.tagName === 'H4' && node.classList.contains('text-white')) {
                            shouldCheck = true;
                        }
                        // Check if h4 was added inside the node
                        if (node.querySelectorAll && node.querySelectorAll('h4.text-white').length > 0) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(addTextLightClass, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// ADD MARGIN-BOTTOM TO COL-12 COL-LG-6 MB-3 WITH OPTIMIZED IMAGES
// ============================================
(function() {
    'use strict';
    
    function addMarginBottomToCols() {
        // Find all divs with class col-12 col-lg-6 mb-3
        const cols = document.querySelectorAll('div.col-12.col-lg-6.mb-3');
        
        cols.forEach(function(col) {
            // Skip if already processed
            if (col.dataset.marginBottomAdded === 'true') {
                return;
            }
            
            // Check if this div contains a link with href containing "/promotion/"
            const promotionLink = col.querySelector('a[href*="/promotion/"]');
            
            // Only apply if it's a promotion element
            if (!promotionLink) {
                return;
            }
            
            // Check if this div contains an image with data-optimized="true"
            const optimizedImg = col.querySelector('img[data-optimized="true"]');
            
            if (optimizedImg) {
                // Add margin-bottom style
                col.style.setProperty('margin-bottom', '-3rem', 'important');
                col.dataset.marginBottomAdded = 'true';
            }
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addMarginBottomToCols, 500);
        });
    } else {
        setTimeout(addMarginBottomToCols, 500);
    }
    
    // Watch for dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if new col-12 col-lg-6 mb-3 div was added
                        if (node.classList && 
                            node.classList.contains('col-12') && 
                            node.classList.contains('col-lg-6') && 
                            node.classList.contains('mb-3')) {
                            shouldCheck = true;
                        }
                        // Check if image with data-optimized was added
                        if (node.tagName === 'IMG' && node.getAttribute('data-optimized') === 'true') {
                            shouldCheck = true;
                        }
                        // Check if col or optimized image was added inside the node
                        if (node.querySelectorAll && (
                            node.querySelectorAll('div.col-12.col-lg-6.mb-3').length > 0 ||
                            node.querySelectorAll('img[data-optimized="true"]').length > 0
                        )) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(addMarginBottomToCols, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// ADD MARGIN-TOP TO PROMOTION COL-12 COL-LG-6 MB-3 ELEMENTS
// ============================================
(function() {
    'use strict';
    
    function addMarginTopToPromotionCols() {
        // Find all divs with class col-12 col-lg-6 mb-3
        const cols = document.querySelectorAll('div.col-12.col-lg-6.mb-3');
        
        cols.forEach(function(col) {
            // Skip if already processed
            if (col.dataset.marginTopAdded === 'true') {
                return;
            }
            
            // Check if this div contains a link with href containing "/promotion/"
            const promotionLink = col.querySelector('a[href*="/promotion/"]');
            
            // Only apply if it's a promotion element
            if (!promotionLink) {
                return;
            }
            
            // Check if this div contains an image with data-optimized="true"
            const optimizedImg = col.querySelector('img[data-optimized="true"]');
            
            if (optimizedImg) {
                // Add margin-top style directly to the div
                col.style.setProperty('margin-top', '80px', 'important');
                col.dataset.marginTopAdded = 'true';
            }
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addMarginTopToPromotionCols, 500);
        });
    } else {
        setTimeout(addMarginTopToPromotionCols, 500);
    }
    
    // Watch for dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if new col-12 col-lg-6 mb-3 div was added
                        if (node.classList && 
                            node.classList.contains('col-12') && 
                            node.classList.contains('col-lg-6') && 
                            node.classList.contains('mb-3')) {
                            shouldCheck = true;
                        }
                        // Check if image with data-optimized was added
                        if (node.tagName === 'IMG' && node.getAttribute('data-optimized') === 'true') {
                            shouldCheck = true;
                        }
                        // Check if promotion link was added
                        if (node.tagName === 'A' && node.href && node.href.includes('/promotion/')) {
                            shouldCheck = true;
                        }
                        // Check if col, optimized image, or promotion link was added inside the node
                        if (node.querySelectorAll && (
                            node.querySelectorAll('div.col-12.col-lg-6.mb-3').length > 0 ||
                            node.querySelectorAll('img[data-optimized="true"]').length > 0 ||
                            node.querySelectorAll('a[href*="/promotion/"]').length > 0
                        )) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(addMarginTopToPromotionCols, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// WRAP PROMOTION IMAGES BEFORE CONTAINER MT-3 MB-5
// ============================================
(function() {
    'use strict';
    
    function wrapPromotionImagesBeforeContainer() {
        // Only run on promotion pages
        if (!window.location.pathname.includes('/promotion/')) {
            return;
        }
        
        // Find #maincontent
        const maincontent = document.querySelector('#maincontent');
        if (!maincontent) return;
        
        // Find all images with class w-100 and data-optimized="true" in maincontent
        const images = maincontent.querySelectorAll('img.w-100[data-optimized="true"]');
        
        images.forEach(function(img) {
            // Skip if already wrapped with margin-top: 80px
            if (img.parentElement && img.parentElement.style.marginTop === '80px') {
                return;
            }
            
            // Skip if already processed
            if (img.dataset.promotionContainerWrapped === 'true') {
                return;
            }
            
            // Check if there's a <div class="container mt-3 mb-5"> after this image
            // We need to check if the image is directly in maincontent or in a picture tag
            let nextElement = img.parentElement;
            
            // If image is inside picture tag, check from picture's next sibling
            if (nextElement.tagName === 'PICTURE') {
                nextElement = nextElement.nextElementSibling;
            } else {
                // If image is directly in maincontent, check its next sibling
                if (img.parentElement === maincontent) {
                    nextElement = img.nextElementSibling;
                } else {
                    // Otherwise, check parent's next sibling
                    nextElement = img.parentElement.nextElementSibling;
                }
            }
            
            // Check if next element is the container we're looking for
            let foundContainer = false;
            if (nextElement && 
                nextElement.classList && 
                nextElement.classList.contains('container') && 
                nextElement.classList.contains('mt-3') && 
                nextElement.classList.contains('mb-5')) {
                foundContainer = true;
            }
            
            // Also check if we can find the container by traversing siblings
            if (!foundContainer) {
                let current = img.parentElement;
                // If image is in picture, start from picture
                if (current.tagName === 'PICTURE') {
                    current = current.nextElementSibling;
                } else {
                    current = current.nextElementSibling || img.nextElementSibling;
                }
                
                // Check next few siblings
                for (let i = 0; i < 3 && current; i++) {
                    if (current.classList && 
                        current.classList.contains('container') && 
                        current.classList.contains('mt-3') && 
                        current.classList.contains('mb-5')) {
                        foundContainer = true;
                        break;
                    }
                    current = current.nextElementSibling;
                }
            }
            
            // Only wrap if container is found
            if (foundContainer) {
                // Create wrapper div
                const wrapper = document.createElement('div');
                wrapper.style.marginTop = '80px';
                
                // If image is inside picture tag, wrap the picture tag
                if (img.parentElement.tagName === 'PICTURE') {
                    const picture = img.parentElement;
                    picture.parentNode.insertBefore(wrapper, picture);
                    wrapper.appendChild(picture);
                } else {
                    // Otherwise, wrap the image directly
                    img.parentNode.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                }
                
                // Mark as processed
                img.dataset.promotionContainerWrapped = 'true';
            }
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(wrapPromotionImagesBeforeContainer, 500);
        });
    } else {
        setTimeout(wrapPromotionImagesBeforeContainer, 500);
    }
    
    // Watch for dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        // Only watch if we're on a promotion page
        if (!window.location.pathname.includes('/promotion/')) {
            return;
        }
        
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if new image with w-100 and data-optimized was added
                        if (node.tagName === 'IMG' && 
                            node.classList.contains('w-100') && 
                            node.getAttribute('data-optimized') === 'true') {
                            shouldCheck = true;
                        }
                        // Check if container mt-3 mb-5 was added
                        if (node.classList && 
                            node.classList.contains('container') && 
                            node.classList.contains('mt-3') && 
                            node.classList.contains('mb-5')) {
                            shouldCheck = true;
                        }
                        // Check if image or container was added inside the node
                        if (node.querySelectorAll && (
                            node.querySelectorAll('img.w-100[data-optimized="true"]').length > 0 ||
                            node.querySelectorAll('div.container.mt-3.mb-5').length > 0
                        )) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(wrapPromotionImagesBeforeContainer, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// CHANGE MARGIN-BOTTOM OF LAST PROMOTION ITEM
// ============================================
(function() {
    'use strict';
    
    function changeLastPromotionItemMargin() {
        // Find all rows that contain promotion items
        const rows = document.querySelectorAll('.row');
        
        rows.forEach(function(row) {
            // Find all promotion items in this row (col-12 col-lg-6 mb-3 with margin-bottom: -3rem)
            const promotionItems = row.querySelectorAll('div.col-12.col-lg-6.mb-3[data-margin-bottom-added="true"]');
            
            if (promotionItems.length === 0) return;
            
            // Find the last item in the row
            const lastItem = promotionItems[promotionItems.length - 1];
            
            // Check if it has margin-bottom: -3rem
            const currentMarginBottom = lastItem.style.getPropertyValue('margin-bottom');
            if (currentMarginBottom === '-3rem' || currentMarginBottom.includes('-3rem')) {
                // Change to margin-bottom: 3rem
                lastItem.style.setProperty('margin-bottom', '3rem', 'important');
                lastItem.dataset.lastItemMarginChanged = 'true';
            }
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(changeLastPromotionItemMargin, 500);
        });
    } else {
        setTimeout(changeLastPromotionItemMargin, 500);
    }
    
    // Watch for dynamically added elements
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if new row was added
                        if (node.classList && node.classList.contains('row')) {
                            shouldCheck = true;
                        }
                        // Check if new promotion item was added
                        if (node.classList && 
                            node.classList.contains('col-12') && 
                            node.classList.contains('col-lg-6') && 
                            node.classList.contains('mb-3') &&
                            node.getAttribute('data-margin-bottom-added') === 'true') {
                            shouldCheck = true;
                        }
                        // Check if row or promotion item was added inside the node
                        if (node.querySelectorAll && (
                            node.querySelectorAll('.row').length > 0 ||
                            node.querySelectorAll('div.col-12.col-lg-6.mb-3[data-margin-bottom-added="true"]').length > 0
                        )) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(changeLastPromotionItemMargin, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// SET ARTICLE CONTENT TEXT COLOR TO BLACK
// ============================================
(function() {
    'use strict';
    
    function setArticleContentColor() {
        // Find the article-content element
        const articleContent = document.querySelector('#article-content');
        if (articleContent && articleContent.dataset.colorSet !== 'true') {
            // Set all styles for article-content
            articleContent.style.setProperty('color', '#e0a52e', 'important');
            articleContent.style.setProperty('border', 'solid 2px', 'important');
            articleContent.style.setProperty('border-radius', '13px', 'important');
            articleContent.style.setProperty('padding', '5px', 'important');
            articleContent.style.setProperty('background-color', '#1f1c17', 'important');
            articleContent.dataset.colorSet = 'true';
        }
        
        // Find h1 elements inside container mt-3 mb-5
        const containers = document.querySelectorAll('div.container.mt-3.mb-5');
        containers.forEach(function(container) {
            const h1 = container.querySelector('h1');
            if (h1 && h1.dataset.colorSet !== 'true') {
                // Set all styles for h1
                h1.style.setProperty('color', '#e0a52e', 'important');
                h1.style.setProperty('font-weight', 'bold', 'important');
                h1.style.setProperty('border', 'solid 2px', 'important');
                h1.style.setProperty('border-radius', '13px', 'important');
                h1.style.setProperty('text-align', 'center', 'important');
                h1.style.setProperty('background-color', '#1f1c17', 'important');
                h1.dataset.colorSet = 'true';
            }
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setArticleContentColor, 500);
        });
    } else {
        setTimeout(setArticleContentColor, 500);
    }
    
    // Watch for dynamically added article-content element and h1
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if article-content was added
                        if (node.id === 'article-content') {
                            shouldCheck = true;
                        }
                        // Check if h1 was added
                        if (node.tagName === 'H1') {
                            shouldCheck = true;
                        }
                        // Check if container mt-3 mb-5 was added
                        if (node.classList && 
                            node.classList.contains('container') && 
                            node.classList.contains('mt-3') && 
                            node.classList.contains('mb-5')) {
                            shouldCheck = true;
                        }
                        // Check if article-content, h1, or container was added inside the node
                        if (node.querySelectorAll && (
                            node.querySelectorAll('#article-content').length > 0 ||
                            node.querySelectorAll('h1').length > 0 ||
                            node.querySelectorAll('div.container.mt-3.mb-5').length > 0
                        )) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(setArticleContentColor, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// ADD PADDING TO MODAL DIALOG
// ============================================
(function() {
    'use strict';
    
    function addModalDialogPadding() {
        // Find all modal dialogs with class modal-dialog-centered
        const modalDialogs = document.querySelectorAll('div.modal-dialog.modal-dialog-centered');
        
        modalDialogs.forEach(function(modalDialog) {
            // Skip if already processed
            if (modalDialog.dataset.paddingAdded === 'true') {
                return;
            }
            
            // Add padding-top and padding-bottom
            modalDialog.style.setProperty('padding-top', '150px', 'important');
            modalDialog.style.setProperty('padding-bottom', '75px', 'important');
            modalDialog.dataset.paddingAdded = 'true';
        });
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(addModalDialogPadding, 500);
        });
    } else {
        setTimeout(addModalDialogPadding, 500);
    }
    
    // Watch for dynamically added modal dialogs
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if modal dialog was added
                        if (node.classList && 
                            node.classList.contains('modal-dialog') && 
                            node.classList.contains('modal-dialog-centered')) {
                            shouldCheck = true;
                        }
                        // Check if modal dialog was added inside the node
                        if (node.querySelectorAll && 
                            node.querySelectorAll('div.modal-dialog.modal-dialog-centered').length > 0) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(addModalDialogPadding, 300);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();

// ============================================
// PREVENT AUTO ZOOM ON FORM INPUT
// ============================================
(function() {
    'use strict';
    
    function preventAutoZoom() {
        // Add or update viewport meta tag to prevent zoom
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.getElementsByTagName('head')[0].appendChild(viewport);
        }
        
        // Set viewport content to prevent zoom
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        // Prevent zoom on input focus using touchstart
        function preventZoomOnFocus(e) {
            // Check if element is input, textarea, or select
            if (e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.tagName === 'SELECT') {
                
                // Ensure font-size is at least 16px to prevent auto zoom on iOS
                const computedStyle = window.getComputedStyle(e.target);
                const fontSize = parseFloat(computedStyle.fontSize);
                
                if (fontSize < 16) {
                    e.target.style.fontSize = '16px';
                }
            }
        }
        
        // Add event listeners to prevent zoom
        document.addEventListener('touchstart', preventZoomOnFocus, { passive: true });
        document.addEventListener('focusin', preventZoomOnFocus, { passive: true });
        
        // Also prevent zoom on all existing form elements
        const formElements = document.querySelectorAll('input, textarea, select');
        formElements.forEach(function(element) {
            const computedStyle = window.getComputedStyle(element);
            const fontSize = parseFloat(computedStyle.fontSize);
            
            if (fontSize < 16) {
                element.style.fontSize = '16px';
            }
            
            // Prevent zoom on focus
            element.addEventListener('focus', function(e) {
                const style = window.getComputedStyle(e.target);
                const fs = parseFloat(style.fontSize);
                if (fs < 16) {
                    e.target.style.fontSize = '16px';
                }
            }, { passive: true });
        });
    }
    
    // Run immediately to set viewport
    preventAutoZoom();
    
    // Run on DOM ready to handle existing form elements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(preventAutoZoom, 100);
        });
    } else {
        setTimeout(preventAutoZoom, 100);
    }
    
    // Watch for dynamically added form elements
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if form element was added
                        if (node.tagName === 'INPUT' || 
                            node.tagName === 'TEXTAREA' || 
                            node.tagName === 'SELECT') {
                            shouldCheck = true;
                        }
                        // Check if form element was added inside the node
                        if (node.querySelectorAll && (
                            node.querySelectorAll('input, textarea, select').length > 0
                        )) {
                            shouldCheck = true;
                        }
                    }
                });
            }
        });
        if (shouldCheck) {
            setTimeout(preventAutoZoom, 100);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
})();
