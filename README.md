# Twitolu
### Organize, visualize and socialize your Twitter feed.
=======


I have used Twitter since it first became available to the public. 
I like the medium of microblogging to quickly create snippets of the cool things I see online every day.
However, there aren't many tools that allow me to look back through my tweet history to remind me what I was doing last week.

I use a period-delimited format to organize my tweets into categories.
Twitolu takes advantage of this format and creates an interactive word cloud that creates links based on these categories.
I can click on a category in the word cloud and see only the tweets that match those categories.
I can also group tweets into lists (Favorites) and share those lists via email.
This is valuable to me as a means of recalling important links as well as sharing those links with collegues.

## Functionality
* Retrieve my most recent tweets (maximum of 200) from Twitter
* Organize those tweets into categories
* Transform each tweet into a tile with controls for sharing its content
* Allow text searching of my most recent tweets 

## Main Functions
These functions represent the major aspects of the app. 

* buildTweets()
* searchByTag()
* createWordCloud()
* emailTweets()
* toggleFavorites()
* shareFavorites()

## Helper Functions
I use helper functions to give me more flexibility in the UI by allowing me to invoke functionality more granularly.

* appInit()
* cloudInit()
* searchInit()
* clearSearch()
* showWordCloud()
* hideWordCloud()
* toggleWordCloud()
* countCloudItems()
* buildTweetList()
* showOnlyFavoirties()
* NEWchangeMeToRandomColor()

## Descriptions

buildTweets()

```
buildTweets = function(tweetLink, tweetText, tweetTag){	
	var tweet = tweetText.replace(tweetLink,'');
	//console.log('tweetTag.length =', tweetTag.length);
	if (tweetTag.length >= 30) {
		tweetTag = '';
	} else {
		tweetTag = tweetTag;
	}
	$('#tweets .container').append('<li class="tweetItem">' 
		+ '<p>' + tweet + '</p><span>'
		+ '<div class="table">'
		+ '<a class="gotoTop" style="width:0px;">&uarr;</a>'
		+ '<a class="favoriteLink" style="width:0px;">&hearts;</a>'
		+ '<a class="shareLink">Send</a>'
		+ '<a class="tag">' + tweetTag + '</a>'
		+ '<a href="' + tweetLink + '" class="openTweet" style="width:50px;">' + tweetLink + '</a>' 
		+ '</div>'				
		+ '</span><span class="shade"></span></li>');		
}
```

searchByTag()
createWordCloud()
emailTweets()
toggleFavorites()
shareFavorites()

