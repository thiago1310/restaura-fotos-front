import { useState } from 'react'

export function BeforeAfterSlider() {
  const [value, setValue] = useState(50)

  return (
    <section className='mt-14'>
      <h2 className='font-display text-3xl md:text-4xl'>Antes e Depois em um relance</h2>
      <p className='mt-2 text-ink/70'>Compare o original danificado com a versao restaurada.</p>
      <div className='relative mt-6 overflow-hidden rounded-2xl border border-brand-100 shadow-premium'>
        <img
          src='https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1400&q=80'
          alt='Foto antiga antes da restauracao'
          className='h-[320px] w-full object-cover grayscale md:h-[420px]'
        />
        <div className='absolute inset-y-0 left-0 overflow-hidden' style={{ width: `${value}%` }}>
          <img
            src='https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1400&q=80'
            alt='Foto restaurada apos IA'
            className='h-[320px] w-full object-cover md:h-[420px]'
          />
        </div>
        <div className='absolute inset-y-0' style={{ left: `${value}%` }}>
          <div className='h-full w-[2px] bg-white/90' />
        </div>
      </div>
      <input
        type='range'
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className='mt-4 w-full accent-brand-600'
        aria-label='Comparar antes e depois'
      />
    </section>
  )
}
