// Component: NewsFeed
// Purpose: Shows news headlines relevant to a selected stock/ETF.
// Will search through each headline for a specific word
import { useEffect, useState } from 'react';
export default function NewsFeed() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState('all');
  const [searchText, setSearchText] = useState('');

   useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        let url; 
        if(selectedFile === 'all') {
          url = '/api/headlines';
        }else{
         url = `/api/headlines/${selectedFile}`
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        
        setHeadlines(data);
      } catch (err) {
        console.error('Error fetching headlines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeadlines();
  }, [selectedFile]);

  const filtered = headlines.filter(desired => {
  if (!searchText) return true; 

  //This will make the word into lowercase so that it can search better
  const word = searchText.toLowerCase();
  return (
    desired.Headlines.toLowerCase().includes(word) ||
    desired.Description.toLowerCase().includes(word)
  );
  });

  return <div></div>;
}
