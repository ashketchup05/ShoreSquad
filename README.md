﻿# ðŸ–ï¸ ShoreSquad - Beach Cleanup Community

> Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

## ðŸŒŠ About ShoreSquad

ShoreSquad is a modern web application that mobilizes young people to clean beaches by combining weather tracking, interactive maps, and social features to make environmental action fun and connected. Our platform helps users discover beach cleanup events, check weather conditions, and connect with like-minded ocean defenders.

## âœ¨ Features

### ðŸ—ºï¸ Interactive Map
- Real-time cleanup event locations
- User location detection
- Event status indicators (active, upcoming, completed)
- Interactive event details and sign-up

### ðŸŒ¤ï¸ Weather Dashboard
- Beach-specific weather conditions
- Cleanup suitability ratings
- Multi-day forecasts
- Location-based weather search

### ðŸ“… Event Management
- Discover nearby cleanup events
- Filter events by date, location, and type
- Join events with one click
- Share events with friends

### ðŸ‘¥ Community Features
- User profiles and achievements
- Cleanup statistics tracking
- Social sharing capabilities
- Gamification with badges and leaderboards

### ðŸ“± Progressive Web App (PWA)
- Installable on mobile and desktop
- Offline functionality
- Push notifications for new events
- Fast loading and smooth performance

## ðŸŽ¨ Design System

### Color Palette
- **Primary**: Ocean Blue (#006B96) - Trust, environmental consciousness
- **Secondary**: Sandy Beige (#F4E4BC) - Warmth, approachability
- **Accent**: Coral (#FF6B6B) - Energy, call-to-action
- **Success**: Sea Green (#20B2AA) - Eco-friendly actions
- **Neutral**: Soft Gray (#F8F9FA) - Clean, modern interface

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Responsive scaling**: 16px base with fluid typography
- **Accessibility**: High contrast ratios, readable font sizes

## ðŸš€ Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VS Code extension (recommended)
- Optional: Local HTTP server

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd shoresquad
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Start Live Server**
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - Or use the "Go Live" button in VS Code status bar

4. **Access the application**
   - Open `http://localhost:3000` (or your Live Server port)
   - The app will automatically reload when you make changes

### Alternative Setup (without VS Code)

1. **Using Python (if installed)**
   ```bash
   # Python 3
   python -m http.server 3000
   
   # Python 2
   python -S SimpleHTTPServer 3000
   ```

2. **Using Node.js (if installed)**
   ```bash
   npx http-server -p 3000
   ```

3. **Using any other HTTP server**
   - Serve the files from the project root
   - Ensure the server supports SPA routing for PWA functionality

## ðŸ“ Project Structure

```
shoresquad/
â”œâ”€â”€ index.html              # Main HTML5 document
â”œâ”€â”€ css/
â”‚   â””â”€â”€ styles.css           # Complete CSS with responsive design
â”œâ”€â”€ js/
â”‚   â””â”€â”€ app.js              # Main JavaScript application
â”œâ”€â”€ assets/                 # Images and icons (to be added)
â”‚   â”œâ”€â”€ icons/              # PWA icons
â”‚   â”œâ”€â”€ images/             # App images
â”‚   â””â”€â”€ screenshots/        # PWA screenshots
â”œâ”€â”€ .vscode/
â”‚   â””â”€â”€ settings.json       # Live Server configuration
â”œâ”€â”€ manifest.json           # PWA manifest
â”œâ”€â”€ sw.js                   # Service Worker for offline functionality
â”œâ”€â”€ .gitignore             # Git ignore rules
â””â”€â”€ README.md              # This file
```

## ðŸ› ï¸ Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties, Grid, Flexbox
- **Vanilla JavaScript**: ES6+ features, modular architecture
- **Leaflet.js**: Interactive maps
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Poppins)

### PWA Features
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: Installation and app-like experience
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized loading and interactions

### APIs (Demo Integration Ready)
- **OpenWeatherMap**: Weather data (API key required)
- **Geolocation API**: User location detection
- **Web Share API**: Native sharing capabilities
- **Push Notifications**: Event updates

## ðŸŒ Browser Support

- âœ… Chrome 80+
- âœ… Firefox 75+
- âœ… Safari 13+
- âœ… Edge 80+
- âœ… Mobile browsers (iOS Safari, Chrome Mobile)

## â™¿ Accessibility Features

- **WCAG 2.1 AA Compliance**: Color contrast, keyboard navigation
- **Screen Reader Support**: ARIA labels, semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects user preferences

## ðŸ”§ Customization

### Adding Real Weather Data
1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `demo-key` in `js/app.js` with your actual API key
3. Uncomment the actual API calls in the Weather module

### Adding Real Map Data
- The current implementation uses demo data
- Integrate with your backend API for real event data
- Update the `Events.loadEvents()` method

### Styling Customization
- Modify CSS custom properties in `:root` for theme changes
- All colors, spacing, and typography are defined as variables
- Responsive breakpoints can be adjusted in the CSS

## ðŸ“± PWA Installation

### Desktop
1. Open the app in Chrome/Edge
2. Look for the install prompt or
3. Click the install icon in the address bar

### Mobile
1. Open the app in mobile browser
2. Tap "Add to Home Screen" (iOS) or install prompt (Android)
3. The app will appear as a native app icon

## ðŸ§ª Testing

### Manual Testing Checklist
- [ ] Navigation works on mobile and desktop
- [ ] Map loads and shows demo events
- [ ] Weather search displays demo data
- [ ] Event filtering works correctly
- [ ] Form validation functions properly
- [ ] PWA can be installed
- [ ] Offline functionality works
- [ ] Accessibility features are functional

### Recommended Testing Tools
- Chrome DevTools (Lighthouse, Application tab)
- Firefox Developer Tools
- Accessibility testing with screen readers
- Mobile device testing (real devices or emulators)

## ðŸš€ Deployment

### Static Hosting (Recommended)
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repos
- **Firebase Hosting**: Google's hosting solution

### Deployment Steps
1. Build the project (if using a build process)
2. Upload all files to your hosting provider
3. Ensure HTTPS is enabled (required for PWA features)
4. Test PWA functionality on the live site

## ðŸ¤ Contributing

We welcome contributions to ShoreSquad! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and structure
- Test your changes across different browsers
- Ensure accessibility standards are maintained
- Update documentation as needed

## ðŸ“„ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ðŸŒŠ Environmental Impact

ShoreSquad is committed to environmental sustainability:
- Optimized code for reduced energy consumption
- Efficient caching to minimize data transfer
- Promoting real-world environmental action
- Green hosting recommendations

## ðŸ“ž Support

- ðŸ“§ Email: support@shoresquad.com
- ðŸ¦ Twitter: [@ShoreSquad](https://twitter.com/shoresquad)
- ðŸ“± Instagram: [@ShoreSquadApp](https://instagram.com/shoresquadapp)

## ðŸ™ Acknowledgments

- Ocean cleanup communities worldwide

### 📏 Units & Measurements
- All measurements use metric units (Celsius, km/h, meters, kilograms)
- Weather data displays temperatures in Celsius
- Wind speeds shown in kilometers per hour
- Wave heights measured in meters
- Cleanup statistics tracked in kilograms
