import React from "react";
import "./spotifyPlaylist.css";

class SpotifyPlaylist extends React.Component {
  componentDidMount() {
    console.log("yay", this.props.spotifyList);
  }
  render() {
    return (
      <div className="SpotifyPlaylist">
        <input defaultValue="Existing Playlist" />
        <div>
          {this.props.spotifyList.map((playlist) => (
            <p onClick={() => this.props.onSelect(playlist.id)}>
              {playlist.id}
            </p>
          ))}
        </div>
      </div>
    );
  }
}

export default SpotifyPlaylist;
