import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gem, ShieldCheck, Ruler } from "lucide-react"

const SizeGuide = () => {
  return (
    <div className="container mx-auto py-10">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <div className="flex justify-center items-center gap-4">
          <img src="/src/assets/logo.png" alt="Guruprasad Jewellers Logo" className="h-24" />
          <h1 className="text-4xl font-bold mb-4">Jewellery Size Guide</h1>
        </div>
        <p className="text-muted-foreground">Find your perfect fit with our comprehensive size guide.</p>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Introduction
          </CardTitle>
          <CardDescription>Why accurate jewellery sizing is important.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Accurate jewellery sizing is essential to ensure comfort, proper fit, and the best look for your pieces. Wearing the right size prevents discomfort, loss, or damage to jewellery. Common jewellery types requiring precise sizing include rings, bangles, bracelets, necklaces, and earrings.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            How to Measure Ring Size
          </CardTitle>
          <CardDescription>Find your perfect ring size.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Measure the inner diameter of an existing ring by placing it on a ruler and measuring straight across inside the band.</p>
          <p>Alternatively, wrap a strip of paper or a piece of string around the base of your finger, mark where it overlaps, and measure the length with a ruler to find your finger circumference.</p>
          <p>For best accuracy, measure at the end of the day when fingers tend to be largest, and ensure the finger is at a normal temperature.</p>
          <p>Use the ring size chart below to convert measurements to Indian and international sizes.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            How to Measure Bangles and Bracelets
          </CardTitle>
          <CardDescription>Determine your bangle and bracelet size.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Wrap a soft measuring tape or string around your wrist to find its circumference.</p>
          <p>To measure a bangle, use a ruler to measure the inner diameter across the widest point.</p>
          <p>Refer to size charts to find your ideal bangle or bracelet size in centimeters or inches.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            How to Measure Necklace Length
          </CardTitle>
          <CardDescription>Select the right necklace length for your style.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Necklace lengths vary by style: choker (14-16 inches), princess (18 inches), matinee (20-24 inches), and others.</p>
          <p>Choose the length based on your neck size or the desired drop of the necklace.</p>
          <p>Use images showing necklace length placement for visual reference.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Earrings Size Guide
          </CardTitle>
          <CardDescription>Choosing the perfect earring size.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Earrings come in various styles and sizes; measure drop length or diameter for hoops.</p>
          <p>Choose sizes based on personal comfort and style preference.</p>
        </CardContent>
      </Card>

      {/* <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Visual Aids
          </CardTitle>
          <CardDescription>Diagrams and images for accurate measuring.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Include diagrams illustrating how to measure finger circumference with string or paper.</p>
          <p>Show images of measuring tools like rulers and tape measures.</p>
          <p>Provide clear size charts for rings, bangles, bracelets, and necklace lengths.</p>
          <p>Display pictures demonstrating necklace lengths and common jewellery sizes.</p>
        </CardContent>
      </Card> */}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Additional Tips
          </CardTitle>
          <CardDescription>Final recommendations for accurate sizing.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Always double-check your measurements before purchasing.</p>
          <p>Know your shop’s return or exchange policy if sizes don’t fit perfectly.</p>
          <p>When unsure, visit a professional jeweller for precise measurement.</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default SizeGuide;