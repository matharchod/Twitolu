Twitolu
=======

Organize, visualize and socialize your Twitter feed.


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
* buildTweets()
* searchByTag()
* clearSearch()
* createWordCloud()
* toggleWordCloud()
* emailTweets()
* shareFavorites()
* toggleFavorites()
* showOnlyFavoirties()

## Helper Functions
* appInit()
* cloudInit()
* searchInit()
* showWordCloud()
* hideWordCloud()
* countCloudItems()
* buildTweetList()
* NEWchangeMeToRandomColor()