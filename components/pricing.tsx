import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const pricingPlans = [
  { chapters: 1, price: 29 },
  { chapters: 2, price: 39 },
  { chapters: 3, price: 53 },
  { chapters: 4, price: 65 },
  { chapters: 5, price: 73 },
  { chapters: 6, price: 77 },
  { chapters: 7, price: 97 },
]

export default function Pricing() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Tarifas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Participación en {plan.chapters} capítulo{plan.chapters > 1 ? "s" : ""}
              </h3>
              <p className="text-4xl font-bold mb-6">{plan.price}€</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Como autor o coautor</span>
                </li>
                {plan.chapters >= 6 && (
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Participación ilimitada como coautor</span>
                  </li>
                )}
              </ul>
              <Button className="w-full">Seleccionar</Button>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-8">
          *Las tasas son individuales e independientes. Es decir, cada participante del libro debe abonar la tarifa
          correspondiente.
        </p>
      </div>
    </section>
  )
}

