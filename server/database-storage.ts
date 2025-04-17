import { db } from "./db";
import { IStorage } from "./storage";
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
import { eq, and, like, desc, or, isNotNull } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
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
    let query = db.select().from(products);
    
    const conditions = [];
    
    if (options.category) {
      // Type cast to match the category enum values
      conditions.push(eq(products.category, options.category as any));
    }
    
    if (options.collection) {
      // Type cast to match the collection enum values
      conditions.push(eq(products.collection, options.collection as any));
    }
    
    if (options.featured !== undefined) {
      conditions.push(eq(products.featured, options.featured));
    }
    
    if (options.bestSeller !== undefined) {
      conditions.push(eq(products.bestSeller, options.bestSeller));
    }
    
    if (options.newArrival !== undefined) {
      conditions.push(eq(products.newArrival, options.newArrival));
    }
    
    if (options.search) {
      const searchTerm = `%${options.search}%`;
      conditions.push(
        or(
          like(products.name, searchTerm),
          like(products.description, searchTerm)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply ordering - newest first
    query = query.orderBy(desc(products.createdAt));
    
    // Apply pagination
    if (options.offset !== undefined) {
      query = query.offset(options.offset);
    }
    
    if (options.limit !== undefined) {
      query = query.limit(options.limit);
    }
    
    // Execute the query and return products
    return await query.execute();
  }

  async getProductById(id: number): Promise<ProductWithDetails | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id)).execute();
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
    const [product] = await db.select().from(products).where(eq(products.sku, sku)).execute();
    if (!product) return undefined;
    
    const images = await this.getProductImages(product.id);
    const variants = await this.getProductVariants(product.id);
    
    return {
      ...product,
      images,
      variants
    };
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return !!result.rowCount && result.rowCount > 0;
  }

  // Product images operations
  async getProductImages(productId: number): Promise<ProductImage[]> {
    return db.select().from(productImages).where(eq(productImages.productId, productId)).execute();
  }

  async addProductImage(image: InsertProductImage): Promise<ProductImage> {
    const [newImage] = await db.insert(productImages).values(image).returning();
    return newImage;
  }

  // Product variants operations
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    return db.select().from(productVariants).where(eq(productVariants.productId, productId)).execute();
  }

  async addProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    const [newVariant] = await db.insert(productVariants).values(variant).returning();
    return newVariant;
  }

  // Cart operations
  async getCart(id: number): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.id, id)).execute();
    return cart;
  }

  async getCartBySessionId(sessionId: string): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId)).execute();
    return cart;
  }

  async createCart(cart: InsertCart): Promise<Cart> {
    const [newCart] = await db.insert(carts).values(cart).returning();
    return newCart;
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.cartId, cartId)).execute();
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return !!result.rowCount && result.rowCount > 0;
  }

  async clearCart(cartId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    return !!result.rowCount && result.rowCount > 0;
  }

  // Wishlist operations
  async getWishlist(userId: number): Promise<Wishlist | undefined> {
    const [wishlist] = await db.select().from(wishlists).where(eq(wishlists.userId, userId)).execute();
    return wishlist;
  }

  async createWishlist(wishlist: InsertWishlist): Promise<Wishlist> {
    const [newWishlist] = await db.insert(wishlists).values(wishlist).returning();
    return newWishlist;
  }

  async getWishlistItems(wishlistId: number): Promise<WishlistItem[]> {
    return db.select().from(wishlistItems).where(eq(wishlistItems.wishlistId, wishlistId)).execute();
  }

  async addWishlistItem(item: InsertWishlistItem): Promise<WishlistItem> {
    const [newItem] = await db.insert(wishlistItems).values(item).returning();
    return newItem;
  }

  async removeWishlistItem(wishlistId: number, productId: number): Promise<boolean> {
    const result = await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wishlistId),
          eq(wishlistItems.productId, productId)
        )
      );
    return !!result.rowCount && result.rowCount > 0;
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id)).execute();
    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)).execute();
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [newItem] = await db.insert(orderItems).values(item).returning();
    return newItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId)).execute();
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update product average rating and review count
    const productReviews = await this.getProductReviews(review.productId);
    const avgRating = productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length;
    
    // Use separate properties update to avoid type errors
    await db
      .update(products)
      .set({ 
        averageRating: avgRating,
        reviewCount: productReviews.length
      } as any)
      .where(eq(products.id, review.productId));
    
    return newReview;
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.productId, productId)).execute();
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.userId, userId)).execute();
  }
}