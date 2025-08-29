# Authentication Restore Instructions

**IMPORTANT:** Authentication has been temporarily disabled for testing purposes. Follow these steps to restore authentication when testing is complete.

## Files Modified

The following files have been modified to bypass authentication:

1. `src/components/ProtectedRoute.tsx`
2. `src/contexts/AuthContext.tsx`

## Restoring Authentication

### Step 1: Restore ProtectedRoute Component

In `src/components/ProtectedRoute.tsx`:

1. **Uncomment the imports:**
```typescript
// Change FROM:
// import { useAuth } from '@/contexts/AuthContext'
// import { AuthDialog } from '@/components/AuthDialog'
// import { useState } from 'react'
// import { Loader2 } from 'lucide-react'

// TO:
import { useAuth } from '@/contexts/AuthContext'
import { AuthDialog } from '@/components/AuthDialog'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
```

2. **Uncomment the main component logic:**
Find the large commented block in the `ProtectedRoute` function and uncomment all the lines between the TODO comments.

3. **Remove the bypass line:**
```typescript
// DELETE this line:
return <>{children}</>
```

### Step 2: Restore AuthContext Provider

In `src/contexts/AuthContext.tsx`:

1. **Uncomment the state management:**
```typescript
// Change FROM:
// const [user, setUser] = useState<User | null>(null)
// const [session, setSession] = useState<Session | null>(null)
// const [loading, setLoading] = useState(true)

// TO:
const [user, setUser] = useState<User | null>(null)
const [session, setSession] = useState<Session | null>(null)
const [loading, setLoading] = useState(true)
```

2. **Uncomment the useEffect hook:**
Uncomment the entire useEffect block that handles session management and auth state changes.

3. **Remove the mock auth state:**
```typescript
// DELETE these lines:
const [user] = useState<User | null>({ id: 'test-user', email: 'test@example.com' } as User)
const [session] = useState<Session | null>({ user: user } as Session)
const [loading] = useState(false)
```

4. **Restore the auth functions:**
For each function (signUp, signIn, signOut, resetPassword), uncomment the actual Supabase calls and remove the mock return statements:

```typescript
// Example for signIn function:
// Change FROM:
// const { error } = await supabase.auth.signInWithPassword({
//   email,
//   password,
// })
// return { error }

// return { error: null } // DELETE this line

// TO:
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
return { error }
```

## Verification Steps

After restoring authentication:

1. **Run the development server:**
```bash
npm run dev
```

2. **Verify authentication is working:**
   - Navigate to `http://localhost:8080`
   - You should see the authentication dialog
   - Test sign in/sign up flows
   - Verify protected routes are actually protected

3. **Run tests to ensure nothing broke:**
```bash
npm run test:run
npm run test:e2e
```

## Search and Replace Method

For faster restoration, you can use these search and replace operations:

1. **Remove all TODO comment blocks:**
   - Search for: `// TODO: AUTHENTICATION TEMPORARILY DISABLED FOR TESTING.*\n(?:.*\n)*?.*TEMPORARILY.*\n`
   - Replace with: (empty)

2. **Uncomment all auth-related code:**
   - Search for: `^(\s*)// (.*auth.*|.*Auth.*|.*supabase.*)`
   - Replace with: `$1$2`

## Files to Check

Make sure these patterns are restored in:
- `src/components/ProtectedRoute.tsx` - All auth logic uncommented
- `src/contexts/AuthContext.tsx` - All Supabase auth calls restored

## Warning Signs

If authentication restoration fails:
- App redirects to sign-in but login doesn't work → Check Supabase auth functions
- App loads without authentication prompt → Check ProtectedRoute component
- TypeScript errors → Check that all imports are uncommented

## Backup Plan

If you encounter issues during restoration:
1. Check git history: `git log --oneline | head -10`
2. Compare with the commit before auth was disabled
3. Or manually review this file to ensure all changes are reverted correctly

---

**Remember:** Delete this file after authentication is successfully restored!