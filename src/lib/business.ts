import { getSupabase } from './supabase'

export async function getBusinessId(): Promise<string | null> {
  const sb = getSupabase()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const { data } = await sb.from('profiles').select('business_id').eq('id', user.id).single()
  return data?.business_id || null
}
