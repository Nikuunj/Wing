import Feature from "@/components/home/Feature";
import Hero from "@/components/home/Hero";
import HowItWoork from "@/components/home/HowItWoork";
import Why from "@/components/home/Why";

export default function Home() {
  return (
    <div>
      <div className="space-y-20 mb-20">
        <Hero />
        <Why />
        <HowItWoork />
        <Feature />
      </div>
    </div>
  );
}
