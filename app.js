require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get("/", (req, res) => res.render("index"));

app.get('/artist-search', (req, res, next) => {
  console.log(req.query.searchQuery)
  spotifyApi
      .searchArtists(req.query.searchQuery)
      .then(data => {
          console.log('The received data from the API: ', data.body.artists.items[0]);
          res.render('artists-search-results', { blah: data.body.artists.items });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
  .then(results => {
      res.render('albums', { albums: results.body.items });
  }).catch(err => {
      console.log({ err });
  });
});


app.get('/album/tracks/:albumId', (req, res, next) => {
  
  spotifyApi.getAlbumTracks(req.params.albumId)
  .then(results => {
      console.log({tracks: results.body.items})
      res.render('tracks', {tracks: results.body.items});
  }).catch(err => {
      console.log({err});
  })
});



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));