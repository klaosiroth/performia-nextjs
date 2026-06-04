import type { PillarKey, ZoneKey } from "@/tokens/pillars"

export type Role = "employee" | "hr" | "executive"
export type ActivityFormat = "online" | "inPerson" | "hybrid"
export type ActivityGroup = "A" | "B"
export type AssessmentStatus = "in_progress" | "completed"
export type BookingStatus = "confirmed" | "cancelled"

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          type: string | null
          region: string | null
          size: string | null
        }
        Insert: Omit<Database["public"]["Tables"]["organizations"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>
      }
      profiles: {
        Row: {
          id: string
          name_th: string | null
          name_en: string | null
          dept: string | null
          position: string | null
          role: Role
          org_id: string | null
          credits_annual: number
          credits_used: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          status: AssessmentStatus
          answers: Record<string, number> | null
          scores: Record<PillarKey, number> | null
          overall_score: number | null
          zone: ZoneKey | null
          completed_at: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["assessments"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["assessments"]["Insert"]>
      }
      activities: {
        Row: {
          id: string
          title_th: string
          title_en: string
          desc_th: string | null
          desc_en: string | null
          pillar: PillarKey
          credits: number
          duration: number
          format: ActivityFormat
          group_tag: ActivityGroup | null
          cover_image: string | null
          is_active: boolean
        }
        Insert: Omit<Database["public"]["Tables"]["activities"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["activities"]["Insert"]>
      }
      activity_slots: {
        Row: {
          id: string
          activity_id: string
          starts_at: string
          seats_total: number
          seats_booked: number
        }
        Insert: Omit<Database["public"]["Tables"]["activity_slots"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["activity_slots"]["Insert"]>
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          slot_id: string
          status: BookingStatus
          credits_spent: number
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>
      }
      org_snapshots: {
        Row: {
          id: string
          org_id: string
          period: string
          pillar_scores: Record<PillarKey, number> | null
          overall_score: number | null
          engagement_rate: number | null
          budget_util: number | null
          active_users: number | null
          dept_breakdown: Record<string, unknown> | null
          risk_metrics: Record<string, unknown> | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["org_snapshots"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["org_snapshots"]["Insert"]>
      }
    }
  }
}
