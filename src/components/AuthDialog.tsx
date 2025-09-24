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
import { Loader2 } from 'lucide-react'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ALLOWED_EMAIL = import.meta.env.VITE_ALLOWED_EMAIL || 'kosiuzodinma@gmail.com'
export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(ALLOWED_EMAIL)
  const [password, setPassword] = useState('')
  const { signInWithPassword } = useAuth()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

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
  }

  const resetForm = () => {
    setEmail(ALLOWED_EMAIL)
    setPassword('')
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
            Sign in with your email and password to continue.
          </DialogDescription>
        </DialogHeader>

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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
