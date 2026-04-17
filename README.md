# Portfolio

This is a responsive portfolio website built with HTML, SCSS, Bootstrap, and Font Awesome.

## Features

- Responsive design
- Dark theme
- Animated elements
- Modal for work details
- Customizable via SCSS variables

## Customization

### Colors

Edit the variables in `scss/main.scss`:

```scss
$primary-color: #a78bfa;    // Purple
$secondary-color: #34d399;  // Green
$tertiary-color: #fb923c;   // Orange
$quaternary-color: #f472b6; // Pink
$quinary-color: #60a5fa;    // Blue

$bg-dark: #0a0a0a;          // Background
$bg-card: #111;             // Card background
$border-color: #1a1a1a;     // Borders
$text-light: #fff;          // Light text
$text-muted: #666;          // Muted text
$text-dark: #333;           // Dark text
```

### Content

Edit `index.html` to change:

- Hero text and buttons
- About section content
- Skills (update percentages and colors)
- Works (add/remove projects)
- Contact links

### Building

SCSS is compiled to CSS automatically with:

```bash
npm run sass
```

This runs Sass in watch mode, so changes to `scss/main.scss` will automatically update `css/main.css`.

## Deployment

This is set up for GitHub Pages. Push to your repository and enable Pages in settings.

## Technologies

- HTML5
- SCSS
- Bootstrap 5
- Font Awesome 6
- JavaScript (vanilla)