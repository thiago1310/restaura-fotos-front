import { Link } from 'react-router-dom'
import { HeroSection } from '@/components/layout/HeroSection'
import { HowItWorks } from '@/components/layout/HowItWorks'
import { Testimonials } from '@/components/layout/Testimonials'
import { BeforeAfterSlider } from '@/components/result/BeforeAfterSlider'
import { PricingCards } from '@/components/payment/PricingCards'
import { Button } from '@/components/ui/button'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BeforeAfterSlider />
      <HowItWorks />
      <Testimonials />
      <PricingCards />
      <section className='mt-14 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-600 to-accent p-8 text-white shadow-premium'>
        <h2 className='font-display text-3xl'>Pagamento facil via Pix</h2>
        <p className='mt-2 max-w-xl text-white/85'>Compre creditos com QR Code, confirme o pagamento e restaure suas fotos na mesma hora.</p>
        <Button asChild variant='secondary' className='mt-6'>
          <Link to='/payment'>Ir para pagamento</Link>
        </Button>
      </section>
    </>
  )
}
