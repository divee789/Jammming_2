import React from "react";
import "./App.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults.js";
import { Playlist } from "../Playlist/Playlist.js";
import Spotify from "../../util/Spotify.js";
import SpotifyPlaylist from "../spotifyPlaylist/spotifyPlaylist";
import PlaylistTracks from "../PlaylistTracks/PlaylistTracks";

class App extends React.Component {
  state = {
    searchResults: [],
    playlistName: "My Playlist",
    playlistTracks: [],
    spotifyList: [],
    selectedPlaylistTracks: [],
  };

  addTrack = (track) => {
    let tracks = this.state.playlistTracks;
    if (tracks.find((savedTracks) => savedTracks.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  };

  removeTrack = (track) => {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter((currentTrack) => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
  };

  updatePlaylistName = (name) => {
    this.setState({ playlistName: name });
  };

  savePlaylist = () => {
    const trackUris = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({ playlistName: "New Playlist", playlistTracks: [] });
    });
  };

  search = (term) => {
    Spotify.search(term).then((searchResults) => {
      this.setState({ searchResults: searchResults });
    });
  };

  selectPlaylist = (id) => {
    Spotify.getPlaylistTracks(id)
      .then((playlist) => {
        console.log("appJs select function", playlist);
        this.setState({
          selectedPlaylistTracks: playlist.items,
        });
      })
      .catch((err) => {
        return;
      });
    //retrive the tracks of selected playlist
    //update the state of the retrived playlist
  };

  componentWillMount = () => {
    Spotify.bringPlaylist()
      .then((list) => {
        this.setState({ spotifyList: list.items, loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false, error });
      });
  };

  render() {
    const { error, loading } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (loading) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h1>
            Ja<span className="highlight">mmm</span>ing
          </h1>
          <div className="App">
            <SearchBar onSearch={this.search} />
            <div className="App-playlist">
              <SearchResults
                onAdd={this.addTrack}
                searchResults={this.state.searchResults}
              />
              <Playlist
                playlistName={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
              <SpotifyPlaylist
                spotifyList={this.state.spotifyList}
                selectPlaylist={this.state.selectPlaylist}
                onSelect={this.selectPlaylist}
              />
              <PlaylistTracks
                selectedPlaylistTracks={this.state.selectedPlaylistTracks}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
