import { TESTIMONIALS } from '@/services/mockData'

export function Testimonials() {
  return (
    <section className='mt-14'>
      <h2 className='font-display text-3xl md:text-4xl'>Historias que ganharam nova vida</h2>
      <div className='mt-6 grid gap-4 md:grid-cols-3'>
        {TESTIMONIALS.map((testimonial) => (
          <blockquote key={testimonial.name} className='rounded-2xl border border-brand-100 bg-white p-5 shadow-sm'>
            <p className='text-sm leading-relaxed text-ink/80'>"{testimonial.quote}"</p>
            <footer className='mt-4 text-sm font-semibold text-brand-700'>{testimonial.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
