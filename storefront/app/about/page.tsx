import { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us' }

export default function AboutPage() {
  return (
    <>
      <section className="bg-background py-section-sm lg:py-section">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-body font-bold tracking-tight text-balance leading-[1.05] text-[clamp(2.25rem,5vw,4rem)]">
              About us
            </h1>
            <p className="mt-4 text-base lg:text-lg text-foreground/60 max-w-xl leading-relaxed">
              We started with a simple belief: everyday objects should be beautiful, functional, and made to last. No compromises.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7 space-y-6 text-foreground/70 leading-relaxed text-[15px] lg:text-[17px]">
              <p>
                Founded in 2024, our store was born from a desire to curate products that bring intention to daily life. We partner with artisans and small-batch manufacturers who share our commitment to quality materials and thoughtful design.
              </p>

              <div className="pt-4">
                <h2 className="font-body font-bold tracking-tight text-[clamp(1.5rem,2.6vw,2rem)] text-foreground leading-snug">
                  Our philosophy
                </h2>
                <p className="mt-3">
                  We believe in fewer, better things. Every product in our collection is chosen for its craftsmanship, longevity, and the story behind it. We&apos;d rather offer one exceptional version of something than ten mediocre options.
                </p>
              </div>

              <div className="pt-4">
                <h2 className="font-body font-bold tracking-tight text-[clamp(1.5rem,2.6vw,2rem)] text-foreground leading-snug">
                  Sustainability
                </h2>
                <p className="mt-3">
                  From packaging to shipping, we&apos;re committed to reducing our environmental footprint. All orders ship in recycled and recyclable materials. We offset 100% of carbon emissions from shipping through verified carbon removal projects.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-md bg-muted/40 p-6 sm:p-10 lg:p-12">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-black/[0.06] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium text-foreground/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  By the numbers
                </span>
                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
                  {[
                    { num: '01', value: '100%', body: 'Ethically sourced materials' },
                    { num: '02', value: '50+', body: 'Artisan partners worldwide' },
                    { num: '03', value: '30-Day', body: 'No-questions-asked returns' },
                    { num: '04', value: 'Carbon', body: 'Neutral shipping on every order' },
                  ].map((item) => (
                    <div key={item.num} className="space-y-2">
                      <p className="text-sm text-muted-foreground/70 font-medium tabular-nums">
                        {item.num}
                      </p>
                      <p className="font-body font-bold tracking-tight text-2xl text-foreground leading-tight">
                        {item.value}
                      </p>
                      <p className="text-[13px] text-foreground/60 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
