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
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          product_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          product_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          product_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      customizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_required: boolean | null
          name: string
          position: string | null
          price_adjustment: number | null
          product_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          name: string
          position?: string | null
          price_adjustment?: number | null
          product_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_required?: boolean | null
          name?: string
          position?: string | null
          price_adjustment?: number | null
          product_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          items: Json
          shipping_address: Json | null
          status: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          items: Json
          shipping_address?: Json | null
          status: string
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          items?: Json
          shipping_address?: Json | null
          status?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string
          created_at: string | null
          id: string
          product_id: string
          rating: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          product_id: string
          rating: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          product_id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          company_name: string
          contact_name: string | null
          created_at: string | null
          email: string
          id: string
          phone: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string | null
          email: string
          id: string
          phone?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      unified_products: {
        Row: {
          bat: string | null
          category: string
          color: string | null
          created_at: string | null
          customizations: Json | null
          description: string | null
          details_impression: string | null
          echantillon: string | null
          format: string | null
          hex_color: string | null
          id: string
          image: string | null
          is_customizable: boolean | null
          name: string
          orientation_impression: string | null
          original_price: number | null
          poids: string | null
          price: number
          price_adjustment: number | null
          quantite: string | null
          size: string | null
          status: string
          stock: number | null
          subcategory: string | null
          supplier_id: string | null
          type_de_materiaux: string | null
          types_impression: string | null
          updated_at: string | null
          variant_image_url: string | null
          variant_images: string | null
          variant_status: string | null
          variants: Json | null
        }
        Insert: {
          bat?: string | null
          category: string
          color?: string | null
          created_at?: string | null
          customizations?: Json | null
          description?: string | null
          details_impression?: string | null
          echantillon?: string | null
          format?: string | null
          hex_color?: string | null
          id: string
          image?: string | null
          is_customizable?: boolean | null
          name: string
          orientation_impression?: string | null
          original_price?: number | null
          poids?: string | null
          price: number
          price_adjustment?: number | null
          quantite?: string | null
          size?: string | null
          status?: string
          stock?: number | null
          subcategory?: string | null
          supplier_id?: string | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
          variant_image_url?: string | null
          variant_images?: string | null
          variant_status?: string | null
          variants?: Json | null
        }
        Update: {
          bat?: string | null
          category?: string
          color?: string | null
          created_at?: string | null
          customizations?: Json | null
          description?: string | null
          details_impression?: string | null
          echantillon?: string | null
          format?: string | null
          hex_color?: string | null
          id?: string
          image?: string | null
          is_customizable?: boolean | null
          name?: string
          orientation_impression?: string | null
          original_price?: number | null
          poids?: string | null
          price?: number
          price_adjustment?: number | null
          quantite?: string | null
          size?: string | null
          status?: string
          stock?: number | null
          subcategory?: string | null
          supplier_id?: string | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
          variant_image_url?: string | null
          variant_images?: string | null
          variant_status?: string | null
          variants?: Json | null
        }
        Relationships: []
      }
      user_carts: {
        Row: {
          cart_items: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cart_items?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cart_items?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
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
      customization_type: "text" | "image"
      position_type: "front" | "back" | "sleeve" | "collar"
      product_status: "draft" | "published" | "archived"
      supplier_status: "active" | "pending" | "suspended"
      variant_status: "in_stock" | "low_stock" | "out_of_stock"
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
