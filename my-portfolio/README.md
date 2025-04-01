# Setting up the Portfolio Project with Gemini AI Integration

## 1. Create a new React project
```bash
npx create-react-app my-portfolio
cd my-portfolio
```

## 2. Install necessary dependencies
```bash
npm install lucide-react pdfjs-dist gh-pages tailwindcss postcss autoprefixer
```

## 3. Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

## 4. Create the following configuration files:

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## 5. Update package.json
Add these lines to your package.json:

```json
"homepage": "https://yourusername.github.io/varun-portfolio",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

## 6. Create the src/index.js file
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 7. Place the resume PDF in the public directory
Create a folder structure in public:
```bash
mkdir -p public/assets
```

Place your resume PDF here:
```
public/assets/varun-resume.pdf
```

## 8. Replace src/App.js with the complete code

Copy the entire content from the "Complete Portfolio Website with Gemini AI Integration" code into src/App.js

## 9. Update the Gemini API key
Replace `YOUR_GEMINI_API_KEY_HERE` in the App.js file with your actual Gemini API key.

For production, create a .env file in the root directory:
```
REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key
```

Then use it in your code:
```javascript
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
```

## 10. Test the application locally
```bash
npm start
```

## 11. Deploy to GitHub Pages
```bash
git add .
git commit -m "Initial portfolio website with Gemini AI chat"
git remote add origin https://github.com/yourusername/varun-portfolio.git
git push -u origin main
npm run deploy
```

## 12. Configure GitHub Pages
- Go to your GitHub repository
- Click on "Settings"
- Navigate to "Pages" in the left sidebar
- For "Source", select the "gh-pages" branch
- Click "Save"

Your portfolio website should now be live at: https://yourusername.github.io/varun-portfolio