import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // TODO: AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
  // Remove this comment and uncomment the lines below to re-enable authentication
  
  // const [user, setUser] = useState<User | null>(null)
  // const [session, setSession] = useState<Session | null>(null)
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const getSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession()
  //     setSession(session)
  //     setUser(session?.user ?? null)
  //     setLoading(false)
  //   }

  //   getSession()

  //   const { data: { subscription } } = supabase.auth.onAuthStateChange(
  //     async (event, session) => {
  //       setSession(session)
  //       setUser(session?.user ?? null)
  //       setLoading(false)
  //     }
  //   )

  //   return () => subscription.unsubscribe()
  // }, [])

  // TEMPORARILY MOCK AUTH STATE FOR TESTING
  const [user] = useState<User | null>({ id: 'test-user', email: 'test@example.com' } as User)
  const [session] = useState<Session | null>({ user: user } as Session)
  const [loading] = useState(false)

  const signUp = async (email: string, password: string) => {
    // TODO: AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
    // Remove this comment and uncomment the lines below to re-enable authentication
    
    // const { error } = await supabase.auth.signUp({
    //   email,
    //   password,
    // })
    // return { error }
    
    // TEMPORARILY MOCK SUCCESS FOR TESTING
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    // TODO: AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
    // Remove this comment and uncomment the lines below to re-enable authentication
    
    // const { error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // })
    // return { error }
    
    // TEMPORARILY MOCK SUCCESS FOR TESTING
    return { error: null }
  }

  const signOut = async () => {
    // TODO: AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
    // Remove this comment and uncomment the lines below to re-enable authentication
    
    // const { error } = await supabase.auth.signOut()
    // return { error }
    
    // TEMPORARILY MOCK SUCCESS FOR TESTING
    return { error: null }
  }

  const resetPassword = async (email: string) => {
    // TODO: AUTHENTICATION TEMPORARILY DISABLED FOR TESTING
    // Remove this comment and uncomment the lines below to re-enable authentication
    
    // const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${window.location.origin}/reset-password`,
    // })
    // return { error }
    
    // TEMPORARILY MOCK SUCCESS FOR TESTING
    return { error: null }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}