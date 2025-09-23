import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Mail } from 'lucide-react'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ALLOWED_EMAIL = import.meta.env.VITE_ALLOWED_EMAIL || 'kosiuzodinma@gmail.com'
const IS_DEVELOPMENT = import.meta.env.MODE === 'development'

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(ALLOWED_EMAIL)
  const [password, setPassword] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const { signInWithMagicLink, signInWithPassword } = useAuth()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    if (IS_DEVELOPMENT) {
      const { error } = await signInWithPassword(email, password)
      if (error) {
        toast({
          title: 'Error signing in',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Signed in successfully!',
        })
        onOpenChange(false)
        resetForm()
      }
      setLoading(false)
    } else {
      const { error } = await signInWithMagicLink(email)
      if (error) {
        toast({
          title: 'Error sending magic link',
          description: error.message,
          variant: 'destructive',
        })
        setLoading(false)
      } else {
        setEmailSent(true)
        setLoading(false)
        toast({
          title: 'Magic link sent!',
          description: 'Check your email for the login link.',
        })
      }
    }
  }

  const resetForm = () => {
    setEmail(ALLOWED_EMAIL)
    setPassword('')
    setEmailSent(false)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) resetForm()
    }}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Access Required</DialogTitle>
          <DialogDescription>
            {IS_DEVELOPMENT
              ? 'Development mode - Sign in with your password.'
              : emailSent
              ? 'We sent you a magic link! Check your email to sign in.'
              : 'This application is restricted to authorized users. Enter your email to receive a magic link.'}
          </DialogDescription>
        </DialogHeader>

        {!IS_DEVELOPMENT && emailSent ? (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
              <Mail className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Click the link in your email to sign in. You can close this dialog.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={resetForm}
            >
              Send another link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {IS_DEVELOPMENT && (
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {IS_DEVELOPMENT ? 'Sign In' : 'Send Magic Link'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}