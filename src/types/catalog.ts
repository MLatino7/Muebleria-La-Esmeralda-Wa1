export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  price: number;
  previousPrice?: number;
  images: string[];
  alt: string;
  featured: boolean;
  available: boolean;
  dimensions?: string;
  materials?: string[];
  colors?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}
