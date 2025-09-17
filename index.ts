import {ProductScraperDriver} from "./lib/ProductScraperDriver.js";

try {
    const scraper = new ProductScraperDriver({
        initialPriceRangeDistance: 100,
        increasePriceRangeDistanceBy: 100,
        desiredProductCountPerApiCall: 500,
    });
    const products = await scraper.fetchAllProducts();

    console.log("Scraping finished:", products);
    console.log("Total products scraped:", products.length);
} catch (e) {
    console.log("Scraping failed:", e);
}