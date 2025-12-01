# TMDb API Documentation

## Overview

This application uses The Movie Database (TMDb) API to fetch TV show and episode data.

## Authentication

API Key is stored in environment variables:
```env
VITE_TMDB_API_KEY=your_api_key_here
```

All requests include the API key as a query parameter.

## Endpoints Used

### 1. Search TV Shows

**Endpoint**: `GET /search/tv`

**Parameters**:
- `api_key` (required): Your API key
- `query` (required): Search term
- `page` (optional): Page number (default: 1)

**Response**:
```json
{
  "page": 1,
  "results": [
    {
      "id": 1396,
      "name": "Breaking Bad",
      "first_air_date": "2008-01-20",
      "poster_path": "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      "vote_average": 8.9
    }
  ],
  "total_pages": 1,
  "total_results": 1
}
```

### 2. Get TV Show Details

**Endpoint**: `GET /tv/{tv_id}`

**Parameters**:
- `api_key` (required): Your API key

**Response**:
```json
{
  "id": 1396,
  "name": "Breaking Bad",
  "overview": "...",
  "first_air_date": "2008-01-20",
  "number_of_seasons": 5,
  "number_of_episodes": 62,
  "poster_path": "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
  "vote_average": 8.9,
  "genres": [...],
  "networks": [...]
}
```

### 3. Get Season Details

**Endpoint**: `GET /tv/{tv_id}/season/{season_number}`

**Parameters**:
- `api_key` (required): Your API key

**Response**:
```json
{
  "id": 3572,
  "air_date": "2008-01-20",
  "name": "Season 1",
  "overview": "...",
  "season_number": 1,
  "episodes": [
    {
      "air_date": "2008-01-20",
      "episode_number": 1,
      "id": 62085,
      "name": "Pilot",
      "overview": "...",
      "vote_average": 7.7,
      "vote_count": 153,
      "still_path": "/..."
    }
  ]
}
```

### 4. Get Episode Details

**Endpoint**: `GET /tv/{tv_id}/season/{season_number}/episode/{episode_number}`

**Parameters**:
- `api_key` (required): Your API key

**Response**:
```json
{
  "air_date": "2008-01-20",
  "episode_number": 1,
  "name": "Pilot",
  "overview": "...",
  "id": 62085,
  "season_number": 1,
  "still_path": "/...",
  "vote_average": 7.7,
  "vote_count": 153,
  "crew": [...],
  "guest_stars": [...]
}
```

## Image URLs

Images are hosted on TMDb's CDN. Base URL:
```
https://image.tmdb.org/t/p/{size}{path}
```

**Poster Sizes**:
- `w185` - Small
- `w342` - Medium
- `w500` - Large (recommended)
- `w780` - Extra Large
- `original` - Full resolution

**Still Sizes** (Episode images):
- `w185` - Small
- `w300` - Medium (recommended)
- `w500` - Large
- `original` - Full resolution

**Example**:
```javascript
const posterUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
```

## Rate Limiting

**Limit**: 40 requests per 10 seconds

**Implementation**:
- 100ms delay between requests
- Request queuing system
- Automatic retry on rate limit errors

**Caching Strategy**:
- Search results: 1 hour TTL
- Show details: 24 hours TTL
- Season data: 24 hours TTL

## Error Handling

**Common Status Codes**:
- `200` - Success
- `401` - Invalid API key
- `404` - Resource not found
- `429` - Rate limit exceeded

**Error Response**:
```json
{
  "status_code": 7,
  "status_message": "Invalid API key: You must be granted a valid key.",
  "success": false
}
```

## Best Practices

1. **Always cache responses** - Reduces API calls and improves performance
2. **Respect rate limits** - Use delays between requests
3. **Handle errors gracefully** - Show user-friendly messages
4. **Use appropriate image sizes** - Don't load `original` when `w500` is enough
5. **Parallel requests** - Fetch multiple seasons simultaneously with `Promise.all()`

## Code Examples

### Search Shows
```javascript
const searchShows = async (query) => {
  const response = await axios.get('/search/tv', {
    params: { api_key: API_KEY, query }
  });
  return response.data;
};
```

### Get All Seasons
```javascript
const getAllSeasons = async (tvId, totalSeasons) => {
  const promises = Array.from({ length: totalSeasons }, (_, i) =>
    getSeasonDetails(tvId, i + 1)
  );
  return Promise.all(promises);
};
```

### Build Image URL
```javascript
const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
```

## Resources

- **Official Docs**: https://developer.themoviedb.org/docs
- **API Reference**: https://developer.themoviedb.org/reference/intro/getting-started
- **Authentication**: https://developer.themoviedb.org/docs/authentication-application
- **Images**: https://developer.themoviedb.org/docs/image-basics
- **Status Codes**: https://developer.themoviedb.org/reference/intro/errors

## Attribution Requirements

TMDb requires attribution when using their API:

1. Display "This product uses the TMDb API but is not endorsed or certified by TMDb"
2. Use their official logo (blue version)
3. Link back to themoviedb.org
4. See: https://www.themoviedb.org/about/logos-attribution

**Already implemented** in Footer component ✅
