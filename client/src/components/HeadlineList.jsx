//This Headline list is used for the filter of the headlines based on the years
import { useEffect, useState } from 'react';

export default function HeadlineList({ year }) {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await fetch('/api/headlines');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        //Just in case its a little complicated with the regex
        //This regex pattern just works as followed it gets digites from 0-9
        //gets it {4} times
        //Has to match exactly 4 digits
        const filetered = data.filter(desired => {
          const desiredYear = desired.Time.match(/\d{4}/)[0];
          return desiredYear === year;
        })
        setHeadlines(filetered);
      } catch (err) {
        console.error('Error fetching headlines:', err);
      } finally {
        setLoading(false);
      }
    };

   if(year){
    fetchHeadlines();
   } 
  }, [year]);

  return (
    <div>
      <h2>Headlines from {year}</h2>
      <ul>
        {headlines.map((headline, i) => 
          <li key={i}>{JSON.stringify(headline)}</li>
        )}
      </ul>
    </div>
  );
}
