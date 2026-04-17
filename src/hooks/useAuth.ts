import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface AuthUser {
  id: string
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            name: session.user.user_metadata?.full_name ?? undefined
          })
        }
        setLoading(false)
      }
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email ?? '',
            name: session.user.user_metadata?.full_name ?? undefined
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  return { user, signOut, loading }
}
