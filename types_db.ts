export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      game_companies: {
        Row: {
          company_id: number
          company_name: string
          company_slug: string
          game_id: number
        }
        Insert: {
          company_id: number
          company_name: string
          company_slug: string
          game_id: number
        }
        Update: {
          company_id?: number
          company_name?: string
          company_slug?: string
          game_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_companies_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_modes: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      game_screenshots: {
        Row: {
          game_id: number | null
          height: number | null
          id: number
          url: string
          width: number | null
        }
        Insert: {
          game_id?: number | null
          height?: number | null
          id: number
          url: string
          width?: number | null
        }
        Update: {
          game_id?: number | null
          height?: number | null
          id?: number
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_screenshots_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      game_to_genres: {
        Row: {
          game_id: number
          genre_id: number
        }
        Insert: {
          game_id: number
          genre_id: number
        }
        Update: {
          game_id?: number
          genre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_to_genres_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_to_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      game_to_modes: {
        Row: {
          game_id: number
          game_mode_id: number
        }
        Insert: {
          game_id: number
          game_mode_id: number
        }
        Update: {
          game_id?: number
          game_mode_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_to_modes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_to_modes_game_mode_id_fkey"
            columns: ["game_mode_id"]
            isOneToOne: false
            referencedRelation: "game_modes"
            referencedColumns: ["id"]
          },
        ]
      }
      game_to_platforms: {
        Row: {
          game_id: number
          platform_id: number
        }
        Insert: {
          game_id: number
          platform_id: number
        }
        Update: {
          game_id?: number
          platform_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_to_platforms_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_to_platforms_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_types: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      game_websites: {
        Row: {
          game_id: number | null
          id: number
          trusted: boolean | null
          url: string
          website_type_id: number | null
        }
        Insert: {
          game_id?: number | null
          id: number
          trusted?: boolean | null
          url: string
          website_type_id?: number | null
        }
        Update: {
          game_id?: number | null
          id?: number
          trusted?: boolean | null
          url?: string
          website_type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "game_websites_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_websites_website_type_id_fkey"
            columns: ["website_type_id"]
            isOneToOne: false
            referencedRelation: "website_types"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          cover_height: number | null
          cover_url: string | null
          cover_width: number | null
          created_at: string | null
          first_release_date: string | null
          game_type_id: number | null
          id: number
          is_popular: boolean | null
          name: string
          slug: string
          storyline: string | null
          summary: string | null
          total_rating: number | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          cover_height?: number | null
          cover_url?: string | null
          cover_width?: number | null
          created_at?: string | null
          first_release_date?: string | null
          game_type_id?: number | null
          id: number
          is_popular?: boolean | null
          name: string
          slug: string
          storyline?: string | null
          summary?: string | null
          total_rating?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          cover_height?: number | null
          cover_url?: string | null
          cover_width?: number | null
          created_at?: string | null
          first_release_date?: string | null
          game_type_id?: number | null
          id?: number
          is_popular?: boolean | null
          name?: string
          slug?: string
          storyline?: string | null
          summary?: string | null
          total_rating?: number | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_game_type_id_fkey"
            columns: ["game_type_id"]
            isOneToOne: false
            referencedRelation: "game_types"
            referencedColumns: ["id"]
          },
        ]
      }
      genres: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      ignored_platform_games: {
        Row: {
          created_at: string | null
          id: string
          platform_game_id: string
          platform_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform_game_id: string
          platform_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform_game_id?: string
          platform_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      platforms: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: {
          id: number
          name: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          handle: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          handle?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          handle?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      similar_games: {
        Row: {
          game_id: number
          similar_game_id: number
        }
        Insert: {
          game_id: number
          similar_game_id: number
        }
        Update: {
          game_id?: number
          similar_game_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "similar_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "similar_games_similar_game_id_fkey"
            columns: ["similar_game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      user_games: {
        Row: {
          achievements_completed: number | null
          achievements_total: number | null
          created_at: string | null
          game_id: number | null
          id: string
          platform_id: number | null
          playtime_minutes: number | null
          rating: number | null
          review: string | null
          source: Database["public"]["Enums"]["game_source"]
          status: Database["public"]["Enums"]["game_status"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          achievements_completed?: number | null
          achievements_total?: number | null
          created_at?: string | null
          game_id?: number | null
          id?: string
          platform_id?: number | null
          playtime_minutes?: number | null
          rating?: number | null
          review?: string | null
          source: Database["public"]["Enums"]["game_source"]
          status: Database["public"]["Enums"]["game_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievements_completed?: number | null
          achievements_total?: number | null
          created_at?: string | null
          game_id?: number | null
          id?: string
          platform_id?: number | null
          playtime_minutes?: number | null
          rating?: number | null
          review?: string | null
          source?: Database["public"]["Enums"]["game_source"]
          status?: Database["public"]["Enums"]["game_status"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_games_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_platform_connections: {
        Row: {
          access_token: string | null
          created_at: string | null
          id: string
          platform_name: string
          platform_user_id: string
          refresh_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          platform_name: string
          platform_user_id: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          id?: string
          platform_name?: string
          platform_user_id?: string
          refresh_token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      website_types: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_by_username: {
        Args: {
          p_username: string
        }
        Returns: Json
      }
    }
    Enums: {
      game_source: "steam" | "gog" | "manual"
      game_status:
        | "finished"
        | "playing"
        | "dropped"
        | "online"
        | "want_to_play"
        | "backlog"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

