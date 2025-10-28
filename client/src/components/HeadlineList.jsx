import { useEffect, useState } from 'react';

export default function HeadlineList() {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await fetch('/api/headlines');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setHeadlines(data);
      } catch (err) {
        console.error('Error fetching headlines:', err);
      }
    };

    fetchHeadlines();
  }, []);

  return (
    <div>
      <h2>Headlines</h2>
      <ul>
        {headlines.map((headline, i) => 
          <li key={i}>{JSON.stringify(headline)}</li>
        )}
      </ul>
    </div>
  );
}
