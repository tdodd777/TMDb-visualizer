# Setup Guide

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**

Create a `.env.local` file in the project root with your TMDb API credentials:
```env
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

**🔒 SECURITY WARNING**: Never commit your `.env.local` file or hardcode API keys in your codebase. The `.env.local` file is already included in `.gitignore` to prevent accidental commits. Get your API key from [TMDb API Settings](https://www.themoviedb.org/settings/api).

3. **Start Development Server**
```bash
npm run dev
```

4. **Open Browser**
Navigate to [http://localhost:5173](http://localhost:5173)

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Trying It Out

1. **Search for a TV Show**: Try searching for "Breaking Bad", "Succession", or "Game of Thrones"
2. **Click a Show**: Select a show from the search results
3. **View Heatmap**: See the color-coded episode ratings grid
4. **Hover Episodes**: Move your mouse over episodes to see tooltips
5. **Click Episodes**: Click any episode cell to see full details in a modal

## Features to Test

### Search
- Type at least 2 characters to trigger search
- Search is debounced (500ms delay)
- Results are cached for 1 hour
- Clear button appears when typing

### Heatmap
- Color scale: Orange (poor) → Yellow → Green → Teal (excellent)
- Gray cells = no rating data
- Hover for quick episode info
- Click for detailed episode modal

### Performance
- Show data cached for 24 hours (faster on repeat visits)
- Parallel season fetching (multiple API calls at once)
- Rate limiting prevents TMDb API errors

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `VITE_TMDB_API_KEY`
   - `VITE_TMDB_BASE_URL`
   - `VITE_TMDB_IMAGE_BASE_URL`
4. Deploy!

### Netlify

1. Push code to GitHub
2. Import project at [netlify.com](https://netlify.com)
3. Add environment variables in site settings
4. Deploy!

## Troubleshooting

### API Errors
- Verify your TMDb API key in `.env.local`
- Check you haven't exceeded TMDb rate limits (40 requests per 10 seconds)
- Ensure internet connection is active

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 18+)

### Performance Issues
- Clear browser cache and localStorage
- Disable browser extensions
- Check browser console for errors

## Project Structure

```
showgrid/
├── public/              # Static assets
│   └── images/          # TMDb logo
├── src/
│   ├── components/      # React components
│   ├── services/        # API & data services
│   ├── utils/           # Utilities
│   ├── context/         # State management
│   ├── App.jsx          # Main app
│   └── main.jsx         # Entry point
├── .env.local           # API credentials (gitignored)
├── .env.example         # Template
├── package.json         # Dependencies
├── vite.config.js       # Vite config
├── tailwind.config.js   # Tailwind config
└── vercel.json          # Deployment config
```

## API Information

This app uses the TMDb (The Movie Database) API:
- **Docs**: https://developer.themoviedb.org/docs
- **Rate Limit**: 40 requests per 10 seconds
- **Free Tier**: Sufficient for this application
- **Attribution**: Required (already included in footer)

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API key is correct
3. Ensure TMDb API is accessible
4. Review the README.md for more details

Enjoy exploring TV episode ratings! 🎬📊
