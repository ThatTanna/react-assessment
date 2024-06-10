import './App.css';
import { useState, useEffect } from 'react';
import SearchBar from '../components/searchbar/SearchBar.jsx';
import SearchResults from '../components/searchresults/SearchResults.jsx';
import Playlist from '../components/playlist/Playlist.jsx';
import Spotify from '../utils/Spotify.js';

function App() {

  // create state hooks that manages the characteristics of our application
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("Create New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // at the start of this app component, provide default values for searchResults (lifecycle hook)
  useEffect(() => {

    const token = Spotify.getAccessToken();

    setSearchResults([
      {
        id: 1,
        name: "Track 1",
        artist: "Track 1 Artist",
        album: "Track 1 Album"
      },
      {
        id: 2,
        name: "Track 2",
        artist: "Track 2 Artist",
        album: "Track 2 Album"
      },
      {
        id: 3,
        name: "Track 3",
        artist: "Track 3 Artist",
        album: "Track 3 Album"
      },
    ]);
  }, []);

  // function addTrack will be passed to component SearchResults 
  function addTrack(track) {
    // check whether track passed in is found in state playlistTracks
    const existTrack = playlistTracks.find((currentTrack) => track.id === currentTrack.id);
    // store track is only track is NOT found in state playlistTracks
    if (!existTrack)
      setPlaylistTracks([track, ...playlistTracks]);

    return;
    // setPlaylistTracks.concat(track);
  }

  // function removeTrack will be passed to component PlayList
  function removeTrack(track) {
    // filter the playlistTracks to return only those that are not one of the tracks passed in
    const filteredTrack = playlistTracks.filter((currentTrack) => track.id !== currentTrack.id);
    // store the remaining / filtered tracks
    setPlaylistTracks(filteredTrack);
  }

  // function updatePlayListName stores a new play list name
  function updatePlayListName(name) {
    // store the name in playlistName
    setPlaylistName(name);
  }

  // function savePlaylist is to send searched playlist to Spotify
  // pass function to component Playlist
  function savePlaylist() {
    const trackURIs = playlistTracks.map((track) => track.uri);
    console.log(trackURIs);

    // Once Spotify has captured the new playlist, we reset playlistName and playlistTracks
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      updatePlayListName("Create New Playlist");
      setPlaylistTracks([]);
    });
    // Spotify.savePlaylist(playlistName, playlistTracks)
  }

  // function search calls Spotify API search request in Spotify.js
  // which return the results and later stored in state searchResults
  function search(term) {
    Spotify.search(term).then((result) => setSearchResults(result));
  }

  console.log(playlistName);

  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        {/* <!-- Add a SearchBar component --> */}
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          {/* <!-- Add a SearchResults component --> */}
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          {/* <!-- Add a Playlist component --> */}
          <Playlist onSave={savePlaylist} playlistName={playlistName} playlistTracks={playlistTracks} onRemove={removeTrack} onNameChange={updatePlayListName} />
        </div>
      </div>
    </div>
  );
}

export default App;
