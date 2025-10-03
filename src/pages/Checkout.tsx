import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatUGX } from "@/utils/formatUGX";

export default function Checkout() {
  const { items, total, itemCount, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
  });

  const subtotal = total;
  const shipping = subtotal >= 50000 ? 0 : 2000;
  const finalTotal = subtotal + shipping;

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "county",
    ];
    const missingFields = requiredFields.filter(
      (field) => !shippingInfo[field as keyof typeof shippingInfo]
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number for mobile money
    if ((paymentMethod === "mpesa" || paymentMethod === "airtel") && 
        !/^[0-9]{10}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number for mobile money payment.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user?.id,
          subtotal_ugx: subtotal,
          shipping_cost_ugx: shipping,
          total_amount_ugx: finalTotal,
          payment_method: paymentMethod,
          payment_status: 'pending',
          status: 'pending',
          shipping_address: {
            first_name: shippingInfo.firstName,
            last_name: shippingInfo.lastName,
            phone: shippingInfo.phone,
            address_line_1: shippingInfo.address,
            city: shippingInfo.city,
            country: shippingInfo.county,
            postal_code: shippingInfo.postalCode
          } as any,
          billing_address: {
            first_name: shippingInfo.firstName,
            last_name: shippingInfo.lastName,
            phone: shippingInfo.phone,
            address_line_1: shippingInfo.address,
            city: shippingInfo.city,
            country: shippingInfo.county,
            postal_code: shippingInfo.postalCode
          } as any
        } as any])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_sku: item.id,
        quantity: item.quantity,
        unit_price_ugx: item.price,
        total_price_ugx: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Initiate payment based on method
      if (paymentMethod === "mpesa" || paymentMethod === "airtel") {
        toast({
          title: "Payment Initiated",
          description: `Please check your phone for the ${paymentMethod === "mpesa" ? "M-Pesa" : "Airtel Money"} payment prompt.`,
        });
        
        // In a real implementation, you would call Flutterwave/Paystack API here
        // For now, simulate a successful payment after 3 seconds
        setTimeout(() => {
          setIsProcessing(false);
          setOrderComplete(true);
          clearCart();

          toast({
            title: "Order Placed Successfully!",
            description: "You will receive a confirmation email shortly.",
          });
        }, 3000);
      } else {
        // For card payments, redirect to Stripe (to be implemented)
        toast({
          title: "Payment Method",
          description: "Card payments coming soon!",
        });
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto container-padding py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">No items to checkout</h1>
            <p className="text-muted-foreground mb-8">
              Your cart is empty. Add some items before proceeding to checkout.
            </p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto container-padding py-16">
          <div className="max-w-md mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. You will receive a confirmation email
              with your order details and tracking information.
            </p>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/my-orders">View My Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto container-padding py-6">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/cart" className="hover:text-primary">
              Cart
            </Link>
            <span className="mx-2">/</span>
            <span>Checkout</span>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Mobile Number * (for payment confirmation)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0700000000"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      You'll receive a payment prompt on this number
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Street address or P.O. Box"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                    />
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City/Town *</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="county">County *</Label>
                      <Input
                        id="county"
                        value={shippingInfo.county}
                        onChange={(e) =>
                          handleInputChange("county", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="00000"
                      value={shippingInfo.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Label
                        htmlFor="mpesa"
                        className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">MTN Mobile Money</div>
                          <div className="text-sm text-muted-foreground">
                            Instant STK push payment
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="airtel" id="airtel" />
                      <Label
                        htmlFor="airtel"
                        className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-red-600" />
                        <div>
                          <div className="font-medium">Airtel Money</div>
                          <div className="text-sm text-muted-foreground">
                            Instant STK push payment
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg opacity-50">
                      <RadioGroupItem value="card" id="card" disabled />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-3 cursor-not-allowed flex-1">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Credit/Debit Card (Stripe)</div>
                          <div className="text-sm text-muted-foreground">
                            Coming soon - International payments
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {(paymentMethod === "mpesa" ||
                    paymentMethod === "airtel") && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">How it works:</p>
                      <ol className="text-sm list-decimal list-inside space-y-1">
                        <li>Click "Place Order" below</li>
                        <li>You'll receive a payment prompt on your phone</li>
                        <li>Enter your PIN to complete the payment</li>
                        <li>Order confirmed automatically!</li>
                      </ol>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-2">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatUGX(item.price)}
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {formatUGX(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>{formatUGX(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-success">Free</span>
                        ) : (
                          formatUGX(shipping)
                        )}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatUGX(finalTotal)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}>
                    {isProcessing
                      ? "Processing..."
                      : `Place Order - ${formatUGX(finalTotal)}`}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment processing
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}