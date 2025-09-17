# apify-scraping-assignment

My assumption is that there are no network disturbances and the API’s availability is 100% and that there are no other anti-scraping measures implemented on the API’s side - these cases would need to be handled accordingly in real-world scenarios.

My other assumption is that minPrice parameter is inclusive, while maxPrice is exclusive, meaning if I call the API with price range 0-10 and then with 10-20 I won’t scrape any product multiple times (the ones that cost exactly 10 USD).

Also, I expect that when difference between minPrice and maxPrice is 1, the API will never respond with more than 1000 items.

I didn’t write any tests as they were not part of the requirements.