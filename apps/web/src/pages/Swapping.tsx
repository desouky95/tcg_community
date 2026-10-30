import { Repeat } from 'lucide-react'
import Layout from '../components/Layout'

/** The route remains stable while swap APIs and mutations are feature-gated. */
export default function Swapping() {
  return (
    <Layout>
      <section className="mx-auto grid min-h-[60dvh] max-w-3xl place-items-center text-center">
        <div>
          <div className="mx-auto grid size-16 place-items-center bg-primary-500/10 text-primary-500"><Repeat aria-hidden="true" className="size-8" /></div>
          <p className="ui-kicker mt-6">COMING SOON</p>
          <h1 className="mt-3 text-4xl font-display sm:text-5xl">Swapping is being prepared.</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">Build your checklists now. When swaps launch, your collection will be ready to make safer, clearer matches.</p>
        </div>
      </section>
    </Layout>
  )
}
