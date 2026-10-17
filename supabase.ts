import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Default (database utama)
const DEFAULT_URL = 'https://rmkcefybmbaihuqkakzj.supabase.co'
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJta2NlZnlibWJhaWh1cWtha3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNzg4OTgsImV4cCI6MjEwNzY1NDg5OH0.5pQ_kXZsAtYfjoalso_DmVE6rGw9Thalp8CUeYMm1lc'

let currentClient: SupabaseClient = createClient(DEFAULT_URL, DEFAULT_KEY)

export function getSupabase(): SupabaseClient {
  return currentClient
}

export function setSupabaseClient(url: string, anonKey: string) {
  currentClient = createClient(url, anonKey)
}

export function resetToDefault() {
  currentClient = createClient(DEFAULT_URL, DEFAULT_KEY)
}

export function getCurrentConfig() {
  return {
    url: currentClient.supabaseUrl,
    isDefault: currentClient.supabaseUrl === DEFAULT_URL,
  }
}

export const supabase = currentClient