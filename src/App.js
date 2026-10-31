import './App.css';
import {useState, useEffect} from 'react';

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
    }
  };

function App() {

  const [currentPage, setCurrentPage] = useState(1);
  const [moviesInPage, setMoviesInPage] = useState([]);
  const [searchText, setSearchText] =useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [sortChoice, setSortChoice] = useState('');


  useEffect(() => {
    const populate = searchText.trim();

    let url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}`;
      if (populate !== ''){
          url =`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchText)}&page=${currentPage}`; 
      }
      fetch(url, options)
      .then(res => res.json())
      .then(res => {
        setMoviesInPage(res.results);
        setTotalPages(res.total_pages);
      })
     .catch(err => console.error(err));
  }, [currentPage, searchText]);

  const movies = [...moviesInPage];
  if (sortChoice ==='date-asc') movies.sort((a,b) => new Date(a.release_date) - new Date(b.release_date));
  if (sortChoice ==='date-desc') movies.sort((a,b) => new Date(b.release_date) - new Date(a.release_date));
  if (sortChoice === 'rating-asc') movies.sort((a,b) => a.vote_average - b.vote_average);
  if (sortChoice === 'rating-desc') movies.sort((a,b) => b.vote_average - a.vote_average);


  return (
    <div className="App">
      <div className="header-darkpurple">
          Movie Explorer
      </div>
      <div className="header-lightpurple">
          <div className="nav-links">
              <input id="search" type="search" placeholder="Search for a movie..." value={searchText} onChange={e => {setSearchText(e.target.value); setCurrentPage(1); }}/>
              <select id="sort" value={sortChoice} onChange={e => setSortChoice(e.target.value)}>
                  <option value="">Sort By</option>
                  <option value="date-asc">Release Date (Asc)</option>
                  <option value="date-desc">Release Date (Desc)</option>
                  <option value="rating-asc">Rating (Asc)</option>
                  <option value="rating-desc">Rating (Desc)</option>
              </select>
          </div>
      </div>

      <div className="movie-section">
          <div className="hover-cards" id="individual-cards">
            {movies.map(movie => (
              <div className="card" key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <h3>{movie.title}</h3>
                <p>Release Date: {movie.release_date}</p>
                <p>Rating: {movie.vote_average}</p>
              </div>
            ))}
          </div>
      </div>

      <div id="pagination">
          <button id="previous" onClick={() => {if (currentPage > 1) setCurrentPage(currentPage -1)}}>Previous</button>
          <p id="page-num">Page {currentPage} of {totalPages} </p>
          <button id="next" onClick={() => { if (currentPage < totalPages) setCurrentPage(currentPage +1);}}>Next</button>
      </div>
    </div>
  );
}

export default App;
