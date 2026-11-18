export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_url: string | null
          end_at: string | null
          frequency: string
          id: string
          image_url: string | null
          is_active: boolean
          pages: string[]
          sort_order: number
          start_at: string | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          end_at?: string | null
          frequency?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          pages?: string[]
          sort_order?: number
          start_at?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          end_at?: string | null
          frequency?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          pages?: string[]
          sort_order?: number
          start_at?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          need: string | null
          notes: string | null
          phone: string
          role: string | null
          segment: string | null
          source: string
          status: string
          updated_at: string
          visitor_id: string | null
          volume: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          need?: string | null
          notes?: string | null
          phone: string
          role?: string | null
          segment?: string | null
          source?: string
          status?: string
          updated_at?: string
          visitor_id?: string | null
          volume?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          need?: string | null
          notes?: string | null
          phone?: string
          role?: string | null
          segment?: string | null
          source?: string
          status?: string
          updated_at?: string
          visitor_id?: string | null
          volume?: string | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          category: string
          created_at: string
          description: string
          file_url: string
          format: string
          id: string
          is_active: boolean
          kind: string
          models: string[]
          os: string
          sort_order: number
          title: string
          updated_at: string
          version: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          file_url?: string
          format?: string
          id?: string
          is_active?: boolean
          kind?: string
          models?: string[]
          os?: string
          sort_order?: number
          title: string
          updated_at?: string
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          file_url?: string
          format?: string
          id?: string
          is_active?: boolean
          kind?: string
          models?: string[]
          os?: string
          sort_order?: number
          title?: string
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          phone: string
          product_name: string | null
          product_slug: string | null
          quantity: number | null
          status: string
          updated_at: string
          visitor_id: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          phone: string
          product_name?: string | null
          product_slug?: string | null
          quantity?: number | null
          status?: string
          updated_at?: string
          visitor_id?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          phone?: string
          product_name?: string | null
          product_slug?: string | null
          quantity?: number | null
          status?: string
          updated_at?: string
          visitor_id?: string | null
        }
        Relationships: []
      }
      reseller_applications: {
        Row: {
          city: string | null
          cnpj: string | null
          company: string
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          monthly_volume: string | null
          notes: string | null
          phone: string
          segment: string | null
          state: string | null
          status: string
          updated_at: string
          visitor_id: string | null
        }
        Insert: {
          city?: string | null
          cnpj?: string | null
          company: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          monthly_volume?: string | null
          notes?: string | null
          phone: string
          segment?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          visitor_id?: string | null
        }
        Update: {
          city?: string | null
          cnpj?: string | null
          company?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          monthly_volume?: string | null
          notes?: string | null
          phone?: string
          segment?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          visitor_id?: string | null
        }
        Relationships: []
      }
      site_events: {
        Row: {
          created_at: string
          device: string | null
          event: string
          id: number
          label: string | null
          path: string | null
          referrer: string | null
          session_id: string | null
          utm: Json | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          event: string
          id?: never
          label?: string | null
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          utm?: Json | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          device?: string | null
          event?: string
          id?: never
          label?: string | null
          path?: string | null
          referrer?: string | null
          session_id?: string | null
          utm?: Json | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          company: string
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          quote: string
          role: string | null
          sort_order: number
        }
        Insert: {
          author: string
          company: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          quote: string
          role?: string | null
          sort_order?: number
        }
        Update: {
          author?: string
          company?: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          quote?: string
          role?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      training_registrations: {
        Row: {
          answers: Json
          company: string
          created_at: string
          email: string
          id: string
          is_client: boolean
          name: string
          phone: string | null
          status: string
          training_id: string
          updated_at: string
        }
        Insert: {
          answers?: Json
          company?: string
          created_at?: string
          email: string
          id?: string
          is_client?: boolean
          name: string
          phone?: string | null
          status?: string
          training_id: string
          updated_at?: string
        }
        Update: {
          answers?: Json
          company?: string
          created_at?: string
          email?: string
          id?: string
          is_client?: boolean
          name?: string
          phone?: string | null
          status?: string
          training_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_registrations_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          audience: string
          created_at: string
          date: string
          description: string
          form_fields: Json
          format: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          registrations_closed: boolean
          seats: number
          spots: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          audience: string
          created_at?: string
          date: string
          description: string
          form_fields?: Json
          format: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          registrations_closed?: boolean
          seats: number
          spots: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          audience?: string
          created_at?: string
          date?: string
          description?: string
          form_fields?: Json
          format?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          registrations_closed?: boolean
          seats?: number
          spots?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_content: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "editor", "viewer"],
    },
  },
} as const
