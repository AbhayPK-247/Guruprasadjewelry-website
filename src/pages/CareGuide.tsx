import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gem, ShieldCheck } from "lucide-react"

const CareGuide = () => {
  return (
    <div className="container mx-auto py-10">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <div className="flex justify-center items-center gap-4">
          <img src="/src/assets/logo.png" alt="Guruprasad Jewellers Logo" className="h-24" />
          <h1 className="text-4xl font-bold mb-4">Jewellery Care Guide</h1>
        </div>
        <p className="text-muted-foreground">Keep your precious pieces sparkling with our expert tips and best practices.</p>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Introduction
          </CardTitle>
          <CardDescription>Learn why proper jewellery care is essential.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>At Guruprasad Jewellers, we believe that jewellery is more than just adornment—it's a timeless expression of beauty and sentiment. Caring for your jewellery properly ensures that each piece retains its brilliance, stays damage-free, and becomes a cherished heirloom for generations to come. This guide offers you expert tips and best practices to protect your valuable investments and keep your favourite pieces sparkling as brightly as the day you bought them.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            General Care Tips
          </CardTitle>
          <CardDescription>Essential tips for everyday jewellery care.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Remove jewellery before swimming, exercising, or doing household chores to prevent exposure to chemicals and physical damage.</li>
            <li>Avoid direct contact with perfumes, lotions, hairspray, and makeup, which can dull and damage finishes.</li>
            <li>Put jewellery on last when getting dressed, and remove it first when undressing to minimize accidental snags.</li>
            <li>Always handle jewellery with clean, dry hands to avoid oil and dirt buildup.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Cleaning Instructions
          </CardTitle>
          <CardDescription>Step-by-step instructions for cleaning your jewellery.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Use mild soap and warm water to gently clean gold and silver pieces. Avoid soaking delicate stones like pearls.</li>
            <li>Dry and polish with a soft, non-abrasive cloth such as microfiber or specialized jewellery cloths.</li>
            <li>Do not use harsh chemicals or abrasive materials like toothpaste and paper towels that can scratch or wear away finishes.</li>
            <li>For gemstones, use cleaning solutions suited to their specific hardness and sensitivity; research the type before cleaning.</li>
            <li>Pearls require delicate dusting with a soft cloth only; never soak them in water or cleaners.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Storage Guidelines
          </CardTitle>
          <CardDescription>How to properly store your jewellery to prevent damage.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Store each piece separately in soft pouches or lined jewellery boxes to prevent scratching.</li>
            <li>Keep jewellery away from direct sunlight, excessive heat, and moisture, which can cause tarnish and damage.</li>
            <li>Use anti-tarnish strips or cloths for silver to slow down oxidation and keep it shiny.</li>
            <li>Avoid storing gold and silver together in the same pouch or box to prevent chemical reactions and scratches.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Handling & Maintenance
          </CardTitle>
          <CardDescription>Tips for handling and maintaining your jewellery.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Regularly inspect clasps, prongs, and settings for signs of wear or loose stones to prevent loss.</li>
            <li>Avoid pulling or yanking on chains, bracelets, or earrings as it can cause breaks or loosening.</li>
            <li>Schedule professional check-ups and cleanings every 6 to 12 months to maintain integrity and shine.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Material-Specific Care
          </CardTitle>
          <CardDescription>Care instructions for different jewellery materials.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li><strong>Gold:</strong> Store in a dry place and avoid impacts that can dent or scratch the metal.</li>
            <li><strong>Silver:</strong> Protect from humidity by storing in airtight containers with anti-tarnish cloths or strips.</li>
            <li><strong>Diamonds:</strong> Clean regularly to prevent greasy buildup, and consider professional cleaning for tough grime.</li>
            <li><strong>Gemstones:</strong> Handle with care—avoid exposure to heat, chemicals, and impacts that could cause damage.</li>
            <li><strong>Pearls:</strong> Store wrapped in a soft cloth away from harder jewellery to avoid scratching the delicate surface.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            What to Avoid
          </CardTitle>
          <CardDescription>Common things to avoid to protect your jewellery.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li>Extreme temperatures, humidity, and prolonged exposure to direct sunlight can damage metals and gemstones.</li>
            <li>Contact with harsh chemicals, rough or abrasive surfaces, and wooden surfaces may cause scratches or chemical reactions.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Professional Services
          </CardTitle>
          <CardDescription>When and why to seek professional jewellery services.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Have your jewellery professionally cleaned and inspected at least once a year to ensure optimal condition and to catch any issues early.</p>
          <p>Consider insuring valuable pieces to protect against loss, theft, or damage.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            FAQs
          </CardTitle>
          <CardDescription>Frequently asked questions about jewellery care.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside">
            <li><strong>How often should jewellery be cleaned?</strong> Clean regularly at home and have it professionally cleaned annually.</li>
            <li><strong>When to seek professional help?</strong> If you notice loose stones, broken clasps, or tarnish that can’t be cleaned at home.</li>
            <li><strong>What to do if jewellery is damaged or tarnished?</strong> Stop using it and consult a professional jeweller for repairs and polishing.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Quick Dos & Don'ts Section
          </CardTitle>
          <CardDescription>A quick summary of what to do and what not to do.</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Do:</strong> Clean your jewellery regularly, store pieces separately, and remove them before engaging in physical or rough activities.</p>
          <p><strong>Don’t:</strong> Use harsh cleaners, expose your jewellery to chemicals, or wear it during sports or heavy manual work.</p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Gold
          </CardTitle>
          <CardDescription>Care instructions for gold jewellery.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Gold is a precious metal valued for its beauty, rarity, and durability. The purity of gold is measured in karats, with 24K being 100% pure gold. Common purities used in jewellery include 18K (75% gold), 14K (58.3%), and 10K (41.7%). Higher karat gold is softer and more prone to scratches, so alloys are added to improve strength and color variations like white, rose, or yellow gold.</p>
          <p>Gold is hypoallergenic and resistant to tarnish, making it ideal for everyday wear. To maintain its shine, clean gold jewellery gently with mild soap and warm water, avoiding harsh chemicals and abrasive materials.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Silver
          </CardTitle>
          <CardDescription>Care instructions for silver jewellery.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Silver jewellery is typically made from sterling silver, an alloy containing 92.5% pure silver and 7.5% other metals, usually copper, for added strength. Pure silver is too soft for practical use in most jewellery.</p>
          <p>Silver is known for its bright, shiny finish but can tarnish over time due to exposure to air and moisture. Proper storage away from humidity and regular cleaning with anti-tarnish cloths helps preserve its appearance. Some silver pieces may also be coated with rhodium to prevent tarnishing and enhance shine.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Diamonds
          </CardTitle>
          <CardDescription>Care instructions for diamond jewellery.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Diamonds are valued for their exceptional hardness and brilliance. They rank 10 on the Mohs hardness scale, making them the hardest natural material. Diamonds come in various cuts (round, princess, emerald, oval, etc.) that affect sparkle and appearance.</p>
          <p>Color and clarity are also important factors—most diamonds used in jewellery are near colorless with very few inclusions. Proper care involves regular professional cleaning and avoiding exposure to harsh chemicals or rough impacts that could damage settings.</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Gem className="w-5 h-5" />
            Gemstones
          </CardTitle>
          <CardDescription>Care instructions for gemstone jewellery.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Gemstones encompass a wide variety of natural minerals prized for their color and rarity. Common types include sapphires, rubies, emeralds, amethysts, and topaz. Each gemstone has unique characteristics such as hardness, color range, and care needs.</p>
          <p>For example, sapphires and rubies are very hard (9 on Mohs scale) and durable, while emeralds are softer and more prone to scratches. Some gemstones require special cleaning methods and should be protected from extreme heat and chemicals.</p>
          <p>Consult care guides specific to your gemstone type for optimal maintenance and longevity.</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default CareGuide;
