import { useState, useEffect } from 'react'

type ToastType = 'success' | 'error' | 'info'
interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

let toastId = 0
type ToastListener = (toast: ToastMessage) => void
const listeners = new Set<ToastListener>()

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
}

function addToast(message: string, type: ToastType) {
  const t = { id: ++toastId, message, type }
  listeners.forEach(l => l(t))
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const listener = (t: ToastMessage) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => {
        setToasts(prev => prev.filter(p => p.id !== t.id))
      }, 3000)
    }
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999,
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? '#ef4444' : t.type === 'success' ? '#5cb885' : '#3d4e65',
          color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 14,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          animation: 'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
