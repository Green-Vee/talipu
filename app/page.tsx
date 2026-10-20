import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
//import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main>
        <Navbar />
        <Hero />
        <Gallery />
        <Pricing />
        <About />
      </main>
    </div>
  );
}
