export type BusinessType = 'retail' | 'fnb' | 'jasa'

export type UserRole = 'owner' | 'manager' | 'staff' | 'accountant'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  business_type?: BusinessType
  business_name?: string
  onboarding_completed: boolean
  created_at: string
}

export interface Module {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  suggested_for: BusinessType[]
}
