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
      cart_items: {
        Row: {
          cart_id: string | null
          created_at: string | null
          id: string
          image: string | null
          option_bat: string | null
          option_color: string | null
          option_details_impression: string | null
          option_echantillon: string | null
          option_format: string | null
          option_orientation_impression: string | null
          option_poids: string | null
          option_quantity: string | null
          option_size: string | null
          option_type_de_materiaux: string | null
          option_types_impression: string | null
          price: number
          product_id: string | null
          product_name: string
          quantity: number
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          cart_id?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          option_bat?: string | null
          option_color?: string | null
          option_details_impression?: string | null
          option_echantillon?: string | null
          option_format?: string | null
          option_orientation_impression?: string | null
          option_poids?: string | null
          option_quantity?: string | null
          option_size?: string | null
          option_type_de_materiaux?: string | null
          option_types_impression?: string | null
          price: number
          product_id?: string | null
          product_name: string
          quantity?: number
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cart_id?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          option_bat?: string | null
          option_color?: string | null
          option_details_impression?: string | null
          option_echantillon?: string | null
          option_format?: string | null
          option_orientation_impression?: string | null
          option_poids?: string | null
          option_quantity?: string | null
          option_size?: string | null
          option_type_de_materiaux?: string | null
          option_types_impression?: string | null
          price?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "user_carts"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_complete: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          id: string
          product_id: string | null
          product_name: string | null
          product_options: string | null
          product_price: number | null
          product_quantity: number | null
          shipping_address_city: string | null
          shipping_address_country: string | null
          shipping_address_state: string | null
          shipping_address_street: string | null
          shipping_address_zip: string | null
          status: string
          total: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          product_id?: string | null
          product_name?: string | null
          product_options?: string | null
          product_price?: number | null
          product_quantity?: number | null
          shipping_address_city?: string | null
          shipping_address_country?: string | null
          shipping_address_state?: string | null
          shipping_address_street?: string | null
          shipping_address_zip?: string | null
          status: string
          total: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          product_id?: string | null
          product_name?: string | null
          product_options?: string | null
          product_price?: number | null
          product_quantity?: number | null
          shipping_address_city?: string | null
          shipping_address_country?: string | null
          shipping_address_state?: string | null
          shipping_address_street?: string | null
          shipping_address_zip?: string | null
          status?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      product_suppliers: {
        Row: {
          availability_status: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          price_adjustment: number | null
          product_id: string
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          price_adjustment?: number | null
          product_id: string
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          price_adjustment?: number | null
          product_id?: string
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_suppliers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_suppliers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "unified_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          bat: string | null
          color: string | null
          created_at: string | null
          details_impression: string | null
          echantillon: string | null
          format: string | null
          hex_color: string | null
          id: string
          image_url: string | null
          orientation_impression: string | null
          poids: string | null
          price_adjustment: number | null
          product_id: string
          quantite: string | null
          size: string | null
          status: string | null
          stock: number | null
          type_de_materiaux: string | null
          types_impression: string | null
          updated_at: string | null
        }
        Insert: {
          bat?: string | null
          color?: string | null
          created_at?: string | null
          details_impression?: string | null
          echantillon?: string | null
          format?: string | null
          hex_color?: string | null
          id?: string
          image_url?: string | null
          orientation_impression?: string | null
          poids?: string | null
          price_adjustment?: number | null
          product_id: string
          quantite?: string | null
          size?: string | null
          status?: string | null
          stock?: number | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
        }
        Update: {
          bat?: string | null
          color?: string | null
          created_at?: string | null
          details_impression?: string | null
          echantillon?: string | null
          format?: string | null
          hex_color?: string | null
          id?: string
          image_url?: string | null
          orientation_impression?: string | null
          poids?: string | null
          price_adjustment?: number | null
          product_id?: string
          quantite?: string | null
          size?: string | null
          status?: string | null
          stock?: number | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "unified_products"
            referencedColumns: ["id"]
          },
        ]
      }
      products_complete: {
        Row: {
          bat: string | null
          category: string
          color: string | null
          created_at: string | null
          customization_description: string | null
          customization_name: string | null
          customization_position: string | null
          customization_price_adjustment: number | null
          customization_required: boolean | null
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
          quantite: string | null
          size: string | null
          status: string
          stock: number | null
          "style  de pliages": string | null
          subcategory: string | null
          supplier_id: string | null
          supplier_selection_label: string | null
          type_de_materiaux: string | null
          types_impression: string | null
          updated_at: string | null
          variant_image_url: string | null
          variant_status: string | null
        }
        Insert: {
          bat?: string | null
          category: string
          color?: string | null
          created_at?: string | null
          customization_description?: string | null
          customization_name?: string | null
          customization_position?: string | null
          customization_price_adjustment?: number | null
          customization_required?: boolean | null
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
          quantite?: string | null
          size?: string | null
          status?: string
          stock?: number | null
          "style  de pliages"?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          supplier_selection_label?: string | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
          variant_image_url?: string | null
          variant_status?: string | null
        }
        Update: {
          bat?: string | null
          category?: string
          color?: string | null
          created_at?: string | null
          customization_description?: string | null
          customization_name?: string | null
          customization_position?: string | null
          customization_price_adjustment?: number | null
          customization_required?: boolean | null
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
          quantite?: string | null
          size?: string | null
          status?: string
          stock?: number | null
          "style  de pliages"?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          supplier_selection_label?: string | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
          variant_image_url?: string | null
          variant_status?: string | null
        }
        Relationships: []
      }
      reviews_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_review: boolean | null
          parent_id: string | null
          product_id: string
          rating: number | null
          updated_at: string | null
          user_id: string
          user_name: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_review?: boolean | null
          parent_id?: string | null
          product_id: string
          rating?: number | null
          updated_at?: string | null
          user_id: string
          user_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_review?: boolean | null
          parent_id?: string | null
          product_id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      supplier_products: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_complete"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "unified_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          company_name: string
          contact_name: string | null
          created_at: string | null
          description: string | null
          email: string
          established_date: string | null
          id: string
          phone: string | null
          rating: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          established_date?: string | null
          id: string
          phone?: string | null
          rating?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          established_date?: string | null
          id?: string
          phone?: string | null
          rating?: number | null
          status?: string
          updated_at?: string | null
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
      users_complete: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      unified_products: {
        Row: {
          bat: string | null
          category: string | null
          color: string | null
          created_at: string | null
          customization_description: string | null
          customization_name: string | null
          customization_position: string | null
          customization_price_adjustment: number | null
          customization_required: boolean | null
          customization_type: string | null
          description: string | null
          details_impression: string | null
          echantillon: string | null
          format: string | null
          hex_color: string | null
          id: string | null
          image: string | null
          is_customizable: boolean | null
          name: string | null
          orientation_impression: string | null
          original_price: number | null
          poids: string | null
          price: number | null
          quantite: string | null
          size: string | null
          status: string | null
          stock: number | null
          subcategory: string | null
          supplier_id: string | null
          type_de_materiaux: string | null
          types_impression: string | null
          updated_at: string | null
          variant_image_url: string | null
          variant_status: string | null
        }
        Insert: {
          bat?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          customization_description?: string | null
          customization_name?: string | null
          customization_position?: string | null
          customization_price_adjustment?: number | null
          customization_required?: boolean | null
          customization_type?: string | null
          description?: string | null
          details_impression?: string | null
          echantillon?: string | null
          format?: string | null
          hex_color?: string | null
          id?: string | null
          image?: string | null
          is_customizable?: boolean | null
          name?: string | null
          orientation_impression?: string | null
          original_price?: number | null
          poids?: string | null
          price?: number | null
          quantite?: string | null
          size?: string | null
          status?: string | null
          stock?: number | null
          subcategory?: string | null
          supplier_id?: string | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
          variant_image_url?: string | null
          variant_status?: string | null
        }
        Update: {
          bat?: string | null
          category?: string | null
          color?: string | null
          created_at?: string | null
          customization_description?: string | null
          customization_name?: string | null
          customization_position?: string | null
          customization_price_adjustment?: number | null
          customization_required?: boolean | null
          customization_type?: string | null
          description?: string | null
          details_impression?: string | null
          echantillon?: string | null
          format?: string | null
          hex_color?: string | null
          id?: string | null
          image?: string | null
          is_customizable?: boolean | null
          name?: string | null
          orientation_impression?: string | null
          original_price?: number | null
          poids?: string | null
          price?: number | null
          quantite?: string | null
          size?: string | null
          status?: string | null
          stock?: number | null
          subcategory?: string | null
          supplier_id?: string | null
          type_de_materiaux?: string | null
          types_impression?: string | null
          updated_at?: string | null
          variant_image_url?: string | null
          variant_status?: string | null
        }
        Relationships: []
      }
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
