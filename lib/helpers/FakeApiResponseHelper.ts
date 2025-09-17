import {Product, ProductApiResponse} from "../ProductScraper.js";
import {NumberUtils} from "../utils/NumberUtils.js";

interface FakeApiResponseHelperConfig {
    totalProductCount: number;
    minItemsPerResponse: number;
    maxItemsPerResponse: number;
    minimumProductPrice: number;
    maximumProductPrice: number;
}

const DEFAULT_CONFIG: FakeApiResponseHelperConfig = {
    totalProductCount: 2542, // total number of products available on the API
    minItemsPerResponse: 0,
    maxItemsPerResponse: 1000,
    minimumProductPrice: 1,
    maximumProductPrice: 100000,
};

/**
 * Generates fake API responses for testing purposes.
 */
export class FakeApiResponseHelper {
    private readonly config: FakeApiResponseHelperConfig;
    private numberOfReturnedProducts = 0;

    /**
     * @param config
     */
    public constructor(config?: Partial<FakeApiResponseHelperConfig>) {
        this.config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }

    /**
     * Generates a fake product with a random price.
     * @param id
     * @param minPrice
     * @param maxPrice
     * @private
     */
    private generateProduct(id: number, minPrice: number, maxPrice: number): Product {
        const name = `Product ${this.numberOfReturnedProducts + id}`;
        const price = NumberUtils.getRandomNumber(minPrice, maxPrice);
        return {name, price};
    }

    /**
     * Generates a list of fake products.
     * @param count
     * @param minPrice
     * @param maxPrice
     * @private
     */
    private generateProductList(count: number, minPrice: number, maxPrice: number): Product[] {
        return Array.from({length: count}, (_, i) =>
            this.generateProduct(i + 1, minPrice, maxPrice)
        );
    }

    /**
     * Generates a fake API response (simulates /products endpoint)
     */
    public generateResponse(): ProductApiResponse {
        const total = this.config.totalProductCount;
        const count = this.config.maxItemsPerResponse;

        const products: Product[] = Array.from({length: count}, (_, i) =>
            this.generateProduct(
                i + 1,
                this.config.minimumProductPrice,
                this.config.maximumProductPrice
            )
        );

        return { total, count, products };
    }

    /**
     * Generates a fake API response (simulates /products?minPrice=XXX&maxPrice=YYY endpoint)
     * @param minPrice
     * @param maxPrice
     */
    public generatePriceRangeResponse(minPrice: number, maxPrice: number): ProductApiResponse {
        if (NumberUtils.getRandomNumber(0, 10) === 1) {
            return {
                total: this.config.maxItemsPerResponse + 100, // we simulate that there are more products than the API can return
                count: this.config.maxItemsPerResponse,
                products: this.generateProductList(this.config.maxItemsPerResponse, minPrice, maxPrice)
            };
        }

        const remainingCount = this.config.totalProductCount - this.numberOfReturnedProducts;
        const count = NumberUtils.getRandomNumber(
            this.config.minItemsPerResponse,
            this.config.maxItemsPerResponse > remainingCount ? remainingCount : this.config.maxItemsPerResponse
        );
        const total = count;
        const products: Product[] = this.generateProductList(count, minPrice, maxPrice);

        this.numberOfReturnedProducts += count;

        console.log("Scraped products:", products);

        return { total, count, products };
    }
}