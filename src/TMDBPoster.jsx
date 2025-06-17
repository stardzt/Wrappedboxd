// TMDBPoster.jsx
import { useEffect, useState } from 'react';

function TMDBPoster({ title, year }) {
  const [posterUrl, setPosterUrl] = useState(null);
  const TMDB_API_KEY = '2b2a7c69c8f7e4c992bd0f66bffbdf71'; // Replace with your TMDB API key

  useEffect(() => {
    const fetchPoster = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}${year ? `&year=${year}` : ''}`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0 && data.results[0].poster_path) {
          const path = data.results[0].poster_path;
          const originalUrl = `https://image.tmdb.org/t/p/w500${path}`;
          const proxyUrl = `https://wrappedboxd.up.railway.app/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
          const proxied = await fetch(proxyUrl);
          const base64Image = await proxied.text();
          setPosterUrl(base64Image);
        } else {
          setPosterUrl(null);
        }
      } catch (err) {
        console.error('TMDB fetch failed for:', title, err);
        setPosterUrl(null);
      }
    };

    fetchPoster();
  }, [title]);

  return (
    <img
      title={title}
      src={posterUrl || "https://placehold.co/160x240?text=No+Image"}
      alt={title}
      crossOrigin='anonymous'
      className="w-full max-w-[160px] aspect-[2/3] mb-2 object-cover transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-600 hover:ring-2 hover:ring-green-600 ring-offset-0 rounded-xs"
    />
  );
}

export default TMDBPoster;
