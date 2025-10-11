import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, ImageIcon } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Link } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
    // === Gold/Silver Rates Integration Start ===
  const [goldRate, setGoldRate] = useState("");
  const [silverRate, setSilverRate] = useState("");
  const [diamondRate, setDiamondRate] = useState("");
  const [gemstoneRate, setGemstoneRate] = useState("");
  const [loadingRates, setLoadingRates] = useState(true);
  const [updatingRates, setUpdatingRates] = useState(false);
  // === Gold/Silver Rates Integration End ===
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "",
    karat: "",
    purity: "",
    weight: "",
    rate: "",
    making_charges: "",
    description: "",
    cut: "",
    clarity: "",
    gemstone_type: "",
    carat_weight: "",
    gender: "",
    occasion: "",
  });

  const types = [
    "Necklace", "Bracelet", "Ring", "Earring", "Bangle", "Pendant", "Chain", "Anklet", "Brooch", "Mangalsutra", "Nosepin", "Cufflink", "Tiara", "Other"
  ];

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    checkAdminAccess();
        // === Gold/Silver Rates Integration Start ===
    fetchMetalRates();
    // === Gold/Silver Rates Integration End ===
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Supabase user:', user);
      if (!user) {
        navigate("/profile");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      console.log('Role query result:', roles, 'Error:', error);

      if (error || !roles) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  
  // === Gold/Silver Rates Integration Start ===
  const fetchMetalRates = async () => {
    setLoadingRates(true);
    try {
      const { data, error } = await supabase
        .from("metal_rates")
        .select("metal, rate")
        .in("metal", ["gold", "silver"]);

      if (error) throw error;

      data.forEach((item) => {
        if (item.metal === "gold") setGoldRate(item.rate.toString());
        if (item.metal === "silver") setSilverRate(item.rate.toString());
      });
    } catch (error) {
      console.error("Error fetching metal rates:", error);
      toast({
        title: "Error",
        description: "Failed to load metal rates",
        variant: "destructive",
      });
    } finally {
      setLoadingRates(false);
    }
  };

  const upsertRate = async (metal: string, rate: string) => {
    const numericRate = parseFloat(rate);
    if (isNaN(numericRate)) throw new Error("Invalid rate for " + metal);

    const { error } = await supabase
      .from("metal_rates")
      .upsert({ metal: metal, rate: numericRate }, { onConflict: "metal" })
      .select();

    if (error) throw error;
  };

  const handleUpdateRates = async () => {
    setUpdatingRates(true);
    try {
      await upsertRate("gold", goldRate);
      await upsertRate("silver", silverRate);
      toast({
        title: "Success",
        description: "Metal rates updated successfully.",
      });
    } catch (error) {
      console.error("Error updating metal rates:", error);
      toast({
        title: "Error",
        description: "Failed to update metal rates",
        variant: "destructive",
      });
    } finally {
      setUpdatingRates(false);
    }
  };
  // === Gold/Silver Rates Integration End ===


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMetalChange = (value: string) => {
    setFormData({ ...formData, rate: value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const calculatePrice = (metalRate: number | null) => {
    const weight = parseFloat(formData.weight);
    const makingCharges = parseFloat(formData.making_charges);

    if (isNaN(weight) || !metalRate || isNaN(makingCharges)) return 0;

    let karatFactor = 1.0;
    switch (formData.karat) {
      case "24K":
        karatFactor = 1.0;
        break;
      case "22K":
        karatFactor = 0.916;
        break;
      case "18K":
        karatFactor = 0.75;
        break;
      case "14K":
        karatFactor = 0.583;
        break;
    }

    return (weight * metalRate * karatFactor) + makingCharges;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = "";
      
      if (imageFile) {
        setUploadingImage(true);
        imageUrl = await uploadImage(imageFile);
        setUploadingImage(false);
      }

      let metalRateValue: number | null = null;
      if (formData.rate === "gold") {
        metalRateValue = parseFloat(goldRate);
      } else if (formData.rate === "silver") {
        metalRateValue = parseFloat(silverRate);
      }

      if (metalRateValue === null || isNaN(metalRateValue)) {
        toast({
          title: "Error",
          description: "Please update Gold/Silver rates in Navigation bar",
          variant: "destructive",
        });
        return;
      }

      const itemData: any = {
        name: formData.name,
        category: formData.category,
        type: formData.type || null,
        karat: formData.karat || null,
        purity: formData.purity || null,
        weight: parseFloat(formData.weight),
        rate: metalRateValue,
        making_charges: parseFloat(formData.making_charges),
        description: formData.description || null,
        image_url: imageUrl || null,
        cut: formData.cut || null,
        clarity: formData.clarity || null,
        gemstone_type: formData.gemstone_type || null,
        carat_weight: formData.carat_weight ? parseFloat(formData.carat_weight) : null,
        gender: formData.gender || null,
        occasion: formData.occasion || null,
      };

      const { error } = await supabase.from("jewellery_items").insert(itemData);

      if (error) throw error;

      const metalRate = formData.rate === "gold" ? parseFloat(goldRate) : parseFloat(silverRate);
      const finalPrice = metalRate !== null ? calculatePrice(metalRate) : 0;

      toast({
        title: "Success! ✅",
        description: `${formData.name} added successfully. Final Price: ₹${finalPrice.toLocaleString("en-IN")}`,
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        type: "",
        karat: "",
        purity: "",
        weight: "",
        rate: "",
        making_charges: "",
        description: "",
        cut: "",
        clarity: "",
        gemstone_type: "",
        carat_weight: "",
        gender: "",
        occasion: "",
      });
      setImageFile(null);
      setImagePreview("");
    } catch (error: any) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-serif mb-8 text-center">Admin Dashboard</h1>
            <Button asChild>
              <Link to="/analytics">Analytics</Link>
            </Button>
            
            {/* === Gold/Silver Rates Integration Start === */}
            <section className="mb-12 p-6 border rounded-lg shadow-md bg-white max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Update Metal Rates</h2>
              {loadingRates ? (
                <p>Loading current rates...</p>
              ) : (
                <>
                  <div className="mb-4">
                    <Label htmlFor="goldRate">Gold Rate (₹ per gram)</Label>
                    <Input
                      id="goldRate"
                      type="number"
                      step="0.01"
                      value={goldRate}
                      onChange={(e) => setGoldRate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="silverRate">Silver Rate (₹ per gram)</Label>
                    <Input
                      id="silverRate"
                      type="number"
                      step="0.01"
                      value={silverRate}
                      onChange={(e) => setSilverRate(e.target.value)}
                      required
                    />
                  </div>

                  <Button onClick={handleUpdateRates} disabled={updatingRates}>
                    {updatingRates ? "Updating..." : "Update Rates"}
                  </Button>
                </>
              )}
                <div className="mb-4">
                  <Label htmlFor="diamondRate">Diamond Rate (₹ per gram)</Label>
                  <Input
                    id="diamondRate"
                    type="number"
                    step="0.01"
                    value={diamondRate}
                    onChange={(e) => setDiamondRate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="gemstoneRate">Gemstone Rate (₹ per gram)</Label>
                  <Input
                    id="gemstoneRate"
                    type="number"
                    step="0.01"
                    value={gemstoneRate}
                    onChange={(e) => setGemstoneRate(e.target.value)}
                    required
                  />
                </div>
              </section>
            {/* === Gold/Silver Rates Integration End === */}

            <Card>
              <CardHeader>
                <CardTitle>Add New Jewellery Item</CardTitle>
                <CardDescription>
                  Fill in the details below to add a new item to your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., 22K Gold Necklace"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={handleCategoryChange} value={formData.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Silver">Silver</SelectItem>
                        <SelectItem value="Diamond">Diamond</SelectItem>
                        <SelectItem value="Gemstone">Gemstone</SelectItem>
                        <SelectItem value="Bridal">Bridal</SelectItem>
                        <SelectItem value="New Arrival">New Arrival</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
 
                  {formData.category === "Silver" && (
                    <div className="space-y-2">
                      <Label htmlFor="purity">Purity</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, purity: value })} value={formData.purity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="92.5% Sterling Silver">92.5% Sterling Silver</SelectItem>
                          <SelectItem value="99.9% Fine Silver">99.9% Fine Silver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.category === "Gemstone" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gemstone_type">Gemstone Type</Label>
                          <Select onValueChange={(value) => setFormData({ ...formData, gemstone_type: value })} value={formData.gemstone_type}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gemstone type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ruby">Ruby</SelectItem>
                              <SelectItem value="Emerald">Emerald</SelectItem>
                              <SelectItem value="Sapphire">Sapphire</SelectItem>
                              <SelectItem value="Topaz">Topaz</SelectItem>
                              <SelectItem value="Amethyst">Amethyst</SelectItem>
                              <SelectItem value="Pearl">Pearl</SelectItem>
                              <SelectItem value="Opal">Opal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carat_weight">Carat Weight</Label>
                          <Input
                            id="carat_weight"
                            name="carat_weight"
                            type="number"
                            step="0.01"
                            value={formData.carat_weight}
                            onChange={handleInputChange}
                            placeholder="e.g., 2.5"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cut">Cut</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, cut: value })} value={formData.cut}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Brilliant">Brilliant</SelectItem>
                            <SelectItem value="Emerald">Emerald</SelectItem>
                            <SelectItem value="Princess">Princess</SelectItem>
                            <SelectItem value="Oval">Oval</SelectItem>
                            <SelectItem value="Pear">Pear</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {formData.category === "Diamond" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cut">Cut</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, cut: value })} value={formData.cut}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Very Good">Very Good</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clarity">Clarity</Label>
                        <Select onValueChange={(value) => setFormData({ ...formData, clarity: value })} value={formData.clarity}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select clarity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IF">IF</SelectItem>
                            <SelectItem value="VVS1">VVS1</SelectItem>
                            <SelectItem value="VVS2">VVS2</SelectItem>
                            <SelectItem value="VS1">VS1</SelectItem>
                            <SelectItem value="VS2">VS2</SelectItem>
                            <SelectItem value="SI1">SI1</SelectItem>
                            <SelectItem value="SI2">SI2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
 
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select onValueChange={handleTypeChange} value={formData.type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="karat">Karat</Label>
                      <Input
                        id="karat"
                        name="karat"
                        value={formData.karat}
                        onChange={handleInputChange}
                        placeholder="e.g., 22K, 24K"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (grams) *</Label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        step="0.01"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g., 15.5"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate per gram (₹) *</Label>
                      <Select onValueChange={handleMetalChange} value={formData.rate}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select metal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="making_charges">Making Charges (₹) *</Label>
                      <Input
                        id="making_charges"
                        name="making_charges"
                        type="number"
                        step="0.01"
                        value={formData.making_charges}
                        onChange={handleInputChange}
                        placeholder="e.g., 4000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, gender: value })} value={formData.gender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Women">Women</SelectItem>
                          <SelectItem value="Men">Men</SelectItem>
                          <SelectItem value="Unisex">Unisex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occasion">Occasion</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, occasion: value })} value={formData.occasion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wedding">Wedding</SelectItem>
                          <SelectItem value="Engagement">Engagement</SelectItem>
                          <SelectItem value="Anniversary">Anniversary</SelectItem>
                          <SelectItem value="Festive">Festive</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.weight && formData.rate && formData.making_charges && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Calculated Final Price:</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{calculatePrice(formData.rate === "gold" ? parseFloat(goldRate) : parseFloat(silverRate)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Add a detailed description of the item"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                      {imagePreview && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting || uploadingImage}
                  >
                    {uploadingImage ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-pulse" />
                        Uploading Image...
                      </>
                    ) : submitting ? (
                      <>
                        <span className="mr-2"><LoadingSpinner /></span>
                        Adding Item...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Add Item
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

