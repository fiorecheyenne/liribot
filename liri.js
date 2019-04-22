require("dotenv").config();

//for the keys
var keys = require("./keys");
var request = require("request");
const fs = require("fs");
const Spotify = require("node-spotify-api");
var todo = process.argv[2];
var param = process.argv[3];
const chalk = require("chalk");

const moment = require("moment");

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
    console.log(
      "Try again lil chicken McThuggit - try one of these - \n~~**~~**~*~*~*~\nconcert-this \nspotify-this-song\nmovie-this\ndo-what-it-says"
    );
}

//spotify this song
function spotify(param) {
  var spotify = new Spotify(keys.spotify);
  if (!param) {
    param = "The Sign";
  }
  spotify.search({ type: "track", query: param }, function(err, data) {
    if (err) {
      console.log(chalk.red("Error Occurred:" + err));
      return;
    } else {
      var songData = data.tracks.items;
      for (var i = 0; i < songData.length; i++) {
        console.log(
          chalk.greenBright.underline.bold("\n~*~*~*~*SONG INFO*~*~*~*~\n")
        );
        fs.appendFileSync("log.txt", "~*~*~*~*SONG INFO*~*~*~*~");
        console.log("Result #:" + i);
        fs.appendFileSync("log.txt", i + "\n");
        console.log(
          chalk.green.bold("Artist(s): ") + songData[i].artists[i].name
        );
        fs.appendFileSync(
          "log.txt",
          "artist(s): " + songData[i].artists[i].name + "\n"
        );
        console.log(chalk.green.bold("Song Name: ") + songData[i].name);
        fs.appendFileSync("log.txt", "song name: " + songData[i].name + "\n");
        console.log(chalk.green.bold("Preview: ") + songData[i].preview_url);
        fs.appendFileSync(
          "log.txt",
          "preview song: " + songData[i].preview_url + "\n"
        );
        console.log(chalk.green.bold("Album: ") + songData[i].album.name);
        fs.appendFileSync("log.txt", "album: " + songData[i].album.name + "\n");
        // console.log("\n~*~*~*~*~*~*~*~*~*~*~*~*~*\n");
      }
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
        console.log(chalk.magenta.bold("\n~*~*~*~*~*~*Event*~*~*~*~*~*~*~\n"));
        fs.appendFileSync("log.txt", "\n~*~*~*~*~*~*Event*~*~*~*~*~*~*~\n");

        console.log("Result #: " + i);
        fs.appendFileSync("log.txt", i + "\n");

        console.log(chalk.magenta("Date: ") + bandish[i].datetime);
        fs.appendFileSync("log.txt", "Date " + bandish[i].datetime);

        console.log(chalk.magenta("Where: ") + bandish[i].venue.city);
        fs.appendFileSync("log.txt", "Where: " + bandish[i].venue.city);

        console.log(chalk.magenta("Venue: ") + bandish[i].venue.name);
        fs.appendFileSync("log.txt", "Venue:" + bandish[i].venue.name);
      }
    } else {
      console.log(
        chalk.red.bold("oopsies :( Couldnt find anything for") + param
      );
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
      console.log(chalk.cyan.bold("\n~**~~*~**~Moooooobie Info~**~*~~**~\n"));
      fs.appendFileSync("log.txt", "\n~**~~*~**~Moooooobie Info~**~*~~**~\n");

      console.log(chalk.cyan.bold("Mooooobie: ") + JSON.parse(body).Title);
      fs.appendFileSync("log.txt", "Mooooobie: " + body.Title + "\n");

      console.log(chalk.cyan.bold("Year: ") + JSON.parse(body).Year);
      fs.appendFileSync("log.txt", "Year: " + body.Year + "\n");

      console.log(chalk.cyan.bold("IMDB rate: ") + JSON.parse(body).imdbRating);
      fs.appendFileSync("log.txt", "IMDB Rating: " + body.imdbRating + "\n");

      console.log(
        chalk.cyan.bold("To-Mah-TOES: ") + JSON.parse(body).Ratings[0].Value
      );
      // fs.appendFileSync(
      //   "log.txt",
      //   "Rotten Tomatoes Rating: " + body.Ratings[0].Value + "\n"
      // );

      console.log(chalk.cyan.bold("Country: ") + JSON.parse(body).Country);
      fs.appendFileSync("log.txt", "Country: " + body.Country + "\n");

      console.log(chalk.cyan.bold("Lang: ") + JSON.parse(body).Language);
      fs.appendFileSync("log.txt", "Lang: " + body.Language);
      console.log(chalk.cyan.bold("Plot: ") + JSON.parse(body).Pilot);
      fs.appendFileSync("log.txt", "Plot: " + body.Plot + "\n");

      console.log(chalk.cyan.bold("Actors: ") + JSON.parse(body).Actors);
      fs.appendFileSync("log.txt", "Actors: " + body.Actors + "\n");
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
