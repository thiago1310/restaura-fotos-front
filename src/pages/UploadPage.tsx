import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { UploadDropzone } from '@/components/upload/UploadDropzone'
import { PhotoPreviewCard } from '@/components/upload/PhotoPreviewCard'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { getStoredAuthToken } from '@/services/authService'
import { createRestauracao } from '@/services/restauracoesService'
import { useAppStore } from '@/store/appStore'

export function UploadPage() {
  const navigate = useNavigate()
  const [imageFile, setImageFile] = useState<File>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const credits = useAppStore((state) => state.user.credits)
  const authToken = useAppStore((state) => state.authToken)
  const options = useAppStore((state) => state.currentOptions)
  const setCurrentOptions = useAppStore((state) => state.setCurrentOptions)
  const setCurrentJob = useAppStore((state) => state.setCurrentJob)

  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : undefined), [imageFile])

  async function handleProcess() {
    if (!imageFile || !previewUrl) return

    const token = authToken ?? getStoredAuthToken()
    if (!token) {
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await createRestauracao(token, {
        foto: imageFile,
        restaurarDanos: options.restore,
        colorizar: options.colorize,
        melhorarQualidade: options.upscale,
        animarFoto: options.animate
      })

      setCurrentJob({
        id: `restauracao-${response.restauracaoId}`,
        restauracaoId: response.restauracaoId,
        originalUrl: previewUrl,
        animateRequested: options.animate,
        processingStage: 'upload',
        status: 'processing'
      })

      navigate('/processing')
    } catch {
      setErrorMessage('Falha ao enviar a foto para restauracao. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='font-display text-4xl'>Enviar foto para restauracao</h1>
          <p className='text-sm text-ink/70'>Cada processamento consome creditos do seu saldo.</p>
        </div>
        <p className='inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold shadow-sm'>
          <CreditCard size={16} className='text-brand-700' /> {credits} creditos disponiveis
        </p>
      </div>

      {!credits && (
        <div className='rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
          Voce nao possui creditos para processar.{' '}
          <Link to='/payment' className='font-semibold underline'>
            Compre um pacote agora
          </Link>
          .
        </div>
      )}

      {errorMessage ? <div className='rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>{errorMessage}</div> : null}

      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-4'>
          <UploadDropzone onFileChange={setImageFile} />
          <div className='grid gap-3'>
            <Checkbox
              label='Restaurar danos'
              checked={options.restore}
              onChange={(event) => setCurrentOptions({ ...options, restore: event.target.checked })}
            />
            <Checkbox
              label='Colorizar'
              checked={options.colorize}
              onChange={(event) => setCurrentOptions({ ...options, colorize: event.target.checked })}
            />
            <Checkbox
              label='Melhorar qualidade (upscale)'
              checked={options.upscale}
              onChange={(event) => setCurrentOptions({ ...options, upscale: event.target.checked })}
            />
            <Checkbox
              label='Animar foto'
              checked={options.animate}
              onChange={(event) => setCurrentOptions({ ...options, animate: event.target.checked })}
            />
          </div>
          <Button className='w-full' size='lg' onClick={handleProcess} disabled={!previewUrl || credits <= 0 || isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Processar imagem'}
          </Button>
        </div>

        <PhotoPreviewCard imageUrl={previewUrl} />
      </div>
    </div>
  )
}
