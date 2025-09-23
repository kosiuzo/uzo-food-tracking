import { supabase } from './supabase'

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
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