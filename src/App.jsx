import React, { PropTypes, Component } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import './App.css';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  startListening: PropTypes.func,
  stopListening: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
}

const options = {
  autoStart: false
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      artist: null,
      voice: false,
      tracks: []
    }
  }

  search() {
    console.log('this.state', this.state);
    const BASE_URL = 'https://api.spotify.com/v1/search?';
    let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
    const accessToken = 'BQD7lqR4YTwxT6G5a_-I9yaD-aG6CC6wJnUcYdeDrWe2X4AtKDXZyV4dchxy7oUjzILGU27hDWLm0CH3eueYA28aCaKwnP6yZTvJQEZHrr6aZB_iYBDtZyGb8nF_na0AK85Mu0GtvHM8rxuYjQE0XDjC98AXZNGy&refresh_token=AQAKHH-eNoI0UO6BLUPTpplTSDJ3cc7wTN534zKRw69QXUGn9XlZoYuKnTBNRH3ORtZD_65KYQUOGHuXS9kxONem_2EXDdYQYos-oUxmLAJ3mlkjLqBgd7Ny2YII3LfJgxo';
    const ALBUM_URL = 'https://api.spotify.com/v1/artists/';

    var myOptions = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      mode: 'cors',
      cache: 'default'
    };

    fetch(FETCH_URL, myOptions)
      .then(response => response.json())
      .then(json => {
        const artist = json.artists.items[0];
        console.log('artist', artist);
        this.setState({artist});
        FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`;


      // FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`;
      fetch(FETCH_URL, myOptions)
        .then(response => response.json())
        .then(json => {
          console.log('artist top tracks: ', json);
          const { tracks } = json;
          this.setState({tracks});
        });
      });
  }

  render() {

    const { transcript, browserSupportsSpeechRecognition, startListening, stopListening } = this.props
    if (!browserSupportsSpeechRecognition) {
      return null
    }

    return (
      <div className="App">
        <div className="App-title">Artist Master</div>
        <FormGroup>
          <InputGroup>
            <FormControl
              className="Text-input"
              type="text"
              value={this.state.query}
              placeholder="SEARCH AN ARTIST.."
              onChange={event => {this.setState({query: event.target.value})}}
              onKeyPress={event => {
                if(event.key === 'Enter') {
                  this.search()
                }
              }}
            />
            <InputGroup.Addon onClick={() => this.search()}>
              <Glyphicon glyph="search"></Glyphicon>
            </InputGroup.Addon>
            <InputGroup.Addon onClick={startListening} onDoubleClick={stopListening}>Listen</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        {
          this.state.artist !== null
          ?
          <div>
            <Profile
              artist={this.state.artist}
            />
            <Gallery
              tracks={this.state.tracks}
            />
          </div>
          :
          <div></div>
        }

      </div>
    )
  }
}

App.propTypes = propTypes;
export default SpeechRecognition(options)(App);
// export default App;
