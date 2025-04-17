import { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCartSchema, 
  insertCartItemSchema,
  insertWishlistSchema,
  insertWishlistItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema
} from "@shared/schema";
import { randomUUID } from "crypto";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - all routes begin with /api
  
  // Authentication check middleware
  const authenticateUser = async (req: Request, res: Response, next: Function) => {
    // For simplicity, we'll check for userId in session
    // In a real app, you would use proper session management and JWT
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Get session cart or create one
  const getOrCreateCart = async (req: Request) => {
    let cart;
    
    if (req.session && req.session.userId) {
      // Logged in user
      cart = await storage.getCartBySessionId(req.sessionID);
      if (!cart) {
        cart = await storage.createCart({
          userId: req.session.userId,
          sessionId: req.sessionID
        });
      }
    } else {
      // Guest user
      cart = await storage.getCartBySessionId(req.sessionID);
      if (!cart) {
        cart = await storage.createCart({
          userId: null,
          sessionId: req.sessionID
        });
      }
    }
    
    return cart;
  };

  // User registration
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already in use" });
      }
      
      // In a real app, you would hash the password here
      const newUser = await storage.createUser(userData);
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = newUser;
      
      // Set user session
      if (req.session) {
        req.session.userId = newUser.id;
      }
      
      // If user had a cart as guest, associate it with their account
      const guestCart = await storage.getCartBySessionId(req.sessionID);
      if (guestCart && guestCart.userId === null) {
        // Update cart with user id
        await storage.updateCart(guestCart.id, { userId: newUser.id });
      }
      
      // Create wishlist for new user
      await storage.createWishlist({ userId: newUser.id });
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  // User login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      // Remove password from the response
      const { password: _, ...userWithoutPassword } = user;
      
      // If user had a cart as guest, associate it with their account
      const guestCart = await storage.getCartBySessionId(req.sessionID);
      if (guestCart && guestCart.userId === null) {
        // Update cart with user id
        await storage.updateCart(guestCart.id, { userId: user.id });
      }
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error during login" });
    }
  });

  // User logout
  app.post('/api/auth/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Error during logout" });
        }
        res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      res.status(200).json({ message: "No active session" });
    }
  });

  // Get current user
  app.get('/api/user', authenticateUser, async (req, res) => {
    try {
      const userId = req.session!.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching user" });
    }
  });

  // Update user profile
  app.patch('/api/user', authenticateUser, async (req, res) => {
    try {
      const userId = req.session!.userId;
      const userData = req.body;
      
      // Don't allow password update through this endpoint
      if (userData.password) {
        delete userData.password;
      }
      
      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from the response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error updating user" });
    }
  });

  // Get products 
  app.get('/api/products', async (req, res) => {
    try {
      const { 
        category, collection, featured, bestSeller, newArrival, limit, offset, search 
      } = req.query;
      
      const options: any = {};
      
      if (category) options.category = category as string;
      if (collection) options.collection = collection as string;
      if (featured !== undefined) options.featured = featured === 'true';
      if (bestSeller !== undefined) options.bestSeller = bestSeller === 'true';
      if (newArrival !== undefined) options.newArrival = newArrival === 'true';
      if (limit) options.limit = parseInt(limit as string);
      if (offset) options.offset = parseInt(offset as string);
      if (search) options.search = search as string;
      
      const products = await storage.getProducts(options);
      
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching products" });
    }
  });

  // Get product by ID
  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching product" });
    }
  });

  // Get product reviews
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const reviews = await storage.getProductReviews(productId);
      
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching reviews" });
    }
  });

  // Add product review
  app.post('/api/products/:id/reviews', authenticateUser, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.session!.userId;
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        productId,
        userId
      });
      
      const newReview = await storage.createReview(reviewData);
      
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error adding review" });
    }
  });

  // Cart routes
  
  // Get cart
  app.get('/api/cart', async (req, res) => {
    try {
      const cart = await getOrCreateCart(req);
      const cartItems = await storage.getCartItems(cart.id);
      
      // Get product details for each cart item
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          let variant = undefined;
          
          if (item.variantId) {
            const variants = await storage.getProductVariants(item.productId);
            variant = variants.find(v => v.id === item.variantId);
          }
          
          return {
            ...item,
            product,
            variant
          };
        })
      );
      
      res.status(200).json({
        cart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching cart" });
    }
  });

  // Add item to cart
  app.post('/api/cart/items', async (req, res) => {
    try {
      const cart = await getOrCreateCart(req);
      
      const { productId, variantId, quantity } = req.body;
      
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }
      
      // Validate product exists and is in stock
      const product = await storage.getProductById(parseInt(productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (!product.inStock) {
        return res.status(400).json({ message: "Product is out of stock" });
      }
      
      // Validate variant if provided
      if (variantId) {
        const variants = await storage.getProductVariants(product.id);
        const variant = variants.find(v => v.id === parseInt(variantId));
        
        if (!variant) {
          return res.status(404).json({ message: "Variant not found" });
        }
        
        if (!variant.inStock) {
          return res.status(400).json({ message: "Selected variant is out of stock" });
        }
      }
      
      const cartItemData = insertCartItemSchema.parse({
        cartId: cart.id,
        productId: parseInt(productId),
        variantId: variantId ? parseInt(variantId) : null,
        quantity: parseInt(quantity),
        price: product.salePrice || product.price
      });
      
      const cartItem = await storage.addCartItem(cartItemData);
      
      // Get updated cart
      const updatedCart = await storage.getCart(cart.id);
      const cartItems = await storage.getCartItems(cart.id);
      
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          let variant = undefined;
          
          if (item.variantId) {
            const variants = await storage.getProductVariants(item.productId);
            variant = variants.find(v => v.id === item.variantId);
          }
          
          return {
            ...item,
            product,
            variant
          };
        })
      );
      
      res.status(201).json({
        cart: updatedCart,
        items: itemsWithDetails
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error adding item to cart" });
    }
  });

  // Update cart item quantity
  app.patch('/api/cart/items/:id', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (isNaN(itemId) || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Valid item ID and quantity are required" });
      }
      
      const cart = await getOrCreateCart(req);
      const cartItems = await storage.getCartItems(cart.id);
      const item = cartItems.find(item => item.id === itemId);
      
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      const updatedItem = await storage.updateCartItemQuantity(itemId, quantity);
      
      // Get updated cart
      const updatedCartItems = await storage.getCartItems(cart.id);
      
      const itemsWithDetails = await Promise.all(
        updatedCartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          let variant = undefined;
          
          if (item.variantId) {
            const variants = await storage.getProductVariants(item.productId);
            variant = variants.find(v => v.id === item.variantId);
          }
          
          return {
            ...item,
            product,
            variant
          };
        })
      );
      
      res.status(200).json({
        cart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Server error updating cart item" });
    }
  });

  // Remove item from cart
  app.delete('/api/cart/items/:id', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      const cart = await getOrCreateCart(req);
      const cartItems = await storage.getCartItems(cart.id);
      const item = cartItems.find(item => item.id === itemId);
      
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      await storage.removeCartItem(itemId);
      
      // Get updated cart
      const updatedCartItems = await storage.getCartItems(cart.id);
      
      const itemsWithDetails = await Promise.all(
        updatedCartItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          let variant = undefined;
          
          if (item.variantId) {
            const variants = await storage.getProductVariants(item.productId);
            variant = variants.find(v => v.id === item.variantId);
          }
          
          return {
            ...item,
            product,
            variant
          };
        })
      );
      
      res.status(200).json({
        cart,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Server error removing cart item" });
    }
  });

  // Clear cart
  app.delete('/api/cart', async (req, res) => {
    try {
      const cart = await getOrCreateCart(req);
      
      await storage.clearCart(cart.id);
      
      res.status(200).json({
        cart,
        items: []
      });
    } catch (error) {
      res.status(500).json({ message: "Server error clearing cart" });
    }
  });

  // Wishlist routes
  
  // Get wishlist
  app.get('/api/wishlist', authenticateUser, async (req, res) => {
    try {
      const userId = req.session!.userId;
      
      let wishlist = await storage.getWishlist(userId);
      
      if (!wishlist) {
        wishlist = await storage.createWishlist({ userId });
      }
      
      const wishlistItems = await storage.getWishlistItems(wishlist.id);
      
      // Get product details for each wishlist item
      const itemsWithDetails = await Promise.all(
        wishlistItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          
          return {
            ...item,
            product
          };
        })
      );
      
      res.status(200).json({
        wishlist,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching wishlist" });
    }
  });

  // Add item to wishlist
  app.post('/api/wishlist/items', authenticateUser, async (req, res) => {
    try {
      const userId = req.session!.userId;
      const { productId } = req.body;
      
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      
      // Validate product exists
      const product = await storage.getProductById(parseInt(productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      let wishlist = await storage.getWishlist(userId);
      
      if (!wishlist) {
        wishlist = await storage.createWishlist({ userId });
      }
      
      const wishlistItemData = insertWishlistItemSchema.parse({
        wishlistId: wishlist.id,
        productId: parseInt(productId)
      });
      
      const wishlistItem = await storage.addWishlistItem(wishlistItemData);
      
      // Get updated wishlist
      const wishlistItems = await storage.getWishlistItems(wishlist.id);
      
      const itemsWithDetails = await Promise.all(
        wishlistItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          
          return {
            ...item,
            product
          };
        })
      );
      
      res.status(201).json({
        wishlist,
        items: itemsWithDetails
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error adding item to wishlist" });
    }
  });

  // Remove item from wishlist
  app.delete('/api/wishlist/items/:productId', authenticateUser, async (req, res) => {
    try {
      const userId = req.session!.userId;
      const productId = parseInt(req.params.productId);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const wishlist = await storage.getWishlist(userId);
      
      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }
      
      await storage.removeWishlistItem(wishlist.id, productId);
      
      // Get updated wishlist
      const wishlistItems = await storage.getWishlistItems(wishlist.id);
      
      const itemsWithDetails = await Promise.all(
        wishlistItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          
          return {
            ...item,
            product
          };
        })
      );
      
      res.status(200).json({
        wishlist,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Server error removing wishlist item" });
    }
  });

  // Order routes
  
  // Create order
  app.post('/api/orders', async (req, res) => {
    try {
      const cart = await getOrCreateCart(req);
      const cartItems = await storage.getCartItems(cart.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cannot create order with empty cart" });
      }
      
      const {
        shippingAddress,
        billingAddress,
        paymentMethod
      } = req.body;
      
      if (!shippingAddress || !billingAddress || !paymentMethod) {
        return res.status(400).json({ message: "Shipping address, billing address, and payment method are required" });
      }
      
      // Calculate total
      let total = 0;
      for (const item of cartItems) {
        const product = await storage.getProductById(item.productId);
        if (!product) continue;
        
        const price = product.salePrice || product.price;
        total += price * item.quantity;
      }
      
      // Create order
      const orderData = insertOrderSchema.parse({
        userId: req.session?.userId || null,
        sessionId: req.sessionID,
        status: "pending",
        total,
        shippingAddress,
        billingAddress,
        paymentMethod
      });
      
      const order = await storage.createOrder(orderData);
      
      // Add order items
      for (const item of cartItems) {
        await storage.addOrderItem({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price
        });
      }
      
      // Clear cart after order is created
      await storage.clearCart(cart.id);
      
      // Get order items
      const orderItems = await storage.getOrderItems(order.id);
      
      const itemsWithDetails = await Promise.all(
        orderItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          let variant = undefined;
          
          if (item.variantId) {
            const variants = await storage.getProductVariants(item.productId);
            variant = variants.find(v => v.id === item.variantId);
          }
          
          return {
            ...item,
            product,
            variant
          };
        })
      );
      
      res.status(201).json({
        order,
        items: itemsWithDetails
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error creating order" });
    }
  });

  // Get user orders
  app.get('/api/orders', authenticateUser, async (req, res) => {
    try {
      const userId = req.session!.userId;
      
      const orders = await storage.getUserOrders(userId);
      
      // Get items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const orderItems = await storage.getOrderItems(order.id);
          
          const itemsWithDetails = await Promise.all(
            orderItems.map(async (item) => {
              const product = await storage.getProductById(item.productId);
              let variant = undefined;
              
              if (item.variantId) {
                const variants = await storage.getProductVariants(item.productId);
                variant = variants.find(v => v.id === item.variantId);
              }
              
              return {
                ...item,
                product,
                variant
              };
            })
          );
          
          return {
            ...order,
            items: itemsWithDetails
          };
        })
      );
      
      res.status(200).json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Server error fetching orders" });
    }
  });

  // Get order by ID
  app.get('/api/orders/:id', authenticateUser, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const userId = req.session!.userId;
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if the order belongs to the user
      if (order.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to view this order" });
      }
      
      // Get order items
      const orderItems = await storage.getOrderItems(order.id);
      
      const itemsWithDetails = await Promise.all(
        orderItems.map(async (item) => {
          const product = await storage.getProductById(item.productId);
          let variant = undefined;
          
          if (item.variantId) {
            const variants = await storage.getProductVariants(item.productId);
            variant = variants.find(v => v.id === item.variantId);
          }
          
          return {
            ...item,
            product,
            variant
          };
        })
      );
      
      res.status(200).json({
        ...order,
        items: itemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Server error fetching order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
