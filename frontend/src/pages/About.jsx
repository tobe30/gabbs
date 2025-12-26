import { Users, Target, Heart, Package, TrendingUp, Shield } from "lucide-react";

import aboutTeam from "../assets/gabbs-carousel.png";
import aboutWarehouse from "../assets/about-warehouse.jpg";
import aboutCustomers from "../assets/wmremove-transformed.jpeg";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
            About <span className="text-primary">Gabbs</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your trusted marketplace shop Nationwide.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Gabbs is more than just an ecommerce platform – it's a thriving community where
              businesses grow and customers find exceptional products. Our mission is to democratize
              online retail for everyone.
            </p>
            {/* <p className="text-lg text-muted-foreground leading-relaxed">
              Every seller is verified, every product is vetted, and every transaction is protected
              with cutting-edge security.
            </p> */}
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img src={aboutTeam} alt="Gabbs Team" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative overflow-hidden rounded-2xl shadow-xl order-2 md:order-1">
            <img src={aboutWarehouse} alt="Warehouse" className="w-full h-auto object-cover" />
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold mb-6">Quality & Reliability</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Behind every product is a commitment to excellence. Our logistics and quality control
              ensure top-tier delivery every time.
            </p>

            <div className="space-y-6">
              {[{
                icon: Package,
                title: "Verified Products",
                text: "Every item carefully inspected."
              },{
                icon: TrendingUp,
                title: "Fast Shipping",
                text: "Quick delivery to your doorstep."
              },{
                icon: Shield,
                title: "Secure Transactions",
                text: "Protected payments and buyer safety."
              }].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <item.icon className="w-7 h-7 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Customer First, Always</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Reliability, quality, and exceptional support — that's the Gabbs experience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From browsing to delivery, every step is designed for your comfort.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img src={aboutCustomers} alt="Customers" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Our Core Values</h2>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[{
              icon: Target,
              title: "Our Mission",
              text: "Empowering businesses and delighting customers."
            },{
              icon: Users,
              title: "Our Community",
              text: "Thousands of product & millions of buyers."
            },{
              icon: Heart,
              title: "Our Values",
              text: "Integrity, quality, and satisfaction."
            }].map((card, idx) => (
              <div key={idx} className="p-10 bg-card border rounded-2xl text-center shadow-sm hover:shadow-md transition">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <card.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                <p className="text-muted-foreground">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="bg-primary text-white rounded-2xl p-14 text-center shadow-lg">
          <h2 className="text-4xl font-bold mb-4">Join the Gabbs Family</h2>
          <p className="text-xl opacity-90 mb-8">Whether you're a seller or a buyer, we welcome you.</p>

          <a
            href="/products"
            className="px-10 py-4 bg-white text-primary font-semibold rounded-xl shadow hover:bg-white/90 transition"
          >
            Start Shopping
          </a>
        </div>
      </section>

    </div>
  );
}