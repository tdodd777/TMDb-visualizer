# ShowGrid

A React application that visualizes TV series episode ratings as an interactive, color-coded heatmap using data from The Movie Database (TMDb) API.

![ShowGrid](https://via.placeholder.com/800x400/1f2937/ffffff?text=ShowGrid)

## Features

- 🔍 **Search TV Series** - Search for any TV show using TMDb's comprehensive database
- 📊 **Visual Heatmap** - See episode ratings at a glance with color-coded cells
- 💡 **Interactive Tooltips** - Hover over episodes for quick details
- 📱 **Responsive Design** - Works beautifully on mobile, tablet, and desktop
- ⚡ **Fast Performance** - Client-side caching for instant repeat visits
- ♿ **Accessible** - Keyboard navigation and screen reader support

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **API**: TMDb (The Movie Database)
- **Deployment**: Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDb API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd showgrid
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your TMDb credentials:
```env
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://netlify.com)
3. Add environment variables in site settings
4. Deploy!

## Color Scale

Episodes are color-coded based on their TMDb ratings:

- 🟦 **Teal** (9.0-10.0): Excellent
- 🟩 **Emerald** (8.0-8.9): Great
- 🟢 **Green** (7.0-7.9): Good
- 🟡 **Lime** (6.0-6.9): Average
- 🟡 **Yellow** (4.0-5.9): Below Average
- 🟠 **Orange** (0.0-3.9): Poor
- ⬜ **Gray**: No Rating

## Project Structure

```
src/
├── components/
│   ├── layout/         # Header, Footer, Layout
│   ├── search/         # SearchBar, SearchResults
│   ├── show/           # ShowMetadata
│   ├── heatmap/        # Heatmap, Grid, Cell, Tooltip, Legend
│   └── ui/             # Reusable UI components
├── services/
│   ├── tmdb.js         # TMDb API client
│   ├── cache.js        # LocalStorage caching
│   └── ratingProcessor.js  # Data transformation
├── utils/
│   ├── colorScale.js   # Rating color mapping
│   ├── formatters.js   # Date/number formatting
│   └── constants.js    # App constants
├── context/
│   └── AppContext.jsx  # Global state management
└── App.jsx             # Main app component
```

## Features in Detail

### Search & Discovery
- Real-time search with 500ms debouncing
- Search results cached for 1 hour
- Display show posters, titles, years, and ratings

### Heatmap Visualization
- Dynamic CSS Grid layout adapting to season/episode counts
- Color-coded cells based on episode ratings
- Season labels and episode numbers
- Responsive sizing (24px mobile → 40px desktop)

### Episode Details
- Hover tooltips with episode info
- Click to open modal with full details
- Episode stills, synopsis, air dates
- Rating and vote counts

### Performance
- Show data cached for 24 hours
- Parallel season fetching with Promise.all()
- React.memo optimization on episode cells
- Request rate limiting (100ms delay between API calls)

## Attribution

This product uses the TMDb API but is not endorsed or certified by TMDb.

<img src="/images/tmdb-logo.svg" alt="TMDb" width="100">

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Data provided by [The Movie Database (TMDb)](https://www.themoviedb.org/)
