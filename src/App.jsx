import { useState } from 'react'
import './App.css'
import Papa from 'papaparse';

function StarRating({ rating, max = 5 }) {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  return (
    <div className="flex justify-center text-green-600">
      {[...Array(filledStars)].map((_, i) => (
        <span key={i}>★</span>
      ))}
      {hasHalfStar && <span>½</span>}

    </div>
  );
}  

function App() {
  const [data, setData] = useState([]);
  const [moviesByMonth, setMoviesByMonth] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const movies = results.data;
        setData(movies);

        const grouped = {};

        movies.forEach((movie) => {
          const date = new Date(movie['Watched Date']);
          if (isNaN(date)) return;

          const key = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g., "January 2025"

          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(movie);
        });

        setMoviesByMonth(grouped);

        // Set default to latest month
        const months = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
        if (months.length > 0) setSelectedMonth(months[0]);
      }
    });
  };


  return (
    <>
      {data.length === 0 && (
      <p>Add your <code>diary.csv</code> file from Letterboxd to get started. <a className='text-sm'>(How to get <code>diary.csv</code>)</a></p>
      )}
      <div>
        <label htmlFor="file-upload" className="inline-flex items-center gap-1 px-2 py-1 mt-2 mb-8 bg-green-600 hover:bg-green-700 cursor-pointer text-white text-sm uppercase font-bold rounded-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add
        </label>
        <input type="file" id="file-upload" accept=".csv" className="hidden" onChange={handleFileUpload}/> 
      </div>

      {Object.keys(moviesByMonth).length > 0 && (
        <div className="mb-6">
          <select
            className="font-bold text-sm uppercase p-1 bg-green-600 text-white rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Object.keys(moviesByMonth).map((month) => (
              <option key={month} value={month} className="bg-slate-500 text-white">
                {month}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedMonth && (
        <>
          <h2 className="text-start mb-8 text-3xl font-bold uppercase">
            {selectedMonth}
          </h2>        
          <div className="max-w-2xl grid grid-cols-4 gap-4">
            {moviesByMonth[selectedMonth]?.map((movie, idx) => (
              <div key={idx} className="rounded shadow">
                <a href={movie['Letterboxd URI']} target="_blank" rel="noopener noreferrer">
                  <img
                    title ={movie['Name']}
                    src="https://placehold.co/40x60"
                    alt={movie['Name']}
                    className="w-full max-w-[160px] aspect-[2/3] mb-2 object-cover hover:border-2 cursor-pointer border-green-600 rounded-sm transition-transform duration-300"
                  />
                </a>
                <p className="text-sm font-semibold">{movie['Name']}</p>
                <p>
                  {movie.Rating ? (
                    <StarRating rating={parseFloat(movie.Rating)} />
                  ) : (
                    <p className="text-sm text-gray-400">No rating</p>
                  )}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default App
