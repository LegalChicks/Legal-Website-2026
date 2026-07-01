import React, { useState, useEffect, useRef } from "react";
import { api, type PoultryRecord } from "@/lib/api";
import img1 from "@assets/40b2c192-91cc-43b3-a351-eb3ffea7f2f8_1782832325228.jpg";
import img2 from "@assets/0fa9fbb4-9794-4dba-86a6-86594d1b8f53_1782832325224.jpg";
import img3 from "@assets/6da2d5e3-0616-4100-8117-fa7751001151_1782832325225.jpg";
import img4 from "@assets/9a7a2840-a28f-4b38-accc-9b594c9de93d_1782832325227.jpg";
import img5 from "@assets/de8c6c60-7f97-45c6-8ff3-e2c01c003148_1782832325240.jpg";
import img6 from "@assets/3164fd7e-7d0a-4cb3-9b22-3506486c1474_1782832325233.jpg";
import img7 from "@assets/20216283-c12e-4e2e-8895-fdfb1b507e8b_1782832325235.jpg";
import img8 from "@assets/00eaac43-8082-44ae-acea-2cc22fe8d3e5_1782832325223.jpg";
import img9 from "@assets/92bfc8ee7053481f5eca46085808dfbb0076cadf_1782832325231.png";
import img10 from "@assets/6fc3de17acfa4c65952b64d77058dc6d7ecc1d96_1782832325226.png";
import img11 from "@assets/57d11aac2ec5435054b8fd17f3ccb1f6c1fbbab2_1782832325229.png";
import img12 from "@assets/55cbcdc465354cb00de0e076af7efb40c9b952f1_1782832325229.png";
import img13 from "@assets/88c989f6-266f-4777-8992-eb323696fb91_1782832325230.jpg";
import img14 from "@assets/a5b9e15cae9bde87323869ad3f23cf1bbb4e3987_1782832325236.png";
import img15 from "@assets/9771af34-1ded-4eb6-ba4b-174681d1a6b0_1782832325234.jpg";
import img16 from "@assets/1971a8f8-7231-4875-a04c-b90c96096e1a_1782832325232.jpg";
import img17 from "@assets/7013eab1-27ec-416c-847c-856a80d2f874_1782832325234.jpg";
import img19 from "@assets/d5pbEqGBFLFzFD_KLDofINMBavt1BFKGFPtudHmrOqxTL7bU23SplYmD9SBvr9_1782832325238.jpg";
import farmLogo from "@assets/Legal_Chicks_Farm_Logo_1782840193981.png";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ShieldCheck, 
  FileCheck, 
  Leaf, 
  ActivitySquare,
  Egg,
  Shield,
  Dna,
  RefreshCcw,
  CheckCircle2,
  Menu,
  X,
  MessageCircle,
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Form Schema ---
const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required" }),
  product: z.string().min(1, { message: "Please select a product" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  location: z.string().min(5, { message: "Location/Delivery Notes required" }),
  message: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

// --- Components ---

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Our Story", href: "#story" },
    { name: "Why Trust Us", href: "#trust" },
    { name: "Products", href: "#products" },
    { name: "Gallery", href: "#gallery" },
    { name: "FAQs", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50 py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          <a href="#" className={`flex items-center gap-3 font-serif text-2xl font-bold tracking-tight ${isScrolled ? "text-primary" : "text-white"}`}>
            <img src={farmLogo} alt="Legal Chicks Poultry Farm Logo" className="w-10 h-10 object-contain" />
            LEGAL CHICKS
          </a>
          <a
            href="/login"
            className={`ml-[52px] text-xs font-semibold tracking-wide px-3 py-0.5 rounded-full border transition-colors ${
              isScrolled
                ? "border-primary/50 text-primary hover:bg-primary hover:text-white"
                : "border-white/50 text-white/80 hover:bg-white/20 hover:text-white"
            }`}
          >
            Member Portal
          </a>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-medium transition-colors hover:text-secondary ${isScrolled ? "text-foreground/80" : "text-white/90"}`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold rounded-full px-6">
            <a href="#contact">Order Now</a>
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} className={isScrolled ? "text-primary" : "text-white"} /> : <Menu size={24} className={isScrolled ? "text-primary" : "text-white"} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b shadow-lg overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50"
                >
                  {link.name}
                </a>
              ))}
              <Button asChild className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Order Now</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Hero() {
  return (
    <section 
      className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden bg-primary text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${img9})` }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3a0d0d]/95 via-[#5a1919]/80 to-[#2a0808]/90 z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay z-0" />
      
      <div className="container relative z-10 mx-auto px-4 md:px-6 py-12 md:py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            Cagayan Valley's Premier RIR Hub
          </Badge>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold max-w-5xl leading-[1.1] mb-6"
        >
          Purebred Quality. <br />
          <span className="italic text-secondary font-light">Zero Compromise.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed font-light"
        >
          We raise premium, chemical-free Rhode Island Reds in Solana — thicker shells, richer yolks, and the legendary "Dark Mahogany" genetics your flock deserves.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button size="lg" asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-14 px-8 rounded-full text-base">
            <a href="#contact">Secure Your Fresh Order</a>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 h-14 px-8 rounded-full text-base backdrop-blur-sm bg-transparent">
            <a href="#story">Discover Our Heritage</a>
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-t border-white/10 pt-8 w-full max-w-4xl"
        >
          {[
            { label: "100% Chemical-Free", icon: <Leaf className="w-5 h-5 text-secondary" /> },
            { label: "DTI & RSBSA Registered", icon: <ShieldCheck className="w-5 h-5 text-secondary" /> },
            { label: "DA-BAI GAHP Compliant", icon: <FileCheck className="w-5 h-5 text-secondary" /> }
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-center md:justify-start gap-3 text-white/90 bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
              {stat.icon}
              <span className="font-medium text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-24 fill-background">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,116.8,188.74,103.4Z"></path>
        </svg>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section id="story" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center group">
              <img src={img1} alt="Legal Chicks Poultry Farm flock" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute bottom-6 left-6 z-10">
                <Badge className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm">
                  Est. 2022 — Solana, Cagayan Valley
                </Badge>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-primary"></div>
              <span className="text-primary font-bold tracking-widest text-sm uppercase">Our Origin</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
              From Corporate Precision to <span className="text-primary">Agricultural Excellence</span>
            </h2>
            
            <div className="space-y-6 text-lg text-foreground/80 font-light leading-relaxed">
              <p>
                Froilan Dave A. Lingan left corporate banking to build what the Cagayan Valley deserved — a cleaner, scientifically-managed premium poultry operation. 
              </p>
              <p>
                LCPF isn't a backyard project. It's a data-driven agricultural enterprise applying institutional rigor to produce eggs and birds that commercial farms simply can't match. We believe that true quality comes from strict protocols, not marketing claims.
              </p>
            </div>

            <blockquote className="mt-8 p-6 bg-primary/5 border-l-4 border-secondary rounded-r-2xl italic text-xl font-serif text-primary">
              "Our mission is to evolve from One Coop to a Community — building the foundation for Solana to become the Backyard Egg Multiplier Capital of the Country."
            </blockquote>

            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6 font-serif">Milestones</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  { year: "2022", event: "Founded" },
                  { year: "2023", event: "First 100-head flock" },
                  { year: "2024", event: "DTI & RSBSA Registration" },
                  { year: "2025", event: "Farm OS integration" },
                  { year: "2026", event: "Community expansion launch" },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-secondary bg-background group-hover:bg-secondary transition-colors duration-300 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] bg-white p-4 rounded-xl shadow-sm border border-border group-hover:border-secondary/50 transition-colors">
                      <div className="font-bold text-primary">{item.year}</div>
                      <div className="text-sm text-foreground/70 mt-1">{item.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const cards = [
    {
      icon: <Shield className="w-10 h-10 text-secondary" />,
      title: "Zero Walk-In Biosecurity",
      desc: "Our farm operates under military-grade perimeter control. Walk-ins introduce Avian Influenza (AI) and Newcastle Disease (ND). All transactions happen at designated secure hand-off points. Your birds and eggs come from a clean, disease-free environment. Period."
    },
    {
      icon: <FileCheck className="w-10 h-10 text-secondary" />,
      title: "Officially Registered & Compliant",
      desc: "Fully registered with the Department of Trade and Industry (DTI) and the Registry System for Basic Sectors in Agriculture (RSBSA). Every operation adheres strictly to the DA-BAI Good Animal Husbandry Practices (GAHP) standards."
    },
    {
      icon: <Leaf className="w-10 h-10 text-secondary" />,
      title: "100% Chemical-Free Diet",
      desc: "Raised on a proprietary natural diet: Fermented Plant Juice (FPJ), Oriental Herbal Nutrients (OHN), and premium feeds — zero antibiotics, zero growth hormones. The result: naturally fortified eggs with visibly richer yolks and thicker shells."
    },
    {
      icon: <ActivitySquare className="w-10 h-10 text-secondary" />,
      title: "Data-Driven Farm OS",
      desc: "Every egg laid, every gram of feed consumed, every health indicator is meticulously logged in our custom Farm OS. We can trace the lineage, health, and production record of every bird on the farm. This is precision agriculture, not guesswork."
    }
  ];

  return (
    <section id="trust" className="py-24 md:py-32 bg-[#3a0d0d] text-white relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.08] z-0 mix-blend-overlay" style={{ backgroundImage: `url(${img2})` }} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-5 z-0" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 font-serif"
          >
            Why 100% of Our Clients Trust LCPF
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 font-light"
          >
            We don't make marketing claims — we operate under strict, verifiable protocols. Every investment in LCPF is an investment in peace of mind.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm"
            >
              <div className="bg-primary/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif text-white">{card.title}</h3>
              <p className="text-white/70 leading-relaxed font-light">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Advantage() {
  return (
    <>
      <section 
        className="relative w-full h-[400px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${img6})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#3a0d0d] via-[#3a0d0d]/80 to-transparent"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <blockquote className="text-3xl md:text-5xl font-serif text-white font-bold leading-tight mb-6">
              "Every Dark Mahogany bird is a legacy — raised with precision, built to last."
            </blockquote>
            <p className="text-secondary font-medium tracking-wide uppercase">Froilan Dave A. Lingan, Founder — LCPF</p>
          </div>
        </div>
      </section>

    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-primary border-primary">The RIR Advantage</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Not All Chickens Are <span className="text-primary font-serif italic">Created Equal</span>
          </h2>
          <p className="text-lg text-foreground/80 font-light">
            The Rhode Island Red "Dark Mahogany" strain is the gold standard of dual-purpose poultry — and we've mastered its genetics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { icon: <Egg />, title: "Egg Production", desc: "Consistently lays 250–300 eggs per year per hen. Outperforms commercial layers in shell thickness and yolk nutrition." },
              { icon: <Shield />, title: "Disease Resistance", desc: "Naturally hardier than commercial hybrid breeds. Thrives in Philippine tropical conditions without chemical dependency." },
              { icon: <Dna />, title: "Genetic Integrity", desc: "Carefully selected for dominant 'Dark Mahogany' coloring, body mass, and productivity — maintaining a pure bloodline." },
              { icon: <RefreshCcw />, title: "Dual-Purpose Value", desc: "Excellent egg layer AND premium table bird. Maximum return on investment for backyard and commercial raisers alike." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/20 text-primary flex items-center justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-foreground">{feature.title}</h4>
                <p className="text-foreground/70 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl border border-border p-6 md:p-8 overflow-hidden"
          >
            <h3 className="text-2xl font-bold mb-6 font-serif text-primary text-center">LCPF Premium RIR <br/><span className="text-sm font-sans text-muted-foreground font-normal">vs. Commercial White Eggs</span></h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-4 font-bold text-foreground border-b border-border/50">Feature</th>
                    <th className="py-4 px-4 font-bold text-primary border-b border-border/50 bg-primary/5 rounded-tl-lg">LCPF Premium RIR</th>
                    <th className="py-4 px-4 font-bold text-muted-foreground border-b border-border/50">Commercial Eggs</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    ["Shell Thickness", "Exceptional / Hard to break", "Thin / Brittle"],
                    ["Yolk Color", "Deep Orange (Nutrient Dense)", "Pale Yellow"],
                    ["Chemical Residue", "Zero (100% Natural)", "High (Antibiotics/Hormones)"],
                    ["Omega-3 Content", "High", "Low"],
                    ["Feed Type", "Premium + Fermented Herbs", "Mass Commercial"],
                    ["Production Oversight", "Individual Bird Traceability", "Mass Flock Guesses"]
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground border-b border-border/30">{row[0]}</td>
                      <td className="py-4 px-4 font-semibold text-primary bg-primary/5 border-b border-border/30">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                          {row[1]}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground border-b border-border/30">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}

function Products() {
  const products = [
    {
      title: "Premium Brown Eggs",
      price: "₱360",
      unit: "tray (30 pieces)",
      badge: "Best Seller",
      desc: "Richer, darker yolks packed with Omega-3 fatty acids. Thicker shells that last longer. Raised chemical-free on herbal nutrients. The difference is visible from the first crack.",
      bullets: ["Visibly Richer Yolk Color", "Superior Shell Thickness", "Zero Chemical Residue", "Higher Omega-3 Content", "GAHP Certified Production"],
      cta: "Order a Tray",
      link: "https://wa.me/639369671213?text=Hi!%20I%27d%20like%20to%20order%20Premium%20Brown%20Eggs"
    },
    {
      title: "Pure RIR Day-Old Chicks",
      price: "₱100",
      unit: "head (Day-Old)",
      desc: "Fully B1B1 vaccinated before delivery. The perfect foundation for your own backyard multiplier farm. Dark Mahogany genetics mean superior disease resistance and productivity from day one.",
      bullets: ["B1B1 Vaccinated", "Dark Mahogany Bloodline", "High Disease Resistance", "Superior Production Genetics", "Expert After-Sales Support"],
      cta: "Order Chicks",
      link: "https://wa.me/639369671213?text=Hi!%20I%27d%20like%20to%20order%20Pure%20RIR%20Day-Old%20Chicks"
    },
    {
      title: "Premium Breeding Roosters",
      price: "₱549+",
      unit: "4–10 months old",
      desc: "Upgrade your entire flock's genetics in a single season. Our dominant, highly fertile Dark Mahogany roosters are proven performers. One LCPF rooster transforms your breeding outcomes.",
      bullets: ["Proven Genetic Dominance", "High Fertility Rate", "4–10 Months Age Options", "Health-Certified", "Immediate Impact on Flock Quality"],
      cta: "Inquire on Roosters",
      link: "https://wa.me/639369671213?text=Hi!%20I%27d%20like%20to%20inquire%20about%20Breeding%20Roosters"
    },
  ];

  return (
    <section id="products" className="py-24 md:py-32 bg-primary/5 relative">
      <div className="absolute inset-0 bg-cover bg-fixed bg-center opacity-[0.12] z-0" style={{ backgroundImage: `url(${img5})` }}></div>
      <div className="absolute inset-0 bg-white/70 z-0"></div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-primary">
            Premium Offerings — Direct from Farm to You
          </h2>
          <p className="text-lg text-foreground/80 font-light">
            No middlemen. No compromised handling. Just fresh, premium agriculture delivered straight from our biosecure facility to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col border-border/60 shadow-sm hover:shadow-xl hover:border-secondary/50 transition-all duration-300 relative group overflow-hidden bg-white">
                {product.badge && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-secondary text-secondary-foreground font-bold hover:bg-secondary">{product.badge}</Badge>
                  </div>
                )}
                
                {/* Decorative header bg */}
                <div className="h-32 bg-gradient-to-br from-primary/90 to-[#5a1919] relative">
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
                </div>

                <CardHeader className="relative -mt-16 bg-white mx-4 rounded-xl shadow-md p-5 border border-border/40">
                  <CardTitle className="text-xl font-bold text-primary font-serif leading-tight">{product.title}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{product.price}</span>
                    <span className="text-sm text-muted-foreground">/ {product.unit}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow pt-6">
                  <p className="text-sm text-foreground/80 mb-6 leading-relaxed">
                    {product.desc}
                  </p>
                  <ul className="space-y-2.5">
                    {product.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors h-12 rounded-xl" asChild>
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      {product.cta} <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const photos = [
    { src: img1,  label: "Our Growing Flock",               gridClass: "col-span-2 row-span-2" },
    { src: img2,  label: "Flock Feeding Time",              gridClass: "col-span-1" },
    { src: img3,  label: "Dark Mahogany Roosters",          gridClass: "col-span-1" },
    { src: img4,  label: "Biosecure Coop Exterior",         gridClass: "col-span-1" },
    { src: img5,  label: "Fresh Egg Harvest",               gridClass: "col-span-1" },
    { src: img6,  label: "Breeding Rooster — Free Range",   gridClass: "col-span-1" },
    { src: img7,  label: "Dark Mahogany Hen",               gridClass: "col-span-1" },
    { src: img8,  label: "RIR Hens at the Feeder",          gridClass: "col-span-1" },
    { src: img9,  label: "Mixed Flock — Open Range",        gridClass: "col-span-1" },
    { src: img10, label: "Hens in Coop",                    gridClass: "col-span-1" },
    { src: img11, label: "Growing Pullets",                 gridClass: "col-span-1" },
    { src: img12, label: "Day-Old Chicks in Brooder",       gridClass: "col-span-1" },
    { src: img13, label: "Fresh Day-Old Chicks",            gridClass: "col-span-1" },
    { src: img14, label: "RIR Chicks — Ready for Pickup",   gridClass: "col-span-1" },
    { src: img15, label: "Brooder — Warm & Safe",           gridClass: "col-span-1" },
    { src: img16, label: "Chicks Under Heat Lamp",          gridClass: "col-span-1" },
    { src: img17, label: "Roosters in Secure Pen",          gridClass: "col-span-1" },
    { src: img19, label: "Heritage Black Flock",            gridClass: "col-span-1" },
  ];

  return (
    <section id="gallery" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-primary">Radical Transparency — See the Farm</h2>
          <p className="text-lg text-foreground/80 font-light">
            No stock photos. No borrowed images. Just our actual Solana operations, healthy flocks, and clean facilities.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 auto-rows-[180px]">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`relative rounded-2xl overflow-hidden shadow-md group bg-[#1a0808] ${photo.gridClass}`}
            >
              <img
                src={photo.src}
                alt={photo.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium text-xs md:text-sm tracking-wide drop-shadow-md">{photo.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Why do you have a strict No Walk-In policy?",
      a: "Our farm operates under a strict biosecurity protocol to protect our flock. Walk-ins are the primary vector for introducing Avian Influenza (AI) and Newcastle Disease (ND). By eliminating foot traffic, we guarantee that the birds and eggs you receive come from a 100% clean, disease-free environment."
    },
    {
      q: "What makes your eggs worth ₱360 per tray?",
      a: "You're paying for verifiable quality. Commercial eggs are mass-produced with thin shells, pale yolks, and potential chemical residues. LCPF eggs feature visibly richer, nutrient-dense deep orange yolks and superior shell thickness, achieved through a 100% natural, chemical-free herbal diet. It's a premium product for families who prioritize health."
    },
    {
      q: "Do you use antibiotics or growth hormones?",
      a: "Absolutely not. We rely on a proprietary natural diet including Fermented Plant Juice (FPJ) and Oriental Herbal Nutrients (OHN). We comply strictly with GAHP standards. The only medical intervention we use is the DA-approved B1B1 vaccination for our chicks to ensure a strong, healthy start."
    },
    {
      q: "How do I know your chicks are healthy?",
      a: "Every chick is B1B1 vaccinated before leaving our facility. Furthermore, our custom Farm OS tracks the health, lineage, and productivity of our breeding stock. We maintain 100% traceability, meaning your chicks come from proven, robust parent lines."
    },
    {
      q: "Can I visit the farm?",
      a: "Due to our No Walk-In biosecurity policy, physical tours are not permitted. However, we believe in radical transparency. We are happy to provide live video tours and recent farm photos via WhatsApp to verify our operations and facilities."
    },
    {
      q: "What areas do you deliver to / where do I pick up?",
      a: "Our primary pick-up point is Centro Northeast, Solana, Cagayan Valley. We can arrange meetups and logistics for clients within the broader Cagayan Valley region. Contact us on WhatsApp to discuss the best delivery arrangement for your order."
    },
    {
      q: "How do I start my own backyard RIR farm with LCPF stock?",
      a: "The best start is purchasing our B1B1 vaccinated day-old chicks alongside a proven breeding rooster (4-10 months old) to immediately upgrade your flock's genetics. We don't just sell birds; we offer expert after-sales support and community mentorship to ensure your success."
    }
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif text-primary">Your Questions, Answered Honestly</h2>
          <p className="text-lg text-foreground/80 font-light">
            Clear, straightforward answers about our operations, products, and standards.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-white rounded-3xl p-6 shadow-sm border border-border">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b-border/40 last:border-0 px-2 py-1">
              <AccordionTrigger className="text-left font-bold text-lg hover:text-secondary hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 text-base leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Contact() {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: "",
      product: "",
      quantity: "",
      location: "",
      message: "",
    },
  });

  function onSubmit(values: OrderFormValues) {
    const text = `Hi Legal Chicks! I'd like to place an order/inquiry:\n\n*Name:* ${values.fullName}\n*Product:* ${values.product}\n*Quantity:* ${values.quantity}\n*Location/Notes:* ${values.location}\n*Message:* ${values.message || "N/A"}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/639369671213?text=${encoded}`, '_blank');
  }

  return (
    <section id="contact" className="py-24 md:py-32 bg-[#3a0d0d] text-white relative border-t-4 border-secondary bg-cover bg-center" style={{ backgroundImage: `url(${img1})` }}>
      <div className="absolute inset-0 bg-[#3a0d0d]/90 z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 mix-blend-overlay z-0" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif text-white">Secure Your Premium Batch</h2>
            <p className="text-xl text-secondary mb-12 font-light italic">Direct. No middlemen. 100% Farm-to-Table.</p>

            <div className="space-y-8">
              <a href="https://wa.me/639369671213" target="_blank" rel="noopener noreferrer" className="flex items-start gap-5 group p-4 -ml-4 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="bg-secondary text-primary p-4 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-secondary/20">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm text-white/60 font-medium mb-1 uppercase tracking-wider">WhatsApp Direct Line</h4>
                  <p className="text-3xl font-bold text-white group-hover:text-secondary transition-colors">Chat with Us</p>
                </div>
              </a>

              <div className="flex items-start gap-5 p-4 -ml-4">
                <div className="bg-white/10 text-white p-4 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm text-white/60 font-medium mb-1 uppercase tracking-wider">Secure Pick-up Point</h4>
                  <p className="text-lg font-medium text-white">Centro Northeast, Solana<br/><span className="text-white/80 font-light">Cagayan Valley, Philippines</span></p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8">
                <p className="text-white/60 mb-2">Find us on Facebook:</p>
                <p className="text-xl font-bold text-white mb-8">Search "Legal Chicks Poultry Farm"</p>
                
                <div className="inline-block border border-secondary/30 bg-secondary/10 px-6 py-4 rounded-xl backdrop-blur-sm">
                  <p className="font-serif text-xl text-secondary italic">"Laking alaga, laking malusog."</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-2xl text-foreground">
            <h3 className="text-2xl font-bold mb-6 font-serif">Order Inquiry Form</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Dela Cruz" {...field} className="h-12 bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Product Interest</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-muted/30">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Premium Brown Eggs">Premium Brown Eggs (₱360/tray)</SelectItem>
                          <SelectItem value="Pure RIR Chicks">Pure RIR Day-Old Chicks (₱100/head)</SelectItem>
                          <SelectItem value="Breeding Rooster">Premium Breeding Rooster (₱549+)</SelectItem>

                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-foreground/80">Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 5 trays / 50 chicks" {...field} className="h-12 bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-foreground/80">Location / Meetup</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Municipality" {...field} className="h-12 bg-muted/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any specific requirements or questions?" {...field} className="resize-none min-h-[100px] bg-muted/30" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 rounded-xl mt-4">
                  Send Inquiry via WhatsApp
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofOfQuality() {
  return (
    <section className="relative w-full h-[500px] bg-cover bg-fixed bg-center flex items-center justify-center" style={{ backgroundImage: `url(${img5})` }}>
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          <div>
            <p className="text-4xl md:text-6xl font-bold text-secondary font-serif mb-2">250–300</p>
            <p className="text-white/90 text-sm md:text-base tracking-wide uppercase">Eggs per hen per year</p>
          </div>
          <div>
            <p className="text-4xl md:text-6xl font-bold text-secondary font-serif mb-2">₱360</p>
            <p className="text-white/90 text-sm md:text-base tracking-wide uppercase">Per premium tray</p>
          </div>
          <div>
            <p className="text-4xl md:text-6xl font-bold text-secondary font-serif mb-2">100%</p>
            <p className="text-white/90 text-sm md:text-base tracking-wide uppercase">Chemical-free diet</p>
          </div>
          <div>
            <p className="text-4xl md:text-6xl font-bold text-secondary font-serif mb-2">0</p>
            <p className="text-white/90 text-sm md:text-base tracking-wide uppercase">Antibiotic use</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChicksBrooderBanner() {
  return (
    <section className="relative w-full h-[350px] bg-cover bg-fixed bg-center flex items-center justify-center text-center" style={{ backgroundImage: `url(${img15})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a0d0d]/80 to-[#2a0808]/90 z-0" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <h2 className="text-4xl md:text-5xl font-serif italic text-white font-bold mb-4">"From Day One, Every Chick Matters."</h2>
        <p className="text-white/80 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Fully vaccinated, closely monitored, and raised in stress-free brooder environments.
        </p>
      </div>
    </section>
  );
}

function FarmRecords() {
  const [records, setRecords] = useState<PoultryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.records
      .listPublic()
      .then(({ records }) => setRecords(records))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && records.length === 0) return null;

  const totalBirds = records.reduce((s, r) => s + (r.quantity ?? 0), 0);
  const totalEggs = records.reduce((s, r) => s + (r.eggProduction ?? 0), 0);
  const healthyBatches = records.filter((r) =>
    r.healthStatus?.toLowerCase().includes("healthy"),
  ).length;

  const healthColor = (s: string | null) => {
    if (!s) return "bg-white/10 text-white/60";
    const l = s.toLowerCase();
    if (l.includes("healthy")) return "bg-green-500/20 text-green-300";
    if (l.includes("sick") || l.includes("quarantined"))
      return "bg-red-500/20 text-red-300";
    if (l.includes("monitoring")) return "bg-amber-500/20 text-amber-300";
    return "bg-blue-500/20 text-blue-300";
  };

  return (
    <section id="farm-records" className="py-24 md:py-32 bg-[#2a0808] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">Live Farm Data</Badge>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Our Flock, Openly Tracked
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-light">
            Every batch we raise is logged and published here — no secrets, just transparency from farm to your table.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-secondary/40 border-t-secondary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
              {[
                { label: "Total Batches", value: records.length },
                { label: "Total Birds", value: totalBirds.toLocaleString() },
                { label: "Eggs Produced", value: totalEggs.toLocaleString() },
              ].map((s) => (
                <div key={s.label} className="text-center bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-3xl font-bold text-secondary font-serif">{s.value}</p>
                  <p className="text-white/50 text-xs mt-1 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Records table */}
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      {["Batch", "Breed", "Birds", "Age (wks)", "Health", "Eggs", "Avg Wt", "Logged"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/40 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                          i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{r.batchName}</td>
                        <td className="px-4 py-3 text-white/60 whitespace-nowrap">{r.breed || r.birdType || "RIR"}</td>
                        <td className="px-4 py-3 text-white/80 text-center">{r.quantity ?? "—"}</td>
                        <td className="px-4 py-3 text-white/60 text-center">{r.ageWeeks ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${healthColor(r.healthStatus)}`}>
                            {r.healthStatus || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white/80 text-center">{r.eggProduction ?? "—"}</td>
                        <td className="px-4 py-3 text-white/60 text-center">{r.avgWeightKg ? `${r.avgWeightKg} kg` : "—"}</td>
                        <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-center text-white/30 text-xs mt-6">
              Records are updated in real time by the LCPF farm team · No authentication required to view
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#2a0808] pt-16 pb-8 text-white/80 border-t border-white/10 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <a href="#" className="font-serif text-2xl font-bold tracking-tight text-white mb-4 block">
              LEGAL CHICKS
            </a>
            <p className="text-white/60 mb-6 font-light max-w-sm">
              Cagayan Valley's premier premium Rhode Island Red hub. Institutional precision applied to agricultural excellence.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3 font-light text-white/70">
              <li><a href="#story" className="hover:text-secondary transition-colors">Our Story</a></li>
              <li><a href="#trust" className="hover:text-secondary transition-colors">Biosecurity & Trust</a></li>
              <li><a href="#products" className="hover:text-secondary transition-colors">Premium Products</a></li>
              <li><a href="#faq" className="hover:text-secondary transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Contact Info</h4>
            <ul className="space-y-3 font-light text-white/70">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-secondary" /> WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" /> Centro Northeast, Solana, Cagayan Valley
              </li>
              <li className="flex items-center gap-2 mt-4 text-secondary font-serif italic">
                Laking alaga, laking malusog.
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-white/50">
          <p>© 2026 Legal Chicks Poultry Farm. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> DTI & RSBSA Registered</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1"><FileCheck className="w-4 h-4" /> DA-BAI GAHP Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Main App ---
export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-secondary/30 selection:text-primary">
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Trust />
        <Advantage />
        <Products />
        <ProofOfQuality />
        <Gallery />
        <ChicksBrooderBanner />
        <FarmRecords />
        <FAQ />
        <Contact />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/639369671213" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></span>
        <MessageCircle size={28} className="relative z-10" />
      </a>
    </div>
  );
}
