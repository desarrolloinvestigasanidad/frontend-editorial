import Hero from "@/components/hero"
import Features from "@/components/features"
import PublicationTypes from "@/components/publication-types"
import Pricing from "@/components/pricing"
import UpcomingEditions from "@/components/upcoming-editions"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <PublicationTypes />
      <Pricing />
      <UpcomingEditions />
      <Contact />
    </>
  )
}

