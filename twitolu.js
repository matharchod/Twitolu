//Use PHP to get a list of tweets in JSON format
//Use the first word or phrase from the tweet as the category for that tweet
//Use the URL from the tweet as the link for its tile 
var Twitolu = (function () {

	//Create persistent storage for Tweets in a closure
	var Tweets = (function (input) {			
		var x;
		return function (input) {			
			if (!input) {
				return x;
			} else {
				x = input;
				return x;	
			}
		}
		
	})();
	
	var User = (function (input) {			
		var x = [];
		return function (input) {			
			if (!input) {
				return x;
			} else {
				x.push(input);
				return input;	
			}
		}
		
	})();
	
	//Make a synchronous call to get Tweets
	var getTweets = (function () {
				
		//Use AJAX to get the latest tweets
		$.ajax({
			url: "/Twitolu/tmhOAuth-master/tweets_json.php?count=200",
			type: "GET",
			dataType: "json",
			async: false,
			success: function(result){
			 	Tweets(result);	
			 	User(result[0].user);
			 	//console.log(result[0]);
			},
			error: function(err){
				console.log(err);
				alert("Error with JSON: " + err);
			}
		});
				
	})();
	
	//Create persistent storage for Recipients
	var Recipients = (function (input) {		
		
		//check for recipients in web storage	
		var x = JSON.parse( localStorage.getItem('TwitoluRecipients') );
		
		//if nothing in web storage, create empty object for storage
		if (x === null) {
			x = []; 
			localStorage.setItem('TwitoluRecipients', JSON.stringify(x) );
		}	
		
		return function (input) {		
			
			if (!input) {
				return x;
			} else {
				x.push(input);
				//set new archive contents
				localStorage.setItem('TwitoluRecipients', JSON.stringify(x) );
				return x;	
			}
		}
		
	})();
	
	//Create persistent storage for Favorites in a closure
	var Favorites = (function (input) {			
		var x = [];
		return function (input) {			
			if (!input) {
				return x;
			} else {
				x.push(input);
				return x;	
			}
		}
		
	})();
	
	var AddFavorites = function(tileID) {
		
	    var Faves = Favorites();
	    
	    Tiles.forEach(function(tile){
		    
	        if ( tile.ID == tileID ) {
	            //console.log(tile);
				tile.faveStatus = 'active';
				//console.log('add Fave:',tile);
				Twitolu.Favorites(tile);
	        }
	    });
	
		//console.log( 'Twitolu.Favorites:',Twitolu.Favorites() );
	};
	
	var RemoveFavorites = function(tileID) {
	    //var Tiles = Twitolu.Tweets();
	    var Faves = Twitolu.Favorites();
	    Tiles.forEach(function(tile){
	        if ( tile.ID == tileID ) {
		        tile.faveStatus = null;
	        }
	    });
	    Faves.forEach(function(tile){
	        if ( tile.ID == tileID ) {
				var tileIndex = Faves.indexOf(tile);				
				//console.log('tileIndex:',tileIndex);
				console.log('remove Fave at index: ' + tileIndex , tile.text);				
				var x = Faves.splice(tileIndex, 1);				
				tile.faveStatus = 'inactive';				
				return x;				
				//console.log( 'splice result:', x );
	        }
	    });
		//console.log( 'Twitolu.Favorites:',Twitolu.Favorites() );
	            
	};
					
	//Create a word cloud from the tags extracted from the Tweet text						
	var CloudFactory = function(Tweets) {
				
		var wordCloud = [],
			cloud = [],
			duplicate = cloud[0];
							
		for (i in Tweets) {		
				
			var x = Tweets[i].tag;	
			//console.log(x);	
					
			if (x === undefined || x.length >= 24) {
				//return an empty string
				//console.log('not a tag: ' + x);
			} else {
				//correct special characters
				cloud.push((x).replace(/&amp;/g,"&"));
			}									
		}
		
		cloud.sort();
				
		for (i in cloud) {			
			if (cloud[i] !== duplicate) {
				wordCloud.push(duplicate);
				//console.log('Duplicate : ' + duplicate);
			} 			
			duplicate = cloud[i];						
		}
		
		var counts = {};
		
		for (i in cloud) {
		  var num = cloud[i];
		  counts[num] = counts[num] ? counts[num] + 1 : 1;
		}
		
		function sortObject(obj) {
		    var arr = [];
		    for (var prop in obj) {
		        if (obj.hasOwnProperty(prop)) {
		            arr.push({
		                'tag': prop,
		                'count': obj[prop]
		            });
		        }
		    }
		    arr.sort(function(a, b) { return b.count - a.count; });
		    return arr; 
		}	
		
		var sortedList = sortObject(counts);
			
		//console.log('counts',counts);
		
		//console.log('sortedList',sortedList);
		
		//wordCloud = wordCloud.splice(1); //remove undefined tags						
		//console.log('wordCloud', wordCloud);				
		return sortedList;
		
	}
	
	
	//Use the Tweets to create tiles	
	var TileFactory = function (colors) {
				
		//Create place to collect tiles for future reference
		var TilesCollection = [],
			result = Tweets();
		
		for (i in result) {
			
			var fixSpecials = function(txt) {
				return (txt).replace(/&amp;/g,"&");//corrects ampersands
			}
			
			var Text_obj = fixSpecials(result[i].text);
				URL_obj = result[i].entities.urls[0],
				Tag_obj = fixSpecials(result[i].text.split('. ')[0]), //extract tag from text string
				RT_obj = result[i].retweeted, //retweet check
				Media_obj = result[i].entities.media;
						
			if (Media_obj) {
/*
				console.log('Media_obj',Media_obj[0].media_url_https);
				console.log(result[i]);
*/
			}	
			
			if (RT_obj === false) {
				RT_obj = null;
			}
			
			//REMOVE TAG AND RETWEET FROM TEXT
			var Text = function() {
				
				var text = Text_obj.split('http')[0]; //use display url to find link in text and remove it
				var text_notag = text.slice(Tag_obj.length + 2); //use tag object to remove it from the string
				
				if (RT_obj === true) {
					
					var text_noretweets = Text_obj.replace(/RT\s*@\S+/g, '');
					var text_cleaned = text_noretweets.split('http')[0];
					RT_obj = Text_obj.slice(0,Text_obj.indexOf(':'));
/*
					console.log('text_cleaned',text_cleaned);
					console.log('retweeter',RT_obj);
*/
					
					return text_cleaned;
					
				} else if (Tag_obj.length >= 24) {
					return text;
				} else {
					return text_notag;
				}

			}
			
			//IF A URL IS UNDEFINED
			var URL = function() {
				if (URL_obj === undefined) {
					//show the first URL found in the string
					return 'http' + Text_obj.split('http')[1];
				} else {
					//return the display url
					return URL_obj.url;
				}
			}
			
			//IF A TAG IS NOT PRESENT
			var Tag = function() {
				if (Tag_obj.length >= 24) {
					//return an empty string
					return;
				} else {
					//return the tag
					return Tag_obj;
				}
			}
									
			//Use the factory to create each tile
			var tile = {
				
				fullText: Text_obj,
				text: Text(),
				tag: Tag(),
				URL: URL(),
				ID: result[i].id_str,
				date: result[i].created_at,
				media: result[i].entities.media,
				popularity: result[i].favorite_count,
				retweet: RT_obj,
				tileStatus: 'active',
				faveStatus: null,
				sendStatus: null
	            
	        } 
			
			TilesCollection.push(tile);
					 
			//console.log( tilesCollection );

		}
		
		Tweets(TilesCollection);
// 		CloudFactory(TilesCollection);
		
		return Tweets();
						
		//console.log( "TilesCollection: ", TilesCollection ); 
		
	}
			
	//PUBLIC METHODS
	return {
		
		Tweets: Tweets,
		Favorites: Favorites,
		User: User,
		AddFavorites: AddFavorites,
		RemoveFavorites: RemoveFavorites,
		Recipients: Recipients,
		TileFactory: TileFactory,
		CloudFactory: CloudFactory
	
	}
	
})();





































          






