const clientId = '04a10a0493354780a549e80d2cfdd87b'; // Insert client ID here.
const redirectUri = 'https://tanna-spotify.surge.sh'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
// const redirectUri = 'http://localhost:3000'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken = "";


const Spotify = {
  getAccessToken() {
    // First check whether user has access token.
    // if accessToken exists, return.
    if (accessToken) {
      console.log("ACTIVATED");
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    // Second, check accessToken and if expiry is valid. Return.
    // otherwise send auth request to access app
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  // When search is performed in App.js
  // function search will be invoked with access token to make request
  // to perform search on Spotify
  search(term) {
    // first obtain Spotify accessToken
    const accessToken = Spotify.getAccessToken();
    // make a fetch request to Spotify's search api
    // pass in the accessToken of user for application (Bear Token)
    // the first then statement is a promise returned  after api request returns data
    // the second then statement is also promise that returns the track from previous promise
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers }
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name })
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackUris })
        });
      });
    });
  }
};

export default Spotify;
