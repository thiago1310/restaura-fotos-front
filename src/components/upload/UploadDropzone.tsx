import { useRef } from 'react'
import { UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UploadDropzoneProps {
  onFileChange: (file: File) => void
}

export function UploadDropzone({ onFileChange }: UploadDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onFileChange(file)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) onFileChange(file)
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className='rounded-2xl border-2 border-dashed border-brand-300 bg-white/70 p-8 text-center'
    >
      <UploadCloud className='mx-auto text-brand-600' size={36} />
      <h3 className='mt-4 text-lg font-semibold'>Arraste sua foto aqui</h3>
      <p className='mt-1 text-sm text-ink/70'>ou clique para selecionar uma imagem JPG/PNG</p>
      <Button variant='secondary' className='mt-5' onClick={() => fileInputRef.current?.click()}>
        Escolher arquivo
      </Button>
      <input ref={fileInputRef} type='file' accept='image/*' className='hidden' onChange={handleChange} />
    </div>
  )
}
