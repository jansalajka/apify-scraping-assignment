import {Product, ProductScraper} from "./ProductScraper.js";

interface ProductScraperAccumulatorConfig {
    initialPriceRangeDistance: number;
    increasePriceRangeDistanceBy: number;
    desiredProductCountPerApiCall: number;
}

const DEFAULT_CONFIG: ProductScraperAccumulatorConfig = {
    initialPriceRangeDistance: 10,
    increasePriceRangeDistanceBy: 10,
    desiredProductCountPerApiCall: 100,
};

/**
 * Accumulates products from the API.
 */
export class ProductScraperDriver {
    private readonly MAXIMUM_PRICE = 100000;
    private readonly scraper: ProductScraper;
    private readonly config: ProductScraperAccumulatorConfig;
    private products: Product[] = [];

    public constructor(config?: Partial<ProductScraperAccumulatorConfig>) {
        const mergedConfig = {
            ...DEFAULT_CONFIG,
            ...config
        };

        this.validateConfigOrThrow(mergedConfig);

        this.scraper = new ProductScraper();
        this.config = mergedConfig;
    }

    /**
     * Fetches all products from the API.
     * @throws {Error} If fetching products fails.
     */
    public async fetchAllProducts(): Promise<Product[]> {
        let minPrice = 0;
        let maxPrice = this.config.initialPriceRangeDistance;
        let priceRangeDistance = this.config.initialPriceRangeDistance;

        const { total } = await this.scraper.fetchProducts();

        while (true) {
            const response = await this.scraper.fetchProductsInPriceRange(minPrice, maxPrice);

            if (response.total > response.count) {
                // we are querying too many products, we need to narrow the price range and try again
                priceRangeDistance -= 1;
                maxPrice = minPrice + priceRangeDistance;

                if (priceRangeDistance < 1) {
                    throw new Error("Cannot narrow price range distance any further.");
                }

                continue;
            }

            this.products = [
                ... this.products,
                ... response.products,
            ];

            if (this.products.length >= total || maxPrice > this.MAXIMUM_PRICE) {
                break;
            }

            priceRangeDistance = this.calculatePriceRangeDistance(priceRangeDistance, response.count);
            minPrice = maxPrice;
            maxPrice += priceRangeDistance;
        }

        return this.products;
    }

    /**
     * Calculates the next price range distance based on the current distance and the number of products fetched.
     * --- This logic comes from an idea that the wider the price range, the more products we fetch.
     * --- So we start with a small range distance and increase it until we reach the desired product count per response.
     * --- NOTE: the fake API doesn't take this into account and always returns a random number of products.
     * @param currentDistance
     * @param productCount
     * @private
     */
    private calculatePriceRangeDistance(
        currentDistance: number,
        productCount: number,
    ): number {
        if (productCount > this.config.desiredProductCountPerApiCall) {
            // we need to decrease the distance as we are getting enough products
            const adjustedStepsLength = currentDistance - this.config.increasePriceRangeDistanceBy;

            if (adjustedStepsLength > 1) {
                return adjustedStepsLength;
            }

            return currentDistance;
        }

        // we can increase the distance as we are not getting enough products
        return currentDistance + this.config.increasePriceRangeDistanceBy;
    }

    /**
     * Validates the config and throws an error if it is invalid.
     * @param config
     * @private
     */
    private validateConfigOrThrow(config: ProductScraperAccumulatorConfig): void {
        if (config.initialPriceRangeDistance < 1) {
            throw new Error("Default steps must be greater than 0");
        }

        if (config.increasePriceRangeDistanceBy < 0) {
            throw new Error("Increase steps by must be greater than 0 or equal");
        }

        if (config.desiredProductCountPerApiCall < 1) {
            throw new Error("Desired product count per API call must be greater than 0");
        }
    }
}