import {ProductScraperDriver} from "./lib/ProductScraperDriver.js";

try {
    const scraper = new ProductScraperDriver({
        initialPriceDistance: 10,
        increasePriceDistanceBy: 100,
        desiredProductCountPerApiCall: 500,
    });
    const products = await scraper.fetchAllProducts();

    console.log("Scraping finished:", products);
    console.log("Total products scraped:", products.length);
} catch (e) {
    console.log("Scraping failed:", e);
}