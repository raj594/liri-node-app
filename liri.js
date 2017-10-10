var twitterKeys = require("./keys.js");
var fs = require("fs");
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter')

var client = new Twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

if (process.argv[2] === "my-tweets") {
	if (process.argv[3]) {
		var screenName = process.argv[3];
	} else {
		var screenName = "robertsalias";
	}

	var params = {screen_name: screenName};

	tweets(params);

} else if (process.argv[2] === "spotify-this-song") {
	if (process.argv[3]) {
		var songName = process.argv[3];
	} else {
		var songName = "The Sign Ace of Base";
	}

	spotifyIt(songName);

} else if (process.argv[2] === "movie-this") {

	 if (process.argv[3]) {
	 	var movieName = process.argv[3];
	 } else {
		var movieName = "Mr. Nobody";
	 }
	movie(movieName);
} else if (process.argv[2] === "do-what-it-says") {

	fs.readFile("random.txt", "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }

	  // Then split it by commas (to make it more readable)
	  var dataArr = data.split(",");

	  if(dataArr[0] === "my-tweets"){
	  	if (dataArr[1]){
	  		var screenName = dataArr[1];
	  	} else {
	  		var screenName = "robertsalias";
	  	}
	  	tweets(screenName);

	  } else if (dataArr[0] === "movie-this") {
	  	if (dataArr[1]){
	  		var movieName = dataArr[1];
	  	} else {
	  		var movieName = "Mr. Nobody";
	  	}
	  	movie(movieName);

	  } else if (dataArr[0] === "spotify-this-song") {
	  	if (dataArr[1]){
	  		var songName = dataArr[1];
	  	} else {
	  		var songName = "The Sign Ace of Base";
	  	}
	  	
	  	spotifyIt(songName);

	  }

	});
}

function spotifyIt(songName) {
	var spotify = new Spotify({
		id: "66dcd2cd673b4829a6ebff2a6b44a63a",
		secret: "1d2d679dab804c5b838f6c43b0d2a41a"
	});
	spotify.search({ type: 'track', query: songName }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	    var song = data.tracks.items[0];
	    console.log("Song Name: " + song.name)
	    console.log("Artist: " + song.album.artists[0].name)
	    console.log("Album: " + song.album.name)
	    console.log("Preview: " + song.preview_url)
	    console.log("\n")

	 // for (var i = 0; i < data.tracks.items.length; i++) {

	 // 	var song = data.tracks.items[i];
	 //    console.log("Song Name: " + song.name)
	 //    console.log("Artist: " + song.album.artists[0].name)
	 //    console.log("Album: " + song.album.name)
	 //    console.log("Preview: " + song.preview_url)

	 // 	// console.log(JSON.stringify(data.tracks.items[i].album.artists[0].name));
	 // 	// console.log(JSON.stringify(data.tracks.items[i].album.name));
	 // 	// console.log(JSON.stringify(data.tracks.items[i].preview_url));
	 // 	console.log("\n")
	 // }

	});

};

function movie(movieName) {

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName.replace(/ /g, "+") + "&y=&plot=short&apikey=40e9cece";
	console.log(queryUrl)
	request(queryUrl, function(error, response, body) {
		if(!error && response.statusCode === 200){

			console.log("Title: " + JSON.parse(body).Title);
			console.log("Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
			console.log("Rotten Tomatos Rating: " + JSON.parse(body).Ratings[1].Value);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("\n")
		}
	});
};

function tweets(params) {
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	for (var i = 0; i < tweets.length; i++) {
	  		console.log("Tweet #: " + (i+1))
	  		console.log("Tweet Date: " + tweets[i].created_at);
	  		console.log("Tweet text: " + tweets[i].text);
	  		console.log("Tweeter: " + tweets[i].user.screen_name);
	  		console.log("\n");
	  	}
	  }
	});
};