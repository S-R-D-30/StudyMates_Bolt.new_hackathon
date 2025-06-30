export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          profile_picture: string | null
          bio: string | null
          education: string | null
          location: string | null
          followers: number | null
          following: number | null
          profile_visibility: string | null
          join_date: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          profile_picture?: string | null
          bio?: string | null
          education?: string | null
          location?: string | null
          followers?: number | null
          following?: number | null
          profile_visibility?: string | null
          join_date?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          profile_picture?: string | null
          bio?: string | null
          education?: string | null
          location?: string | null
          followers?: number | null
          following?: number | null
          profile_visibility?: string | null
          join_date?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}