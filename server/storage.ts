import { 
  users, type User, type InsertUser,
  products, type Product, type InsertProduct,
  productImages, type ProductImage, type InsertProductImage,
  productVariants, type ProductVariant, type InsertProductVariant,
  carts, type Cart, type InsertCart,
  cartItems, type CartItem, type InsertCartItem,
  wishlists, type Wishlist, type InsertWishlist,
  wishlistItems, type WishlistItem, type InsertWishlistItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  reviews, type Review, type InsertReview,
  ProductWithDetails
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Product operations
  getProducts(options?: { 
    category?: string; 
    collection?: string; 
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<Product[]>;
  getProductById(id: number): Promise<ProductWithDetails | undefined>;
  getProductBySku(sku: string): Promise<ProductWithDetails | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Product images operations
  getProductImages(productId: number): Promise<ProductImage[]>;
  addProductImage(image: InsertProductImage): Promise<ProductImage>;
  
  // Product variants operations
  getProductVariants(productId: number): Promise<ProductVariant[]>;
  addProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  
  // Cart operations
  getCart(id: number): Promise<Cart | undefined>;
  getCartBySessionId(sessionId: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(cartId: number): Promise<boolean>;
  
  // Wishlist operations
  getWishlist(userId: number): Promise<Wishlist | undefined>;
  createWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  getWishlistItems(wishlistId: number): Promise<WishlistItem[]>;
  addWishlistItem(item: InsertWishlistItem): Promise<WishlistItem>;
  removeWishlistItem(wishlistId: number, productId: number): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getProductReviews(productId: number): Promise<Review[]>;
  getUserReviews(userId: number): Promise<Review[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private productImages: Map<number, ProductImage>;
  private productVariants: Map<number, ProductVariant>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private wishlists: Map<number, Wishlist>;
  private wishlistItems: Map<number, WishlistItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  
  private userId: number = 1;
  private productId: number = 1;
  private productImageId: number = 1;
  private productVariantId: number = 1;
  private cartId: number = 1;
  private cartItemId: number = 1;
  private wishlistId: number = 1;
  private wishlistItemId: number = 1;
  private orderId: number = 1;
  private orderItemId: number = 1;
  private reviewId: number = 1;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.productImages = new Map();
    this.productVariants = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.wishlists = new Map();
    this.wishlistItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    
    // Initialize with some demo products
    this.initializeProducts();
  }

  private initializeProducts() {
    const products: InsertProduct[] = [
      {
        name: "Floral Embroidered Lawn Suit",
        description: "Beautiful 3-piece embroidered lawn suit featuring intricate floral detailing. Includes embroidered front, plain back, dyed trouser, and printed chiffon dupatta.",
        price: 5490,
        category: "lawn_suits",
        collection: "summer",
        inStock: true,
        sku: "LS-EMB-0423",
        thumbnailImage: "https://images.unsplash.com/photo-1603217192634-61068e4d4bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: true,
        newArrival: true,
        bestSeller: false
      },
      {
        name: "Premium Chiffon Embroidered Set",
        description: "Luxurious 3-piece chiffon embroidered set with handcrafted details. Perfect for special occasions. Includes embroidered shirt, plain trouser, and matching embroidered dupatta.",
        price: 8990,
        category: "chiffon_suits",
        collection: "festive",
        inStock: true,
        sku: "CS-EMB-0512",
        thumbnailImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false,
        newArrival: true,
        bestSeller: false
      },
      {
        name: "Luxury Embroidered Cotton Set",
        description: "Premium quality 3-piece cotton set with detailed embroidery. Comfortable and stylish for everyday wear. Includes embroidered shirt, plain trouser, and printed cotton dupatta.",
        price: 7490,
        category: "cotton_suits",
        collection: "casual",
        inStock: true,
        sku: "COT-EMB-0611",
        thumbnailImage: "https://images.unsplash.com/photo-1583482504958-5f4794199372?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: true,
        newArrival: true,
        bestSeller: false
      },
      {
        name: "Digital Printed Lawn 3 Piece",
        description: "Vibrant digital printed 3-piece lawn suit. Includes printed shirt, plain trouser, and matching printed dupatta. Perfect for summer.",
        price: 4590,
        category: "printed_suits",
        collection: "summer",
        inStock: true,
        sku: "PRT-LWN-0734",
        thumbnailImage: "https://images.unsplash.com/photo-1603217192895-274ed184f1c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false,
        newArrival: true,
        bestSeller: false
      },
      {
        name: "Embroidered Lawn Suit",
        description: "Classic 3-piece embroidered lawn suit with intricate detailing. Includes embroidered shirt, plain trouser, and printed lawn dupatta.",
        price: 6290,
        salePrice: null,
        category: "lawn_suits",
        collection: "summer",
        inStock: true,
        sku: "LS-EMB-0287",
        thumbnailImage: "https://images.unsplash.com/photo-1603217010046-c27639ed0c9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: true,
        newArrival: false,
        bestSeller: true
      },
      {
        name: "Premium Cotton Suit",
        description: "High-quality 3-piece cotton suit with beautiful embroidery. Comfortable and elegant for everyday wear. Includes embroidered shirt, plain trouser, and printed cotton dupatta.",
        price: 7990,
        salePrice: 5990,
        category: "cotton_suits",
        collection: "casual",
        inStock: true,
        sku: "COT-PRM-0392",
        thumbnailImage: "https://images.unsplash.com/photo-1583482504954-e73248821aa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false,
        newArrival: false,
        bestSeller: true
      },
      {
        name: "Printed Lawn Suit",
        description: "Stylish printed 3-piece lawn suit with modern patterns. Perfect for casual outings. Includes printed shirt, plain trouser, and matching printed dupatta.",
        price: 4990,
        salePrice: null,
        category: "printed_suits",
        collection: "casual",
        inStock: true,
        sku: "PRT-LWN-0418",
        thumbnailImage: "https://images.unsplash.com/photo-1619410283995-43d9134e7656?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: false,
        newArrival: false,
        bestSeller: true
      },
      {
        name: "Designer Embroidered Set",
        description: "Premium designer 3-piece embroidered set for special occasions. Exquisite craftsmanship and luxurious fabric. Includes heavily embroidered shirt, plain trouser, and embroidered dupatta.",
        price: 9990,
        salePrice: 7990,
        category: "embroidered_suits",
        collection: "festive",
        inStock: true,
        sku: "EMB-DSG-0517",
        thumbnailImage: "https://images.unsplash.com/photo-1619834099773-62d6de296615?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        featured: true,
        newArrival: false,
        bestSeller: true
      }
    ];

    products.forEach(product => {
      const newProduct: Product = {
        ...product,
        id: this.productId++,
        createdAt: new Date(),
        averageRating: 4.5,
        reviewCount: Math.floor(Math.random() * 100) + 10
      };
      this.products.set(newProduct.id, newProduct);

      // Add product images
      this.addProductImage({
        productId: newProduct.id,
        imageUrl: newProduct.thumbnailImage,
        isPrimary: true
      });

      // Add additional images
      this.addProductImage({
        productId: newProduct.id,
        imageUrl: "https://images.unsplash.com/photo-1603217010046-c27639ed0c9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isPrimary: false
      });
      this.addProductImage({
        productId: newProduct.id,
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isPrimary: false
      });
      this.addProductImage({
        productId: newProduct.id,
        imageUrl: "https://images.unsplash.com/photo-1583482504958-5f4794199372?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        isPrimary: false
      });

      // Add product variants
      const colors = ["Pink", "Blue", "Green", "Yellow"];
      const sizes = ["XS", "S", "M", "L", "XL"];
      
      colors.forEach(color => {
        this.addProductVariant({
          productId: newProduct.id,
          color,
          size: null,
          inStock: true,
          price: null
        });
      });
      
      sizes.forEach(size => {
        this.addProductVariant({
          productId: newProduct.id,
          color: null,
          size,
          inStock: size !== "XS",
          price: null
        });
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product operations
  async getProducts(options: { 
    category?: string; 
    collection?: string; 
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  } = {}): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (options.category) {
      products = products.filter(p => p.category === options.category);
    }
    
    if (options.collection) {
      products = products.filter(p => p.collection === options.collection);
    }
    
    if (options.featured !== undefined) {
      products = products.filter(p => p.featured === options.featured);
    }
    
    if (options.bestSeller !== undefined) {
      products = products.filter(p => p.bestSeller === options.bestSeller);
    }
    
    if (options.newArrival !== undefined) {
      products = products.filter(p => p.newArrival === options.newArrival);
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || products.length;
    
    return products.slice(offset, offset + limit);
  }

  async getProductById(id: number): Promise<ProductWithDetails | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const images = await this.getProductImages(id);
    const variants = await this.getProductVariants(id);
    
    return {
      ...product,
      images,
      variants
    };
  }

  async getProductBySku(sku: string): Promise<ProductWithDetails | undefined> {
    const product = Array.from(this.products.values()).find(p => p.sku === sku);
    if (!product) return undefined;
    
    const images = await this.getProductImages(product.id);
    const variants = await this.getProductVariants(product.id);
    
    return {
      ...product,
      images,
      variants
    };
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const createdAt = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt,
      averageRating: 0,
      reviewCount: 0
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Product images operations
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return Array.from(this.productImages.values()).filter(
      img => img.productId === productId
    );
  }

  async addProductImage(insertImage: InsertProductImage): Promise<ProductImage> {
    const id = this.productImageId++;
    const image: ProductImage = { ...insertImage, id };
    this.productImages.set(id, image);
    return image;
  }

  // Product variants operations
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    return Array.from(this.productVariants.values()).filter(
      variant => variant.productId === productId
    );
  }

  async addProductVariant(insertVariant: InsertProductVariant): Promise<ProductVariant> {
    const id = this.productVariantId++;
    const variant: ProductVariant = { ...insertVariant, id };
    this.productVariants.set(id, variant);
    return variant;
  }

  // Cart operations
  async getCart(id: number): Promise<Cart | undefined> {
    return this.carts.get(id);
  }

  async getCartBySessionId(sessionId: string): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(
      cart => cart.sessionId === sessionId
    );
  }

  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = this.cartId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const cart: Cart = { ...insertCart, id, createdAt, updatedAt };
    this.carts.set(id, cart);
    return cart;
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      item => item.cartId === cartId
    );
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const existingItems = await this.getCartItems(insertItem.cartId);
    const existingItem = existingItems.find(
      item => 
        item.productId === insertItem.productId && 
        item.variantId === insertItem.variantId
    );
    
    if (existingItem) {
      // Update quantity of existing item
      return this.updateCartItemQuantity(
        existingItem.id, 
        existingItem.quantity + insertItem.quantity
      ) as Promise<CartItem>;
    }
    
    // Add new item
    const id = this.cartItemId++;
    const createdAt = new Date();
    const cartItem: CartItem = { ...insertItem, id, createdAt };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(cartId: number): Promise<boolean> {
    const items = await this.getCartItems(cartId);
    items.forEach(item => this.cartItems.delete(item.id));
    return true;
  }

  // Wishlist operations
  async getWishlist(userId: number): Promise<Wishlist | undefined> {
    return Array.from(this.wishlists.values()).find(
      wishlist => wishlist.userId === userId
    );
  }

  async createWishlist(insertWishlist: InsertWishlist): Promise<Wishlist> {
    const id = this.wishlistId++;
    const createdAt = new Date();
    const wishlist: Wishlist = { ...insertWishlist, id, createdAt };
    this.wishlists.set(id, wishlist);
    return wishlist;
  }

  async getWishlistItems(wishlistId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(
      item => item.wishlistId === wishlistId
    );
  }

  async addWishlistItem(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists
    const existingItems = await this.getWishlistItems(insertItem.wishlistId);
    const existingItem = existingItems.find(
      item => item.productId === insertItem.productId
    );
    
    if (existingItem) {
      return existingItem;
    }
    
    const id = this.wishlistItemId++;
    const addedAt = new Date();
    const wishlistItem: WishlistItem = { ...insertItem, id, addedAt };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }

  async removeWishlistItem(wishlistId: number, productId: number): Promise<boolean> {
    const items = await this.getWishlistItems(wishlistId);
    const itemToRemove = items.find(item => item.productId === productId);
    
    if (!itemToRemove) return false;
    return this.wishlistItems.delete(itemToRemove.id);
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const order: Order = { ...insertOrder, id, createdAt, updatedAt };
    this.orders.set(id, order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemId++;
    const orderItem: OrderItem = { ...insertItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  // Review operations
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewId++;
    const createdAt = new Date();
    const review: Review = { ...insertReview, id, createdAt };
    this.reviews.set(id, review);
    
    // Update product rating
    const product = this.products.get(insertReview.productId);
    if (product) {
      const productReviews = await this.getProductReviews(product.id);
      const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / productReviews.length;
      
      await this.updateProduct(product.id, {
        averageRating,
        reviewCount: productReviews.length
      });
    }
    
    return review;
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.productId === productId
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.userId === userId
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

import { DatabaseStorage } from "./database-storage";

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
