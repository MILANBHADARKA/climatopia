import Hero from "@/components/Hero"
import Features from "@/components/Features"
import Pricing from "@/components/Pricing"
import Contact from "@/components/Contact"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Pricing />
      <Contact />
    </div>
  )
}
