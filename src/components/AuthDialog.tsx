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

const ALLOWED_EMAIL = 'kosiuzodinma@gmail.com'

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(ALLOWED_EMAIL)
  const [password, setPassword] = useState('')
  const { signIn, resetPassword } = useAuth()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate email (case insensitive)
    if (email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      toast({
        title: 'Access Denied',
        description: 'This application is restricted to authorized users only.',
        variant: 'destructive',
      })
      return
    }
    
    setLoading(true)

    const { error } = await signIn(email, password)
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


  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    const { error } = await resetPassword(email)
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Check your email for password reset instructions!',
      })
    }
    setLoading(false)
  }

  const resetForm = () => {
    setEmail(ALLOWED_EMAIL)
    setPassword('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Access Required</DialogTitle>
          <DialogDescription>
            This application is restricted to authorized users. Please sign in to continue.
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
              disabled={true}
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Access is restricted to authorized users only.
            </p>
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
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleResetPassword}
            disabled={loading}
          >
            Forgot Password?
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}