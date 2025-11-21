// Component: NewsFeed
// Purpose: Shows news headlines relevant to a selected stock/ETF.
// Will search through each headline for a specific word
import { useEffect, useState } from 'react';
export default function NewsFeed() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchHeadlines = async () => {
      setLoading(true);
      setError(null);

      try {
        let url; 
        if(selectedFile === 'all') {
          url = '/api/headlines';
        }else{
          url = `/api/headlines/${selectedFile}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch headlines');
        const data = await res.json();
        
        setHeadlines(data);
      } catch (err) {
        console.error('Error fetching headlines:', err);
        setError(err.message || 'Failed to load headlines');
      } finally {
        setLoading(false);
      }
    };
    fetchHeadlines();
  }, [selectedFile]);

  if (loading) {
    return <div>Loading Headlines...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  const filtered = headlines.filter(desired => {
    if (!searchText) return true;
    const word = searchText.toLowerCase();
    return (
      desired.Headlines.toLowerCase().includes(word) ||
      desired.Description.toLowerCase().includes(word)
    );
  });

  return <div>
    <div>
      <label>Source: </label>
      <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)}>
        <option value="all"> All Sources</option>
        <option value="cnbc_headlines"> CNBC</option>
        <option value="reuters_headlines">Reuters</option>
      </select>
    </div>

    <div>
      <label>Search: </label>
      <input
        type="text"
        placeholder="Search Headlines"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
    <div>
      <ul>
        {filtered.map((headline, i) => 
          <li key={i}>
            <h3>{headline.Headlines}</h3>
            <p><small>{headline.Time}</small></p>
            <p>{headline.Description}</p>
            <p><em>Source: {headline.fileName}</em></p>
          </li>
        )}
      </ul>
    </div>
  </div>;

}
