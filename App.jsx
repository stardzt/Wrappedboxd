import { useRef, useState } from 'react'
import './App.css'
import Papa from 'papaparse';
import TMDBPoster from './TMDBPoster';
import Modal from './Modal';
import html2canvas from 'html2canvas-pro';

function StarRating({ rating, max = 5 }) {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  return (
    <div className="flex justify-center text-green-600 text-md md:text-lg lg:text-lg xl:text-lg">
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
  const [isModalOpen, setModalOpen] = useState(false);

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

const handleDownload = async () => {
  const node = document.getElementById('capture');
  if (!node) {
    console.error("Element #capture not found.");
    return;
  }

  try {
    const canvas = await html2canvas(node, {
      backgroundColor: '#14171C', // Tailwind dark bg fallback
      useCORS: true,
      scale: 2 // Higher resolution
    });
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Wrappedboxd_${selectedMonth?.replace(' ', '_') || 'download'}.png`;
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};

  return (
    <>
      <h1 className='text-slate-300 font-bold'>Wrappedboxd<span className='px-1 text-sm'>v1.0</span></h1>
      <h3 className='mt-4 text-slate-500 mb-40'>by @dreamydxte</h3>
      {data.length === 0 && (
      <div>
        <p className='mb-4'>Add your <code>diary.csv</code> file from Letterboxd to get started. <a onClick={(e) => { e.preventDefault(); setModalOpen(true); }}className='text-sm'>(How to get <code>diary.csv</code>)</a></p>
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <ul className="list-decimal text-start text-sm mx-5">
              <li className='pl-2'>Navigate through your Letterboxd <a target="_blank" rel="noopener noreferrer" href='https://letterboxd.com/settings/'>account settings</a>.</li>
              <li className='pl-2'>Inside the 'data' tab, export your data.</li>
              <li className='pl-2'>Extract the <code>diary.csv</code> file inside the downloaded <code>.zip</code> file.</li>
          </ul>
        </Modal>
      </div>
      )}
      <div className="flex flex-wrap gap-4 items-center justify-center text-center">
        <div>
          <label htmlFor="file-upload" className="inline-flex items-center gap-1 px-2 py-1 mb-8 bg-green-600 hover:bg-green-700 cursor-pointer text-slate-200 tracking-widest text-sm uppercase shadow-sm font-bold rounded-sm transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add CSV
          </label>
          <input type="file" id="file-upload" accept=".csv" className="hidden" onChange={handleFileUpload}/> 
        </div>

        {Object.keys(moviesByMonth).length > 0 && (
          <div className="mb-8">
            <select
              className="font-bold text-sm uppercase p-1 bg-slate-600 hover:bg-slate-700 text-gray-300 tracking-widest rounded cursor-pointer shadow-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Object.keys(moviesByMonth).map((month) => (
                <option key={month} value={month} className="bg-slate-600 text-gray-300 capitalize">
                  {month}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {selectedMonth && (
          <button
            onClick={handleDownload}
            className="flex flex-wrap gap-2 items-center justify-center text-center px-3 py-1 mb-8 text-sm font-bold tracking-widest uppercase bg-slate-600 hover:bg-slate-700 text-gray-300 rounded-sm shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>

            Export
          </button>
        )}
      </div>
      {selectedMonth && (
        <div id="capture" className='p-4'>
          <div className="flex">
            <h2 className="text-start text-3xl mb-2 text-slate-300 font-bold uppercase">
              {selectedMonth}
            </h2>
            <p className="text-sm text-gray-600 ml-auto mt-2">{moviesByMonth[selectedMonth]?.length} {moviesByMonth[selectedMonth]?.length === 1 ? 'film' : 'films'}</p>
          </div>
          <div className="border-b border-gray-700 mb-8"></div>        
          <div className="max-w-2xl grid grid-cols-4 gap-1.5 md:gap-2 lg:gap-2 xl:gap-2">
            {moviesByMonth[selectedMonth]?.map((movie, idx) => (
              <div key={idx} className="rounded shadow">
                <a href={movie['Letterboxd URI']} target="_blank" rel="noopener noreferrer">
                  <TMDBPoster 
                    title ={movie['Name']} year={movie['Year']?.slice(0, 4)}
                  />
                </a>
                <p className="text-slate-300 text-xs md:text-sm lg:text-sm xl:text-sm font-semibold line-clamp-2">{movie['Name']}</p>
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
        </div>
      )}
    </>
  )
}

export default App
