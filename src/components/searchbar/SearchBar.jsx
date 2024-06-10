import React, { useState } from 'react'
import "./SearchBar.css"
function SearchBar({ onSearch }) {

  // create a state to store what the user is searching for
  const [searchedTerm, setSearchTerm] = useState("");

  // function that passes the value from the input to onSearch
  function handleSearch(event) {
    event.preventDefault();
    event.stopPropagation();
    onSearch(searchedTerm);
  }

  // function that passes the value from the input to state called searchItem
  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="SearchBar">
      <input placeholder="Enter A Song, Album, or Artist" onChange={handleSearchChange} />
      <button className="SearchButton" onClick={handleSearch}>SEARCH INFO.</button>
    </div>
  )
}

export default SearchBar