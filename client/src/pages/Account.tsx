import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  User, 
  Package2, 
  Heart, 
  LogOut, 
  Settings, 
  ShoppingBag,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice } from "@/lib/utils";

// Define form schema
const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Account = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch user data
  const { data: user, isLoading: isUserLoading, refetch: refetchUser } = useQuery({
    queryKey: ['/api/user'],
    onError: () => {
      // If unauthorized, redirect to login
      setLocation('/login?redirect=/account');
    }
  });
  
  // Fetch user orders
  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['/api/orders'],
    enabled: !!user
  });
  
  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      state: user?.state || "",
      postalCode: user?.postalCode || "",
      country: user?.country || "Pakistan",
    }
  });
  
  // Update form values when user data is loaded
  useState(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        postalCode: user.postalCode || "",
        country: user.country || "Pakistan",
      });
    }
  });
  
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    
    try {
      await apiRequest("PATCH", "/api/user", data);
      await refetchUser();
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // If not logged in or still loading, show loading state
  if (isUserLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center">
          <Skeleton className="h-8 w-48 mb-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  // If no user data, redirect to login
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-8">Please log in to access your account.</p>
        <Button asChild>
          <Link href="/login?redirect=/account">Login</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>My Account | Gulzar</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-display font-semibold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto bg-primary-light text-primary w-16 h-16 rounded-full flex items-center justify-center mb-2">
                  <User className="h-8 w-8" />
                </div>
                <CardTitle>{user.fullName || user.username}</CardTitle>
                <CardDescription className="text-center truncate">
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="text-sm space-y-2">
                  {user.phone && (
                    <p className="flex items-center">
                      <Phone className="h-3 w-3 mr-2 text-muted-foreground" /> 
                      {user.phone}
                    </p>
                  )}
                  {user.address && (
                    <p className="flex items-start">
                      <MapPin className="h-3 w-3 mr-2 mt-1 flex-shrink-0 text-muted-foreground" /> 
                      <span>
                        {[
                          user.address,
                          user.city,
                          user.state,
                          user.postalCode,
                          user.country
                        ].filter(Boolean).join(", ")}
                      </span>
                    </p>
                  )}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-col p-0">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none py-6 px-6"
                  asChild
                >
                  <Link href="/account?tab=orders">
                    <Package2 className="h-4 w-4 mr-3" /> My Orders
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none py-6 px-6"
                  asChild
                >
                  <Link href="/wishlist">
                    <Heart className="h-4 w-4 mr-3" /> My Wishlist
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-none py-6 px-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" /> Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Account Tabs */}
          <div className="md:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile" className="text-md">Profile</TabsTrigger>
                <TabsTrigger value="orders" className="text-md">Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Manage your personal information and contact details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
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
                                    placeholder="Enter your email address" 
                                    {...field}
                                    disabled
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
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-medium mb-4">Address Information</h3>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
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
                                <FormControl>
                                  <Input placeholder="Enter your state/province" {...field} />
                                </FormControl>
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
                                <FormControl>
                                  <Input placeholder="Enter your country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="mt-4"
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Update Profile"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track your recent orders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isOrdersLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton key={index} className="h-24 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order: any) => (
                          <div 
                            key={order.id} 
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">Order #{order.id}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <span className={`px-3 py-1 text-xs rounded-full ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : order.status === 'shipped'
                                      ? 'bg-blue-100 text-blue-800'
                                      : order.status === 'processing'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : order.status === 'cancelled'
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Items</h4>
                                <div className="text-sm">
                                  {order.items.map((item: any) => (
                                    <div key={item.id} className="mb-1">
                                      <span>{item.quantity}x {item.product.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Shipping Address</h4>
                                <p className="text-sm">{order.shippingAddress}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{formatPrice(order.total)}</span>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-neutral-dark opacity-30 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't placed any orders yet.
                        </p>
                        <Button asChild>
                          <Link href="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
