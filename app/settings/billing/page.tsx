import { Button } from "@/components/ui/button"

const PLANS = [
  {
    name: "Pro",
    price: "$5",
    desc: "For solo builders who forge prompts daily.",
    features: ["100 prompts / day", "Deep Forge mode", "Prompt history"],
  },
  {
    name: "Business",
    price: "$50",
    desc: "Advanced controls for growing teams.",
    features: ["Unlimited prompts", "Shared collections", "Priority support"],
  },
]

export default function BillingSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Plans &amp; credit usage</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan and usage.
        </p>
      </div>

      {/* Current plan */}
      <div className="flex flex-col gap-3 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Free Plan</span>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">0</span> / 10 prompts
          used today · resets at midnight UTC
        </p>
      </div>

      {/* Change plan */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Change your plan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div key={plan.name} className="flex flex-col gap-4 rounded-xl border p-5">
              <div>
                <p className="text-lg font-semibold">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.desc}</p>
              </div>
              <p className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
              <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              <Button className="mt-auto w-full">Upgrade to {plan.name}</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
