import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md mx-4 shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="border-t border-gray-100 pt-6 mt-4">
            <h2 className="text-sm font-medium text-gray-700 mb-4">You might want to check:</h2>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-6">
              <li>The URL for typos</li>
              <li>Our featured collections</li>
              <li>New arrivals</li>
              <li>Your recent browsing history</li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 pt-6">
          <Button asChild className="w-full sm:w-auto" variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto" variant="outline">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
