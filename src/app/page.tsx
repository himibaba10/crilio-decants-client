import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <div className="space-y-3">
        <Badge variant="secondary">Scaffold</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Crilio Decants</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Next.js App Router storefront scaffold for the headless WooCommerce
          perfume decant store. Catalog, cart, and checkout handoff land in
          later passes.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Ready in this repo</CardTitle>
          <CardDescription>
            Stack and primitives only — no live GraphQL wiring yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>Next.js 16 · TypeScript · bun · Tailwind CSS v4</li>
            <li>shadcn/ui (radix-nova) · light theme</li>
            <li>
              Primitives: Button, Sheet, Input, Select, Card, Badge, Separator
            </li>
            <li>
              Env placeholders in <code>.env.example</code>
            </li>
          </ul>
          <Button type="button" disabled>
            Shop coming soon
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
