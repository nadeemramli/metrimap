export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      metric_values: {
        Row: {
          change_percent: number | null
          created_by: string
          id: string
          period: string
          source: string | null
          tracked_metric_id: string
          trend: string | null
          updated_at: string
          value: number
        }
        Insert: {
          change_percent?: number | null
          created_by?: string
          id?: string
          period: string
          source?: string | null
          tracked_metric_id: string
          trend?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          change_percent?: number | null
          created_by?: string
          id?: string
          period?: string
          source?: string | null
          tracked_metric_id?: string
          trend?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "metric_values_tracked_metric_id_fkey"
            columns: ["tracked_metric_id"]
            isOneToOne: false
            referencedRelation: "tracked_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      tracked_metrics: {
        Row: {
          created_at: string
          created_by: string
          formula: string | null
          id: string
          name: string
          origin_card_id: string | null
          origin_project_id: string | null
          owner_label: string | null
          source_kind: string | null
          state: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          formula?: string | null
          id?: string
          name: string
          origin_card_id?: string | null
          origin_project_id?: string | null
          owner_label?: string | null
          source_kind?: string | null
          state?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          formula?: string | null
          id?: string
          name?: string
          origin_card_id?: string | null
          origin_project_id?: string | null
          owner_label?: string | null
          source_kind?: string | null
          state?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      canvas_nodes: {
        Row: {
          created_at: string
          created_by: string
          data: Json | null
          id: string
          node_type: string
          position_x: number
          position_y: number
          project_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          data?: Json | null
          id?: string
          node_type: string
          position_x?: number
          position_y?: number
          project_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          data?: Json | null
          id?: string
          node_type?: string
          position_x?: number
          position_y?: number
          project_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "canvas_nodes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      source_connection_secrets: {
        Row: {
          connection_id: string
          password: string
          updated_at: string
        }
        Insert: {
          connection_id: string
          password: string
          updated_at?: string
        }
        Update: {
          connection_id?: string
          password?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_connection_secrets_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: true
            referencedRelation: "source_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      source_connections: {
        Row: {
          created_at: string
          created_by: string
          database: string
          host: string
          id: string
          name: string
          port: number
          ssl: boolean
          updated_at: string
          username: string
          warehouse_type: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          database: string
          host: string
          id?: string
          name: string
          port?: number
          ssl?: boolean
          updated_at?: string
          username: string
          warehouse_type?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          database?: string
          host?: string
          id?: string
          name?: string
          port?: number
          ssl?: boolean
          updated_at?: string
          username?: string
          warehouse_type?: string
        }
        Relationships: []
      }
      comment_threads: {
        Row: {
          id: string
          project_id: string
          source: string
          context: Json | null
          is_resolved: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          source: string
          context?: Json | null
          is_resolved?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          source?: string
          context?: Json | null
          is_resolved?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_threads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          id: string
          thread_id: string
          author_id: string | null
          content: string
          resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          author_id?: string | null
          content: string
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          author_id?: string | null
          content?: string
          resolved?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "comment_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_mentions: {
        Row: {
          id: string
          comment_id: string
          mentioned_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          mentioned_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          mentioned_user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_mentions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string | null
          description: string | null
          read: boolean
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title?: string | null
          description?: string | null
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string | null
          description?: string | null
          read?: boolean
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      changelog: {
        Row: {
          action: string
          description: string
          id: string
          metadata: Json | null
          project_id: string | null
          target: string
          target_id: string | null
          target_name: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          description: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          target: string
          target_id?: string | null
          target_name: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          description?: string
          id?: string
          metadata?: Json | null
          project_id?: string | null
          target?: string
          target_id?: string | null
          target_name?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "changelog_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "changelog_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_items: {
        Row: {
          created_at: string | null
          created_by: string
          date: string
          hypothesis: string | null
          id: string
          impact_on_confidence: string | null
          link: string | null
          owner_id: string | null
          relationship_id: string | null
          summary: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          date: string
          hypothesis?: string | null
          id?: string
          impact_on_confidence?: string | null
          link?: string | null
          owner_id?: string | null
          relationship_id?: string | null
          summary: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          date?: string
          hypothesis?: string | null
          id?: string
          impact_on_confidence?: string | null
          link?: string | null
          owner_id?: string | null
          relationship_id?: string | null
          summary?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_items_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_items_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          height: number
          id: string
          name: string
          node_ids: string[] | null
          position_x: number
          position_y: number
          project_id: string | null
          updated_at: string | null
          width: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          height?: number
          id?: string
          name: string
          node_ids?: string[] | null
          position_x?: number
          position_y?: number
          project_id?: string | null
          updated_at?: string | null
          width?: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          height?: number
          id?: string
          name?: string
          node_ids?: string[] | null
          position_x?: number
          position_y?: number
          project_id?: string | null
          updated_at?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
        metric_cards: {
    Row: {
      id: string
      title: string
      description: string | null
      category: string
      sub_category: string | null
      data: Json | null
      position_x: number
      position_y: number
      source_type: string | null
      tracked_metric_id: string | null
      formula: string | null
      causal_factors: string[] | null
      dimensions: string[] | null
      assignees: string[] | null
      owner_id: string | null
      project_id: string
      created_at: string | null
      updated_at: string | null
      created_by: string
      last_modified_by: string | null
    }
    Insert: {
      id?: string
      title: string
      description?: string | null
      category: string
      sub_category?: string | null
      data?: Json | null
      position_x?: number
      position_y?: number
      source_type?: string | null
      tracked_metric_id?: string | null
      formula?: string | null
      causal_factors?: string[] | null
      dimensions?: string[] | null
      assignees?: string[] | null
      owner_id?: string | null
      project_id: string
      created_at?: string | null
      updated_at?: string | null
      created_by: string
      last_modified_by?: string | null
    }
    Update: {
      id?: string
      title?: string
      description?: string | null
      category?: string
      sub_category?: string | null
      data?: Json | null
      position_x?: number
      position_y?: number
      source_type?: string | null
      tracked_metric_id?: string | null
      formula?: string | null
      causal_factors?: string[] | null
      dimensions?: string[] | null
      assignees?: string[] | null
      owner_id?: string | null
      project_id?: string
      created_at?: string | null
      updated_at?: string | null
      created_by?: string
      last_modified_by?: string | null
    }
        Relationships: [
          {
            foreignKeyName: "metric_cards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_cards_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_cards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      metric_card_tags: {
        Row: {
          id: string
          metric_card_id: string
          tag_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          metric_card_id: string
          tag_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          metric_card_id?: string
          tag_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_card_tags_metric_card_id_fkey"
            columns: ["metric_card_id"]
            isOneToOne: false
            referencedRelation: "metric_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_card_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      project_collaborators: {
        Row: {
          id: string
          invited_at: string | null
          joined_at: string | null
          permissions: string[] | null
          project_id: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          permissions?: string[] | null
          project_id?: string | null
          role?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          permissions?: string[] | null
          project_id?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_collaborators_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          archived_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean
          is_starred: boolean
          last_modified_by: string | null
          name: string
          settings: Json | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean
          is_starred?: boolean
          last_modified_by?: string | null
          name: string
          settings?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean
          is_starred?: boolean
          last_modified_by?: string | null
          name?: string
          settings?: Json | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      relationships: {
        Row: {
          id: string
          source_id: string
          target_id: string
          type: string
          confidence: string
          weight: number | null
          description: string | null
          project_id: string
          created_at: string | null
          updated_at: string | null
          created_by: string
          last_modified_by: string | null
        }
        Insert: {
          id?: string
          source_id: string
          target_id: string
          type: string
          confidence: string
          weight?: number | null
          description?: string | null
          project_id: string
          created_at?: string | null
          updated_at?: string | null
          created_by: string
          last_modified_by?: string | null
        }
        Update: {
          id?: string
          source_id?: string
          target_id?: string
          type?: string
          confidence?: string
          weight?: number | null
          description?: string | null
          project_id?: string
          created_at?: string | null
          updated_at?: string | null
          created_by?: string
          last_modified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationships_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_last_modified_by_fkey"
            columns: ["last_modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "metric_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "metric_cards"
            referencedColumns: ["id"]
          }
        ]
      }
      relationship_tags: {
        Row: {
          id: string
          relationship_id: string
          tag_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          relationship_id: string
          tag_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          relationship_id?: string
          tag_id?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationship_tags_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationship_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
          color: string | null
          description: string | null
          project_id: string | null
          created_by: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          description?: string | null
          project_id?: string | null
          created_by: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          description?: string | null
          project_id?: string | null
          created_by?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const