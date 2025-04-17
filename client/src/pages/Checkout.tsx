import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CreditCard, 
  Building2, 
  HelpCircle, 
  ShieldCheck, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";

// Define form schema
const checkoutSchema = z.object({
  // Shipping info
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().optional(),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().default("Pakistan"),
  
  // Payment info
  cardName: z.string().min(2, "Name must be at least 2 characters").optional(),
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").optional(),
  cardExpiry: z.string().min(4, "Expiry must be at least 4 characters").optional(),
  cardCvc: z.string().min(3, "CVC must be at least 3 digits").optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const [, setLocation] = useLocation();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  
  // Form setup
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Pakistan",
    }
  });
  
  // Calculate order totals
  const subtotal = totalPrice;
  const shippingCost = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shippingCost;
  
  // Handler for form submission
  const onSubmit = async (data: CheckoutFormData) => {
    if (activeTab === "shipping") {
      // Move to payment tab
      setActiveTab("payment");
      return;
    }
    
    // Process the order
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/orders", {
        shippingAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state || ''} ${data.postalCode}, ${data.country}`,
        billingAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state || ''} ${data.postalCode}, ${data.country}`,
        paymentMethod: paymentMethod
      });
      
      const orderData = await response.json();
      
      // Clear the cart after successful order
      await clearCart();
      
      // Show success toast
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderData.order.id} has been placed successfully.`,
      });
      
      // Redirect to confirmation page (mocked)
      setLocation(`/order-confirmation/${orderData.order.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Checkout | Gulzar</title>
        </Helmet>
        
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-3xl font-display font-semibold mb-8 text-center">Checkout</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-neutral-dark mb-8">
              You need to add products to your cart before proceeding to checkout.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout | Gulzar</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-display font-semibold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger 
                  value="payment" 
                  disabled={!form.formState.isValid && activeTab === "shipping"}
                >
                  Payment
                </TabsTrigger>
              </TabsList>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <TabsContent value="shipping" className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your first name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email address" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="Enter your phone number" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your street address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your city" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Punjab">Punjab</SelectItem>
                                  <SelectItem value="Sindh">Sindh</SelectItem>
                                  <SelectItem value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</SelectItem>
                                  <SelectItem value="Balochistan">Balochistan</SelectItem>
                                  <SelectItem value="Gilgit-Baltistan">Gilgit-Baltistan</SelectItem>
                                  <SelectItem value="Azad Kashmir">Azad Kashmir</SelectItem>
                                  <SelectItem value="Islamabad">Islamabad Capital Territory</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal/ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your postal code" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Pakistan">Pakistan</SelectItem>
                                  <SelectItem value="India">India</SelectItem>
                                  <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                                  <SelectItem value="UAE">United Arab Emirates</SelectItem>
                                  <SelectItem value="UK">United Kingdom</SelectItem>
                                  <SelectItem value="US">United States</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <Button variant="outline" asChild>
                          <Link href="/cart">
                            <ChevronsLeft className="mr-2 h-4 w-4" /> Back to Cart
                          </Link>
                        </Button>
                        <Button type="submit">
                          Continue to Payment <ChevronsRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="payment" className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-medium mb-6">Payment Method</h2>
                      
                      <div className="space-y-4">
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'cash' 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => setPaymentMethod('cash')}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              paymentMethod === 'cash' 
                                ? 'border-primary' 
                                : 'border-gray-400'
                              }`}
                            >
                              {paymentMethod === 'cash' && (
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">Cash on Delivery</h3>
                              <p className="text-sm text-neutral-dark">Pay when you receive your order</p>
                            </div>
                            <Building2 className="text-neutral-dark h-5 w-5" />
                          </div>
                        </div>
                        
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentMethod === 'card' 
                              ? 'border-primary bg-primary/5' 
                              : 'hover:border-gray-400'
                          }`}
                          onClick={() => setPaymentMethod('card')}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              paymentMethod === 'card' 
                                ? 'border-primary' 
                                : 'border-gray-400'
                              }`}
                            >
                              {paymentMethod === 'card' && (
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">Credit/Debit Card</h3>
                              <p className="text-sm text-neutral-dark">Pay securely with your card</p>
                            </div>
                            <CreditCard className="text-neutral-dark h-5 w-5" />
                          </div>
                          
                          {paymentMethod === 'card' && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="cardName"
                                  render={({ field }) => (
                                    <FormItem className="sm:col-span-2">
                                      <FormLabel>Name on Card</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Enter the name on your card" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="cardNumber"
                                  render={({ field }) => (
                                    <FormItem className="sm:col-span-2">
                                      <FormLabel>Card Number</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="1234 5678 9012 3456" 
                                          {...field}
                                          maxLength={19}
                                          onChange={(e) => {
                                            // Format card number with spaces
                                            const val = e.target.value.replace(/[^\d]/g, "");
                                            const formatted = val.replace(/(.{4})/g, "$1 ").trim();
                                            field.onChange(formatted);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="cardExpiry"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry Date</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="MM/YY" 
                                          {...field}
                                          maxLength={5}
                                          onChange={(e) => {
                                            // Format expiry date
                                            let val = e.target.value.replace(/[^\d]/g, "");
                                            if (val.length >= 2) {
                                              val = val.slice(0, 2) + "/" + val.slice(2, 4);
                                            }
                                            field.onChange(val);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={form.control}
                                  name="cardCvc"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex justify-between">
                                        <FormLabel>CVC/CVV</FormLabel>
                                        <span className="text-xs text-neutral-dark flex items-center">
                                          <HelpCircle className="h-3 w-3 mr-1" /> 3-4 digits
                                        </span>
                                      </div>
                                      <FormControl>
                                        <Input 
                                          placeholder="123" 
                                          {...field}
                                          maxLength={4}
                                          type="password"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <div className="mt-4 flex items-center text-sm">
                                <ShieldCheck className="h-4 w-4 text-primary mr-2" />
                                <span>Your payment information is secure and encrypted</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setActiveTab("shipping")}
                        >
                          <ChevronsLeft className="mr-2 h-4 w-4" /> Back to Shipping
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isSubmitting || (paymentMethod === 'card' && 
                            (!form.getValues("cardName") || !form.getValues("cardNumber") || 
                             !form.getValues("cardExpiry") || !form.getValues("cardCvc")))}
                        >
                          {isSubmitting ? "Processing..." : "Place Order"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="max-h-64 overflow-y-auto mb-4 pr-1">
                  {cartItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    
                    return (
                      <div key={item.id} className="flex py-3 border-b">
                        <div className="w-16 h-16 rounded bg-neutral-light overflow-hidden flex-shrink-0">
                          <img
                            src={product.thumbnailImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-grow">
                          <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                          <div className="text-xs text-muted-foreground">
                            {item.variant?.size && <span className="mr-2">Size: {item.variant.size}</span>}
                            {item.variant?.color && <span>Color: {item.variant.color}</span>}
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs">{`Qty: ${item.quantity}`}</span>
                            <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Separator className="mb-4" />
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span>{formatPrice(shippingCost)}</span>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="text-xs text-center text-muted-foreground w-full">
                  By placing your order, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
