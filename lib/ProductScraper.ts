import {FakeApiResponseHelper} from "./helpers/FakeApiResponseHelper.js";

export type Product = {
    name: string;
    price: number
};

export type ProductApiResponse = {
    total: number,
    count: number,
    products: Product[]
};

/**
 * Scrapes products from an API.
 */
export class ProductScraper {
    private readonly fetcher: FakeApiResponseHelper;
    private readonly API_URL = "https://api.ecommerce.com/products";

    constructor() {
        this.fetcher = new FakeApiResponseHelper();
    }

    /**
     * Fetches all products (maxItemsPerResponse limit applies).
     * --- In a real-world scenario, you would need to replace this implementation with a real API client like Axios.
     */
    public fetchProducts(): Promise<ProductApiResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.fetcher.generateResponse());
            }, 1000); // we are waiting for the API response
        });
    }

    /**
     * Fetches all products in a price range (maxItemsPerResponse limit applies).
     * --- In a real-world scenario, you would need to replace this implementation with a real API client like Axios.
     * @param minPrice
     * @param maxPrice
     */
    public fetchProductsInPriceRange(minPrice: number, maxPrice: number): Promise<ProductApiResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.fetcher.generatePriceRangeResponse(minPrice, maxPrice));
            }, 1000); // we are waiting for the API response
        });
    };
}