/**
 * ShoreSquad - Beach Cleanup Community App
 * Main JavaScript file for interactive features
 */

// App Configuration
const CONFIG = {
  WEATHER_API_KEY: 'demo-key', // Replace with actual API key
  WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
  MAP_DEFAULT_CENTER: [37.7749, -122.4194], // San Francisco
  MAP_DEFAULT_ZOOM: 10,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500
};

// Global State
const AppState = {
  map: null,
  currentWeatherData: null,
  events: [],
  filteredEvents: [],
  currentFilter: 'all',
  isLoading: false,
  userLocation: null
};

// Utility Functions
const Utils = {
  // Debounce function for search inputs
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Format date for display
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  },

  // Generate unique ID
  generateId: () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  },

  // Show loading spinner
  showLoading: () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.style.display = 'flex';
      spinner.classList.add('active');
      AppState.isLoading = true;
    }
  },

  // Hide loading spinner
  hideLoading: () => {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      spinner.classList.remove('active');
      setTimeout(() => {
        spinner.style.display = 'none';
      }, CONFIG.ANIMATION_DURATION);
      AppState.isLoading = false;
    }
  },

  // Show toast notification
  showToast: (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}" aria-hidden="true"></i>
        <span>${message}</span>
      </div>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);
  },

  // Animate counter numbers
  animateCounter: (element, target) => {
    const start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  },

  // Get user's location
  getUserLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          AppState.userLocation = [latitude, longitude];
          resolve([latitude, longitude]);
        },
        error => {
          console.warn('Location access denied:', error.message);
          resolve(CONFIG.MAP_DEFAULT_CENTER); // Fallback to default
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }
};

// Navigation Handler
const Navigation = {
  init: () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
      });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            navMenu?.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
        navMenu?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  }
};

// Weather Module
const Weather = {
  init: () => {
    const searchBtn = document.getElementById('weather-search-btn');
    const locationInput = document.getElementById('location-input');
    const weatherDisplay = document.getElementById('weather-display');

    if (searchBtn && locationInput) {
      const debouncedSearch = Utils.debounce(Weather.searchWeather, CONFIG.DEBOUNCE_DELAY);
      
      searchBtn.addEventListener('click', () => Weather.searchWeather());
      locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') Weather.searchWeather();
      });
      locationInput.addEventListener('input', debouncedSearch);
    }

    // Load default weather for user location or San Francisco
    Weather.loadDefaultWeather();
  },

  loadDefaultWeather: async () => {
    try {
      const location = await Utils.getUserLocation();
      await Weather.fetchWeatherByCoords(location[0], location[1]);
    } catch (error) {
      console.error('Failed to load default weather:', error);
      Weather.showDemoWeather();
    }
  },

  searchWeather: async () => {
    const locationInput = document.getElementById('location-input');
    const location = locationInput?.value.trim();
    
    if (!location) return;

    Utils.showLoading();
    
    try {
      await Weather.fetchWeatherByLocation(location);
      Utils.showToast('Weather data updated!');
    } catch (error) {
      console.error('Weather search failed:', error);
      Utils.showToast('Unable to fetch weather data. Showing demo data.', 'warning');
      Weather.showDemoWeather();
    } finally {
      Utils.hideLoading();
    }
  },

  fetchWeatherByLocation: async (location) => {
    // For demo purposes, show demo data
    // In production, replace with actual API call
    Weather.showDemoWeather(location);
  },

  fetchWeatherByCoords: async (lat, lon) => {
    // For demo purposes, show demo data
    // In production, replace with actual API call
    Weather.showDemoWeather(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
  },

  showDemoWeather: (location = 'San Francisco, CA') => {
    const weatherDisplay = document.getElementById('weather-display');
    if (!weatherDisplay) return;

    const demoData = [
      {
        title: 'Current Weather',
        icon: 'fas fa-sun',
        temp: '72°F',
        condition: 'Sunny',
        details: { humidity: '65%', wind: '8 mph', uv: 'Moderate' }
      },
      {
        title: 'Beach Conditions',
        icon: 'fas fa-water',
        temp: '68°F',
        condition: 'Calm Waters',
        details: { waves: '2-3 ft', tide: 'High', visibility: 'Clear' }
      },
      {
        title: 'Cleanup Rating',
        icon: 'fas fa-star',
        temp: '9/10',
        condition: 'Excellent',
        details: { wind: 'Light', rain: '0%', comfort: 'High' }
      }
    ];

    weatherDisplay.innerHTML = demoData.map(item => `
      <div class="weather-card">
        <div class="weather-icon">
          <i class="${item.icon}" aria-hidden="true"></i>
        </div>
        <div class="weather-temp">${item.temp}</div>
        <div class="weather-condition">${item.condition}</div>
        <div class="weather-details">
          ${Object.entries(item.details).map(([key, value]) => 
            `<span><strong>${key}:</strong> ${value}</span>`
          ).join('')}
        </div>
      </div>
    `).join('');

    AppState.currentWeatherData = { location, data: demoData };
  }
};

// Map Module
const MapModule = {
  init: async () => {
    const mapElement = document.getElementById('cleanup-map');
    if (!mapElement) return;

    try {
      const location = await Utils.getUserLocation();
      MapModule.initializeMap(location);
      MapModule.loadEvents();
    } catch (error) {
      console.error('Map initialization failed:', error);
      MapModule.initializeMap(CONFIG.MAP_DEFAULT_CENTER);
    }
  },

  initializeMap: (center) => {
    const mapElement = document.getElementById('cleanup-map');
    if (!mapElement || !window.L) {
      console.error('Leaflet not loaded or map element not found');
      return;
    }

    AppState.map = L.map('cleanup-map').setView(center, CONFIG.MAP_DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(AppState.map);

    // Add user location marker if available
    if (AppState.userLocation) {
      L.marker(AppState.userLocation)
        .addTo(AppState.map)
        .bindPopup('Your Location')
        .openPopup();
    }
  },

  loadEvents: () => {
    // Demo event data
    const demoEvents = [
      {
        id: 1,
        title: 'Ocean Beach Cleanup',
        location: 'Ocean Beach, SF',
        coords: [37.7594, -122.5107],
        date: '2025-06-07',
        time: '9:00 AM',
        attendees: 23,
        status: 'upcoming'
      },
      {
        id: 2,
        title: 'Baker Beach Community Cleanup',
        location: 'Baker Beach, SF',
        coords: [37.7937, -122.4849],
        date: '2025-06-08',
        time: '10:00 AM',
        attendees: 31,
        status: 'active'
      },
      {
        id: 3,
        title: 'Crissy Field Beach Day',
        location: 'Crissy Field, SF',
        coords: [37.8018, -122.4653],
        date: '2025-06-05',
        time: '2:00 PM',
        attendees: 18,
        status: 'completed'
      }
    ];

    AppState.events = demoEvents;
    MapModule.addEventMarkers(demoEvents);
  },

  addEventMarkers: (events) => {
    if (!AppState.map) return;

    events.forEach(event => {
      const markerColor = event.status === 'active' ? 'green' : 
                         event.status === 'upcoming' ? 'blue' : 'gray';
      
      const marker = L.marker(event.coords)
        .addTo(AppState.map)
        .bindPopup(`
          <div class="map-popup">
            <h4>${event.title}</h4>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-calendar"></i> ${Utils.formatDate(event.date)} at ${event.time}</p>
            <p><i class="fas fa-users"></i> ${event.attendees} attending</p>
            <button class="btn btn-primary btn-sm" onclick="Events.joinEvent(${event.id})">
              ${event.status === 'upcoming' ? 'Join Event' : 'View Details'}
            </button>
          </div>
        `);
    });
  }
};

// Events Module
const Events = {
  init: () => {
    Events.setupFilters();
    Events.loadEvents();
    Events.bindActions();
  },

  setupFilters: () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        Events.setFilter(filter);
        
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  },

  setFilter: (filter) => {
    AppState.currentFilter = filter;
    Events.renderEvents();
  },

  loadEvents: () => {
    // Use the same demo data as the map
    AppState.filteredEvents = AppState.events;
    Events.renderEvents();
  },

  renderEvents: () => {
    const eventsGrid = document.getElementById('events-grid');
    if (!eventsGrid) return;

    let filteredEvents = [...AppState.events];

    // Apply filters
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (AppState.currentFilter) {
      case 'this-week':
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.date) <= oneWeek && new Date(event.date) >= now
        );
        break;
      case 'weekend':
        filteredEvents = filteredEvents.filter(event => {
          const day = new Date(event.date).getDay();
          return day === 0 || day === 6; // Sunday or Saturday
        });
        break;
      case 'nearby':
        // For demo, just show all events
        break;
    }

    eventsGrid.innerHTML = filteredEvents.map(event => `
      <div class="event-card" data-event-id="${event.id}">
        <div class="event-image">
          <i class="fas fa-water" aria-hidden="true"></i>
        </div>
        <div class="event-content">
          <span class="event-date">${Utils.formatDate(event.date)}</span>
          <h3 class="event-title">${event.title}</h3>
          <p class="event-location">
            <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
            ${event.location}
          </p>
          <p class="event-description">
            Join our community cleanup event and help keep our beaches beautiful! 
            Perfect for all ages and experience levels.
          </p>
          <div class="event-actions">
            <button class="btn btn-primary" onclick="Events.joinEvent(${event.id})">
              Join Event
            </button>
            <button class="btn btn-secondary" onclick="Events.shareEvent(${event.id})">
              Share
            </button>
          </div>
        </div>
      </div>
    `).join('');

    AppState.filteredEvents = filteredEvents;
  },

  bindActions: () => {
    const loadMoreBtn = document.getElementById('load-more-events');
    const findEventsBtn = document.getElementById('find-events-btn');
    const createEventBtn = document.getElementById('create-event-btn');

    loadMoreBtn?.addEventListener('click', Events.loadMoreEvents);
    findEventsBtn?.addEventListener('click', Events.findNearbyEvents);
    createEventBtn?.addEventListener('click', Events.createEvent);
  },

  joinEvent: (eventId) => {
    const event = AppState.events.find(e => e.id === eventId);
    if (event) {
      Utils.showToast(`Successfully joined "${event.title}"!`);
      event.attendees += 1;
      Events.renderEvents();
    }
  },

  shareEvent: (eventId) => {
    const event = AppState.events.find(e => e.id === eventId);
    if (event && navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join me at ${event.title} on ${Utils.formatDate(event.date)}!`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      const url = `${window.location.href}#event-${eventId}`;
      navigator.clipboard.writeText(url).then(() => {
        Utils.showToast('Event link copied to clipboard!');
      });
    }
  },

  loadMoreEvents: () => {
    Utils.showToast('Loading more events...', 'info');
    // In a real app, this would fetch more events from the API
  },

  findNearbyEvents: async () => {
    Utils.showLoading();
    try {
      const location = await Utils.getUserLocation();
      Utils.showToast('Found events near your location!');
      // Scroll to events section
      document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      Utils.showToast('Please enable location access to find nearby events.', 'warning');
    } finally {
      Utils.hideLoading();
    }
  },

  createEvent: () => {
    Utils.showToast('Event creation feature coming soon!', 'info');
    // In a real app, this would open a create event modal or form
  }
};

// Community Module
const Community = {
  init: () => {
    Community.setupSignup();
    Community.animateStats();
  },

  setupSignup: () => {
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const errorElement = document.getElementById('email-error');

    if (signupForm && emailInput) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const isValid = Community.validateEmail(email);
        
        if (isValid) {
          errorElement.textContent = '';
          Community.handleSignup(email);
        } else {
          errorElement.textContent = 'Please enter a valid email address.';
          errorElement.setAttribute('aria-live', 'polite');
        }
      });

      emailInput.addEventListener('input', () => {
        errorElement.textContent = '';
      });
    }
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  handleSignup: (email) => {
    Utils.showLoading();
    
    // Simulate API call
    setTimeout(() => {
      Utils.hideLoading();
      Utils.showToast('Welcome to the ShoreSquad! Check your email for next steps.');
      document.getElementById('email').value = '';
      
      // Update stats
      const statElements = document.querySelectorAll('.stat-number');
      if (statElements[2]) {
        const currentCount = parseInt(statElements[2].textContent.replace(/,/g, ''));
        Utils.animateCounter(statElements[2], currentCount + 1);
      }
    }, 1500);
  },

  animateStats: () => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll('.stat-number');
          statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            Utils.animateCounter(stat, target);
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
      observer.observe(statsContainer);
    }
  }
};

// Accessibility Module
const Accessibility = {
  init: () => {
    Accessibility.setupKeyboardNavigation();
    Accessibility.setupFocusManagement();
    Accessibility.setupARIALiveRegions();
  },

  setupKeyboardNavigation: () => {
    // Escape key closes mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu?.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle?.setAttribute('aria-expanded', 'false');
          navToggle?.focus();
        }
      }
    });
  },

  setupFocusManagement: () => {
    // Trap focus in mobile menu when open
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (navMenu && navToggle) {
      const focusableElements = navMenu.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      
      navMenu.addEventListener('keydown', (e) => {
        if (!navMenu.classList.contains('active')) return;
        
        if (e.key === 'Tab') {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }
  },

  setupARIALiveRegions: () => {
    // Announce dynamic content changes
    const announceChange = (message, priority = 'polite') => {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      announcer.textContent = message;
      
      document.body.appendChild(announcer);
      
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    };

    // Make announcements available globally
    window.announceChange = announceChange;
  }
};

// Performance Module
const Performance = {
  init: () => {
    Performance.setupLazyLoading();
    Performance.preloadCriticalResources();
    Performance.optimizeImages();
  },

  setupLazyLoading: () => {
    // Lazy load images when they come into view
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  },

  preloadCriticalResources: () => {
    // Preload map tiles for better performance
    if (window.L) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
      document.head.appendChild(link);
    }
  },

  optimizeImages: () => {
    // Add loading="lazy" to images below the fold
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (index > 2) { // Skip first few images that are likely above the fold
        img.loading = 'lazy';
      }
    });
  }
};

// Error Handling
const ErrorHandler = {
  init: () => {
    window.addEventListener('error', ErrorHandler.handleGlobalError);
    window.addEventListener('unhandledrejection', ErrorHandler.handleUnhandledRejection);
  },

  handleGlobalError: (event) => {
    console.error('Global error:', event.error);
    Utils.showToast('Something went wrong. Please refresh the page.', 'error');
  },

  handleUnhandledRejection: (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    Utils.showToast('Connection issue detected. Please check your internet.', 'warning');
  }
};

// App Initialization
const App = {
  init: async () => {
    try {
      console.log('🏖️ ShoreSquad initializing...');
      
      // Initialize core modules
      ErrorHandler.init();
      Navigation.init();
      Accessibility.init();
      Performance.init();
      
      // Initialize feature modules
      Community.init();
      Weather.init();
      Events.init();
      
      // Initialize map after other modules
      await MapModule.init();
      
      // Setup service worker for PWA functionality
      App.registerServiceWorker();
      
      console.log('✅ ShoreSquad initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize ShoreSquad:', error);
      Utils.showToast('App initialization failed. Please refresh the page.', 'error');
    }
  },

  registerServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

// Export for global access (useful for debugging and testing)
window.ShoreSquad = {
  AppState,
  Utils,
  Navigation,
  Weather,
  MapModule,
  Events,
  Community,
  App
};
