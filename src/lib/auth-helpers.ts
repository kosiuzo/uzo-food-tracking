import { supabase } from './supabase'

// Default test user ID for development bypass mode
const DEV_TEST_USER_ID = 'e57888be-f990-4cd4-85ad-a519be335938'

export async function getCurrentUserId(): Promise<string | null> {
  // Check if auth bypass is enabled in development
  const bypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true'

  if (bypassAuth) {
    return DEV_TEST_USER_ID
  }

  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function requireCurrentUserId(): Promise<string> {
  const userId = await getCurrentUserId()
  if (!userId) {
    throw new Error('You must be signed in to perform this action.')
  }
  return userId
}

export async function addUserIdToInsert<T extends Record<string, unknown>>(
  data: T
): Promise<T & { user_id?: string }> {
  const userId = await getCurrentUserId()

  if (userId) {
    return { ...data, user_id: userId }
  }

  return data
}
