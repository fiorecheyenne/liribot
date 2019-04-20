require("dotenv").config();

//for the keys
var keys = require("./keys");
var request = require("request");
const fs = require("fs");
const Spotify = require("node-spotify-api");
var todo = process.argv[2];
var param = process.argv[3];
const chalk = require("chalk");

// cases
switch (todo) {
  case "spotify-this-song":
    spotify(param);
    break;

  case "movie-this":
    movie(param);
    break;

  case "concert-this":
    band(param);
    break;

  case "do-what-it-says":
    dothething();
    break;
  default:
    console.log("Try again lil chicken McThuggit - that one is invalid");
}

//spotify this song
function spotify(param) {
  var spotify = new Spotify(keys.spotify);
  if (!param) {
    param = "The Sign";
  }
  spotify.search({ type: "track", query: param }, function(err, data) {
    if (err) {
      console.log("Error Occurred:" + err);
      return;
    } else {
      var songData = data.tracks.items;
      console.log("Artist(s): " + songData[0].artists[0].name);
      console.log("Song Name: " + songData[0].name);
      console.log("Preview: " + songData[0].preview_url);
      console.log("Album: " + songData[0].album.name);
    }
  });
}

// concert this
function band(param) {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    param +
    "/events?app_id=codingbootcamp";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var bandish = JSON.parse(body);
      for (var i = 0; i < bandish.length; i++) {
        console.log("~*~*~*~*~*~*Event*~*~*~*~*~*~*~");
        console.log(i);
        console.log("Venue: " + bandish[i].venue.name);
        console.log("Date: " + bandish[i].datetime);
        console.log("Where: " + bandish[i].venue.city);
        console.log("*~*~*~*~*~*~*~*~*~*~*");
      }
    } else {
      console.log("oopsies :(");
    }
  });
}

//movie this
function movie(param) {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + param + "&y=&plot=short&apikey=98f57855";

  request(queryUrl, function(error, response, body) {
    if (!param) {
      param = "Mr Nobody";
    }

    if (!error && response.statusCode === 200) {
      console.log("Mooooobie: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB rate: " + JSON.parse(body).imdbRating);
      console.log("To-Mah-TOES: " + JSON.parse(body).Ratings[1].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Plot: " + JSON.parse(body).Pilot);
      console.log("Actors: " + JSON.parse(body).Actors);
    }
  });
}

//do what it says
function dothething() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");

    if (dataArr[0] === "spotify-this-song") {
      var songadoo = dataArr[1].slice(1, -1);
      spotify(songadoo);
    } else if (data[0] === "band-this") {
      var bandyband = dataArr[1].slice(1, -1);
      band(bandyband);
    } else if (dataArr[0] === "movie-this") {
      var movie = dataArr[1].slice(1, -1);
      movie(movie);
    }
  });
}
