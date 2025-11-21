// View: Home
// Purpose: Landing page with navigation to Stock Grid, ETF Grid, comparisons, etc.
import { useState } from 'react';
import './NewsPage.css';
import HeadlineList from '../components/headline/HeadlineList';
import NewsFeed from '../components/headline/NewsFeed';


/**
 * NewsPage component that provides two ways to search through all the headlines
 * There is either Year or Word search
 * @returns {JSX.Element} Page with years and word filter search for headlines
 */
export default function NewsPage() {
  const [yearInput, setYearInput] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [error, setError] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (yearInput.match(/^\d{4}$/)) {
      setSearchYear(yearInput);
      setError('');
    } else{
      setError('Enter a valid 4 number year');
    }
  };
  return (
    <div className="seperator-container">
      <div className="seperator-box">
        <h2>Headlines Search By Year </h2>
      
        <form onSubmit={handleSearch} >
          <label>Enter Year: </label>
          <input
            type="text"
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            placeholder="Enter Year"
            maxLength="4"
          
          />
          <button type="submit">
            Submit Search
          </button>
        </form>

        {error && <p>{error}</p>}

        {searchYear && <HeadlineList year={searchYear} />}

      </div>
      {/*This is the other part that is needed for headline  */}
      <div className="seperator-box">
        <h2>HeadLine Search By Word</h2>
        
        <NewsFeed />
      </div>
    </div>
  );
}

