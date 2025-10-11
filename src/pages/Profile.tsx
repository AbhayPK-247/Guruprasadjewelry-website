import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, LogOut, Package, MapPin, Edit2, Eye, EyeOff, Moon, Sun } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState("");

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`,
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });
      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Welcome to our store. You're now logged in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/profile`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setAuthMode("login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md shadow-elevation">
            <CardHeader className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-serif">
                {authMode === "login" && "Welcome Back"}
                {authMode === "signup" && "Create Account"}
                {authMode === "forgot" && "Reset Password"}
              </CardTitle>
              <CardDescription>
                {authMode === "login" && "Sign in to access your account"}
                {authMode === "signup" && "Join us and start shopping"}
                {authMode === "forgot" && "Enter your email to receive a reset link"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authMode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      className="pl-10 pr-10"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <button
      type="button"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
</div>


                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot")}
                      className="text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full shadow-luxury hover:shadow-elevation transition-all duration-300"
                    size="lg"
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className="text-primary hover:underline font-medium"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              )}

              {authMode === "signup" && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Your full name"
                        className="pl-10"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        className="pl-4"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">At least 6 characters</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full shadow-luxury hover:shadow-elevation transition-all duration-300"
                    size="lg"
                  >
                    {isSubmitting ? "Creating account..." : "Create Account"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {authMode === "forgot" && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full shadow-luxury hover:shadow-elevation transition-all duration-300"
                    size="lg"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-to-b from-background via-secondary/20 to-background">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-secondary/40 via-secondary/20 to-secondary/40 border-b border-border/30">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between animate-fade-in">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif mb-2">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex flex-col items-end">
                {/* Theme Toggle Button */}
                {(() => {
                  const { theme, setTheme } = useTheme();
                  return (
                    <Button variant="outline" onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="mb-2">
                      {theme === "light" ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                    </Button>
                  );
                })()}
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Account Menu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Profile Details
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="w-4 h-4 mr-2" />
                    Order History
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Saved Addresses
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Info */}
              <Card className="shadow-elevation">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="font-medium">{user.user_metadata?.full_name || "Not set"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Member Since</Label>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Addresses */}
              <Card className="shadow-elevation">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No saved addresses yet</p>
                    <p className="text-sm">Add an address to get started</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order History */}
              <Card className="shadow-elevation">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Track your order history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No orders yet</p>
                    <p className="text-sm">Start shopping to see your orders here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
