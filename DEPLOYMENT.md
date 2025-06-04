# 🚀 ShoreSquad Deployment Guide

## Quick Start with Live Server (Development)

1. **Install Live Server Extension in VS Code**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

2. **Start the Development Server**
   - Open the project folder in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Or click "Go Live" in the status bar

3. **Access Your App**
   - Open `http://localhost:3000` (or the port shown)
   - The app will auto-reload when you make changes

## Production Deployment Options

### Option 1: Netlify (Recommended for Beginners)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder to deploy
3. Your site will be live instantly with HTTPS
4. Custom domain available

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts
4. Automatic deployments from Git

### Option 3: GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `username.github.io/repository-name`

### Option 4: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init hosting`
3. Deploy with `firebase deploy`

## PWA Requirements for Production

### Essential for PWA:
- ✅ HTTPS (required for service workers)
- ✅ Service worker registered
- ✅ Web app manifest
- ✅ Responsive design
- ✅ Fast loading (< 3 seconds)

### Testing PWA Features:
1. Open Chrome DevTools
2. Go to Application tab
3. Check Manifest and Service Workers sections
4. Run Lighthouse audit for PWA score

## Environment Configuration

### Weather API Setup (Optional):
1. Get API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `demo-key` in `js/app.js` line 12
3. Update the API calls in the Weather module

### Analytics Setup (Optional):
Add Google Analytics or similar to track usage:
```html
<!-- Add before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Performance Optimization Checklist

- [ ] Images optimized and compressed
- [ ] CSS and JS minified (for production)
- [ ] Enable gzip compression on server
- [ ] Set up proper caching headers
- [ ] Use CDN for static assets
- [ ] Implement lazy loading for images

## Security Headers (Production)

Add these headers to your hosting configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openweathermap.org;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self)
```

## Monitoring and Analytics

### Recommended Tools:
- **Lighthouse**: Performance and PWA auditing
- **Google Search Console**: SEO monitoring
- **Web Vitals**: Core performance metrics
- **Sentry**: Error tracking (optional)

### Key Metrics to Track:
- Page load speed
- PWA install rate
- User engagement
- Event signup conversions
- Weather search usage

## Troubleshooting Common Issues

### Service Worker Not Registering:
- Ensure HTTPS is enabled
- Check browser console for errors
- Verify service worker file path

### PWA Not Installable:
- Confirm manifest.json is valid
- Check all required PWA criteria
- Test on different browsers

### Map Not Loading:
- Check internet connection
- Verify Leaflet.js CDN availability
- Ensure geolocation permissions

### Weather Data Not Showing:
- Confirm API key is valid (if using real API)
- Check CORS settings
- Verify API endpoint accessibility

## Backup and Recovery

### Version Control:
- Use Git for code versioning
- Tag releases: `git tag v1.0.0`
- Keep deployment history

### Data Backup:
- Export user data regularly (if storing any)
- Document configuration settings
- Keep environment variables secure

## Domain and SSL Setup

### Custom Domain:
1. Purchase domain from registrar
2. Configure DNS to point to your hosting
3. Enable SSL certificate (usually automatic)

### SSL Certificate:
- Most hosting providers offer free SSL
- Let's Encrypt provides free certificates
- Ensure auto-renewal is enabled

---

**Ready to deploy your ShoreSquad app?** 🌊

Choose your deployment method and make ocean conservation accessible to everyone!
