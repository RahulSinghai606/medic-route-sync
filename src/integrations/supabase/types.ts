export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cases: {
        Row: {
          created_at: string
          eta_minutes: number | null
          hospital_id: string
          id: string
          paramedic_id: string
          paramedic_notes: string | null
          patient_id: string
          severity: Database["public"]["Enums"]["case_severity"]
          status: Database["public"]["Enums"]["case_status"]
          updated_at: string
          vitals: Json | null
        }
        Insert: {
          created_at?: string
          eta_minutes?: number | null
          hospital_id: string
          id?: string
          paramedic_id: string
          paramedic_notes?: string | null
          patient_id: string
          severity: Database["public"]["Enums"]["case_severity"]
          status?: Database["public"]["Enums"]["case_status"]
          updated_at?: string
          vitals?: Json | null
        }
        Update: {
          created_at?: string
          eta_minutes?: number | null
          hospital_id?: string
          id?: string
          paramedic_id?: string
          paramedic_notes?: string | null
          patient_id?: string
          severity?: Database["public"]["Enums"]["case_severity"]
          status?: Database["public"]["Enums"]["case_status"]
          updated_at?: string
          vitals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_paramedic_id_fkey"
            columns: ["paramedic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          chief_complaint: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          incident_date: string | null
          incident_location: string | null
          incident_severity: string | null
          incident_type: string | null
          interventions: string[] | null
          patient_id: string
          updated_at: string
        }
        Insert: {
          chief_complaint?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          incident_date?: string | null
          incident_location?: string | null
          incident_severity?: string | null
          incident_type?: string | null
          interventions?: string[] | null
          patient_id: string
          updated_at?: string
        }
        Update: {
          chief_complaint?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          incident_date?: string | null
          incident_location?: string | null
          incident_severity?: string | null
          incident_type?: string | null
          interventions?: string[] | null
          patient_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_history: {
        Row: {
          additional_factors: string[] | null
          allergies: string | null
          conditions: string[] | null
          created_at: string
          created_by: string
          family_history: string | null
          id: string
          medications: string | null
          patient_id: string
          surgical_history: string | null
          updated_at: string
        }
        Insert: {
          additional_factors?: string[] | null
          allergies?: string | null
          conditions?: string[] | null
          created_at?: string
          created_by: string
          family_history?: string | null
          id?: string
          medications?: string | null
          patient_id: string
          surgical_history?: string | null
          updated_at?: string
        }
        Update: {
          additional_factors?: string[] | null
          allergies?: string | null
          conditions?: string[] | null
          created_at?: string
          created_by?: string
          family_history?: string | null
          id?: string
          medications?: string | null
          patient_id?: string
          surgical_history?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_history_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          age: number | null
          created_at: string
          created_by: string
          emergency_contact: string | null
          emergency_contact_phone: string | null
          gender: string | null
          id: string
          name: string | null
          patient_id: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          age?: number | null
          created_at?: string
          created_by: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          patient_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          age?: number | null
          created_at?: string
          created_by?: string
          emergency_contact?: string | null
          emergency_contact_phone?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          patient_id?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ambulance_id: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          ambulance_id?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          ambulance_id?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vitals: {
        Row: {
          audio_url: string | null
          bp_diastolic: number | null
          bp_systolic: number | null
          created_at: string
          created_by: string
          gcs: number | null
          heart_rate: number | null
          id: string
          notes: string | null
          pain_level: number | null
          patient_id: string
          respiratory_rate: number | null
          spo2: number | null
          temperature: number | null
          transcription: string | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          created_at?: string
          created_by: string
          gcs?: number | null
          heart_rate?: number | null
          id?: string
          notes?: string | null
          pain_level?: number | null
          patient_id: string
          respiratory_rate?: number | null
          spo2?: number | null
          temperature?: number | null
          transcription?: string | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          created_at?: string
          created_by?: string
          gcs?: number | null
          heart_rate?: number | null
          id?: string
          notes?: string | null
          pain_level?: number | null
          patient_id?: string
          respiratory_rate?: number | null
          spo2?: number | null
          temperature?: number | null
          transcription?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vitals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_severity: "Critical" | "Urgent" | "Stable"
      case_status:
        | "pending_approval"
        | "accepted"
        | "declined"
        | "en_route"
        | "arrived"
        | "handoff_complete"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      case_severity: ["Critical", "Urgent", "Stable"],
      case_status: [
        "pending_approval",
        "accepted",
        "declined",
        "en_route",
        "arrived",
        "handoff_complete",
      ],
    },
  },
} as const
