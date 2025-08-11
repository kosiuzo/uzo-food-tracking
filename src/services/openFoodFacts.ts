interface OpenFoodFactsProduct {
  code: string;
  product?: {
    product_name?: string;
    brands?: string;
    ingredients_text?: string;
    nutriments?: {
      'energy-kcal_100g'?: number;
      'proteins_100g'?: number;
      'carbohydrates_100g'?: number;
      'fat_100g'?: number;
      'fiber_100g'?: number;
      'sugars_100g'?: number;
      'sodium_100g'?: number;
      'salt_100g'?: number;
    };
    categories_tags?: string[];
    image_url?: string;
    serving_size?: string;
  };
  status: number;
  status_verbose: string;
}

interface OpenFoodFactsSearchResult {
  products: OpenFoodFactsProduct['product'][];
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  skip: number;
}

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface ProductInfo {
  name: string;
  brand?: string;
  nutrition: NutritionData;
  ingredients?: string;
  categories?: string[];
  imageUrl?: string;
  servingSize?: string;
}

export class OpenFoodFactsService {
  private readonly baseUrl: string;
  private readonly userAgent: string;
  private readonly cache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTimeout = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.baseUrl = import.meta.env.VITE_OPENFOODFACTS_API_URL || 'https://world.openfoodfacts.org/api/v2';
    const appName = import.meta.env.VITE_APP_NAME || 'FoodTracker';
    const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
    const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'developer@example.com';
    this.userAgent = `${appName}/${appVersion} (${contactEmail})`;
  }

  private async makeRequest(url: string): Promise<any> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': this.userAgent,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  }

  private mapNutrition(nutriments: any): NutritionData {
    return {
      calories: nutriments?.['energy-kcal_100g'] || 0,
      protein: nutriments?.['proteins_100g'] || 0,
      carbs: nutriments?.['carbohydrates_100g'] || 0,
      fat: nutriments?.['fat_100g'] || 0,
      fiber: nutriments?.['fiber_100g'] || 0,
      sugar: nutriments?.['sugars_100g'] || 0,
      sodium: (nutriments?.['sodium_100g'] || nutriments?.['salt_100g'] * 0.4) || 0,
    };
  }

  async getProductByBarcode(barcode: string): Promise<ProductInfo | null> {
    try {
      const url = `${this.baseUrl}/product/${barcode}?fields=product_name,brands,ingredients_text,nutriments,categories_tags,image_url,serving_size`;
      const data: OpenFoodFactsProduct = await this.makeRequest(url);

      if (data.status !== 1 || !data.product) {
        return null;
      }

      const product = data.product;
      return {
        name: product.product_name || 'Unknown Product',
        brand: product.brands,
        nutrition: this.mapNutrition(product.nutriments),
        ingredients: product.ingredients_text,
        categories: product.categories_tags?.map(tag => 
          tag.replace('en:', '').replace(/-/g, ' ')
        ),
        imageUrl: product.image_url,
        servingSize: product.serving_size,
      };
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw new Error('Failed to fetch product information');
    }
  }

  async searchProducts(query: string, limit: number = 10): Promise<ProductInfo[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.baseUrl}/search?search_terms=${encodedQuery}&fields=product_name,brands,ingredients_text,nutriments,categories_tags,image_url,serving_size&page_size=${limit}&sort_by=unique_scans_n`;
      const data: OpenFoodFactsSearchResult = await this.makeRequest(url);

      return data.products
        .filter(product => product?.product_name)
        .map(product => ({
          name: product.product_name || 'Unknown Product',
          brand: product.brands,
          nutrition: this.mapNutrition(product.nutriments),
          ingredients: product.ingredients_text,
          categories: product.categories_tags?.map(tag => 
            tag.replace('en:', '').replace(/-/g, ' ')
          ),
          imageUrl: product.image_url,
          servingSize: product.serving_size,
        }));
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  async getProductWithRetry(barcode: string, maxRetries: number = 3): Promise<ProductInfo | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.getProductByBarcode(barcode);
      } catch (error) {
        if (attempt === maxRetries) {
          console.error(`Failed to fetch product after ${maxRetries} attempts:`, error);
          return null;
        }
        
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return null;
  }

  async searchProductsWithRetry(query: string, limit: number = 10, maxRetries: number = 3): Promise<ProductInfo[]> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.searchProducts(query, limit);
      } catch (error) {
        if (attempt === maxRetries) {
          console.error(`Failed to search products after ${maxRetries} attempts:`, error);
          return [];
        }
        
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    return [];
  }
}

export const openFoodFactsService = new OpenFoodFactsService();