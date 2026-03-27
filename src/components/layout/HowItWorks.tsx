import { Camera, ScanSearch, Download } from 'lucide-react'

const STEPS = [
  { icon: Camera, title: '1. Envie sua foto', desc: 'Upload rapido com preview imediato.' },
  { icon: ScanSearch, title: '2. IA processa detalhes', desc: 'Restauracao, colorizacao e upscale em etapas seguras.' },
  { icon: Download, title: '3. Receba e baixe', desc: 'Imagem final em alta definicao e opcao de animacao.' }
]

export function HowItWorks() {
  return (
    <section className='mt-14'>
      <h2 className='font-display text-3xl md:text-4xl'>Como funciona</h2>
      <div className='mt-6 grid gap-4 md:grid-cols-3'>
        {STEPS.map((item) => (
          <article key={item.title} className='rounded-2xl border border-brand-100 bg-white p-5 shadow-sm'>
            <item.icon className='text-brand-600' />
            <h3 className='mt-3 text-lg font-semibold'>{item.title}</h3>
            <p className='mt-2 text-sm text-ink/70'>{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
