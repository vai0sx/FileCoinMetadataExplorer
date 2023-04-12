import React, { useState } from 'react';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/search/${keyword}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
  };

  return (
    <div className="App">
      <h1>Filecoin Metadata Explorer (FME)</h1>
      <input
        type="text"
        placeholder="Search by keyword"
        value={keyword}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
      <div className="search-results">
        {searchResults.map((result, index) => (
          <div key={index} className="search-result">
            <h3>{result.metadata.title}</h3>
            <p>{result.metadata.description}</p>
            <p>Tipo de archivo: {result.metadata.type}</p>
            <p>Tamaño: {result.metadata.size} bytes</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

