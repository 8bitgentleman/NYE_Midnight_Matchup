# Midnight Matchup

Ring in the New Year with Perfect Timing - An interactive web app that helps you sync your movie watching with midnight on New Year's Eve.

## About

Midnight Matchup is a curated collection of movies and TV episodes with iconic midnight moments. Simply start watching at the exact time shown, and you'll experience a perfectly synchronized midnight moment to celebrate the new year!

## Features

- **Interactive Timeline**: Visual timeline showing all movie start times from 9 PM to midnight
- **Touch-Optimized**: Works great on both desktop and mobile/touch devices
- **Real-Time Updates**: See which movies you can still start watching based on the current time
- **Smart Filtering**: Filter by genre, mood, or search for specific titles
- **Two Views**: Switch between grid and timeline views
- **Countdown Timer**: Live countdown to midnight

## How to Use

1. Visit the site on New Year's Eve
2. Browse the available movies or use the search/filter options
3. Start your chosen movie at the exact time shown
4. Enjoy your perfectly timed midnight moment!

### Mobile Tips

- **Tap** markers on the timeline to see movie details
- **Swipe** through the movie cards
- Tooltips will automatically dismiss when you tap outside them

## Local Development

No build process required! Simply open `index.html` in your browser:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/midnight-matchup.git

# Open in your browser
open index.html
```

Or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve
```

Then visit `http://localhost:8000`

## Deployment to GitHub Pages

1. **Create a new repository** on GitHub
2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/midnight-matchup.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**
   - Your site will be live at `https://YOUR_USERNAME.github.io/midnight-matchup/`

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript** - No frameworks, just pure JS
- **Google Fonts** - Cormorant Garamond & Outfit

## Project Structure

```
midnight-matchup/
├── index.html              # Main HTML file
├── styles.css              # All styles and responsive design
├── script.js               # Interactive functionality
├── midnight_matchup_clean.csv  # Movie data
└── README.md               # This file
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

Have a movie with a great midnight moment? Feel free to open an issue or submit a pull request!

## License

This project is open source and available for personal use.

---

**Created with ✨ for New Year's Eve 2026**
