//This Headline list is used for the filter of the headlines based on the years
import { useEffect, useState } from 'react';


/**
 * This Component displays headlines filtered by a specific 
 * year that you want to look at mainly 2018-19-20
 * @param {string} year - This must be a four digit to filter headlines by year 
 * @returns 
 */
export default function HeadlineList({ year }) {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchHeadlines = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/headlines');
        if (!res.ok) throw new Error('Failed to fetch headlines');
        const data = await res.json();
        
        //Just in case its a little complicated with the regex
        //This regex pattern just works as followed it gets digites from 0-9
        //gets it {4} times
        //Has to match exactly 4 digits
        const filetered = data.filter(desired => {
          const desiredYear = desired.Time.match(/\d{4}/)[0];
          return desiredYear === year;
        });
        setHeadlines(filetered);
      } catch (err) {
        console.error('Error fetching headlines:', err);
        setError(err.message || 'Failed to load headlines');
      } finally {
        setLoading(false);
      }
    };

    if(year){
      fetchHeadlines();
    } 
  }, [year]);

  if (loading) {
    return <div>Loading Headlines...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }
  return (
    <div>
      <h2>Headlines from {year}</h2>
      <ul>
        {headlines.map((headline, i) => 
          <li key={i}>
            <h3>{headline.Headlines}</h3>
            <p>{headline.Time}</p>
            <p>{headline.Description}</p>
            <p></p>
          </li>
        )}
      </ul>
    </div>
  );
}
