export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: number
          name: string
          user_id?: string | null
          brand: string | null
          category: string | null
          in_stock: boolean | null
          price: number | null
          carbs_per_serving: number | null
          fat_per_serving: number | null
          protein_per_serving: number | null
          calories_per_serving: number | null
          servings_per_container: number | null
          serving_size_grams: number | null
          serving_quantity: number | null
          serving_unit: string | null
          serving_unit_type: 'volume' | 'weight' | 'package' | null
          image_url: string | null
          nutrition_source: string | null
          barcode: string | null
          last_purchased: string | null
          purchase_count: number | null
          rating: number | null
          last_edited: string | null
          normalized_name: string | null
          ingredients: string | null
          notes: { text: string; date: string }[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          name: string
          user_id?: string | null
          brand?: string | null
          category?: string | null
          in_stock?: boolean | null
          price?: number | null
          carbs_per_serving?: number | null
          fat_per_serving?: number | null
          protein_per_serving?: number | null
          calories_per_serving?: number | null
          servings_per_container?: number | null
          serving_size_grams?: number | null
          serving_quantity?: number | null
          serving_unit?: string | null
          serving_unit_type?: 'volume' | 'weight' | 'package' | null
          image_url?: string | null
          nutrition_source?: string | null
          barcode?: string | null
          last_purchased?: string | null
          purchase_count?: number | null
          rating?: number | null
          last_edited?: string | null
          normalized_name?: never
          ingredients?: string | null
          notes?: { text: string; date: string }[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: never
          name?: string
          user_id?: string | null
          brand?: string | null
          category?: string | null
          in_stock?: boolean | null
          price?: number | null
          carbs_per_serving?: number | null
          fat_per_serving?: number | null
          protein_per_serving?: number | null
          calories_per_serving?: number | null
          servings_per_container?: number | null
          serving_size_grams?: number | null
          serving_quantity?: number | null
          serving_unit?: string | null
          serving_unit_type?: 'volume' | 'weight' | 'package' | null
          image_url?: string | null
          nutrition_source?: string | null
          barcode?: string | null
          last_purchased?: string | null
          purchase_count?: number | null
          rating?: number | null
          last_edited?: string | null
          normalized_name?: never
          ingredients?: string | null
          notes?: { text: string; date: string }[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      recipes: {
        Row: {
          id: number
          name: string
          user_id?: string | null
          total_time: number | null
          servings: number | null
          instructions: string | null
          nutrition_per_serving: Record<string, unknown> | null
          ingredient_list: string[] | null
          nutrition_source: string | null
          is_favorite: boolean | null
          source_link: string | null
          notes: string | null
          feedback: { text: string; date: string }[] | null
          times_cooked: number | null
          last_cooked: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: never
          name: string
          user_id?: string | null
          total_time?: number | null
          servings?: number | null
          instructions?: string | null
          nutrition_per_serving?: Record<string, unknown> | null
          ingredient_list?: string[] | null
          nutrition_source?: string | null
          is_favorite?: boolean | null
          source_link?: string | null
          notes?: string | null
          feedback?: { text: string; date: string }[] | null
          times_cooked?: number | null
          last_cooked?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: never
          name?: string
          user_id?: string | null
          total_time?: number | null
          servings?: number | null
          instructions?: string | null
          nutrition_per_serving?: Record<string, unknown> | null
          ingredient_list?: string[] | null
          nutrition_source?: string | null
          is_favorite?: boolean | null
          source_link?: string | null
          notes?: string | null
          feedback?: { text: string; date: string }[] | null
          times_cooked?: number | null
          last_cooked?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      recipe_items: {
        Row: {
          recipe_id: number
          item_id: number
          quantity: number | null
          unit: string | null
          cost_per_unit: number | null
          total_cost: number | null
          cost_calculated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          recipe_id: number
          item_id: number
          quantity?: number | null
          unit?: string | null
          cost_per_unit?: number | null
          total_cost?: number | null
          cost_calculated_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          recipe_id?: number
          item_id?: number
          quantity?: number | null
          unit?: string | null
          cost_per_unit?: number | null
          total_cost?: number | null
          cost_calculated_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      meal_logs: {
        Row: {
          id: number
          user_id?: string | null
          recipe_ids: number[]
          meal_name: string | null
          cooked_at: string | null
          notes: string | null
          rating: number | null
          macros: Record<string, unknown> | null
          cost: number | null
          created_at: string | null
        }
        Insert: {
          id?: never
          user_id?: string | null
          recipe_ids: number[]
          meal_name?: string | null
          cooked_at?: string | null
          notes?: string | null
          rating?: number | null
          macros?: Record<string, unknown> | null
          cost?: number | null
          created_at?: string | null
        }
        Update: {
          id?: never
          user_id?: string | null
          recipe_ids?: number[]
          meal_name?: string | null
          cooked_at?: string | null
          notes?: string | null
          rating?: number | null
          macros?: Record<string, unknown> | null
          cost?: number | null
          created_at?: string | null
        }
      }
      weekly_meal_plans: {
        Row: {
          id: number
          week_start: string
          user_id?: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: never
          week_start: string
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: never
          week_start?: string
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      meal_plan_blocks: {
        Row: {
          id: number
          weekly_plan_id: number
          name: string
          start_day: number
          end_day: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: never
          weekly_plan_id: number
          name: string
          start_day: number
          end_day: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: never
          weekly_plan_id?: number
          name?: string
          start_day?: number
          end_day?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      recipe_rotations: {
        Row: {
          id: number
          block_id: number
          name: string
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: never
          block_id: number
          name: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: never
          block_id?: number
          name?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      rotation_recipes: {
        Row: {
          rotation_id: number
          recipe_id: number
          created_at: string | null
        }
        Insert: {
          rotation_id: number
          recipe_id: number
          created_at?: string | null
        }
        Update: {
          rotation_id?: number
          recipe_id?: number
          created_at?: string | null
        }
      }
      block_snacks: {
        Row: {
          block_id: number
          recipe_id: number
          created_at: string | null
        }
        Insert: {
          block_id: number
          recipe_id: number
          created_at?: string | null
        }
        Update: {
          block_id?: number
          recipe_id?: number
          created_at?: string | null
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          user_id?: string | null
          color: string | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: never
          name: string
          user_id?: string | null
          color?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: never
          name?: string
          user_id?: string | null
          color?: string | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      recipe_tags: {
        Row: {
          recipe_id: number
          tag_id: number
          created_at: string | null
        }
        Insert: {
          recipe_id: number
          tag_id: number
          created_at?: string | null
        }
        Update: {
          recipe_id?: number
          tag_id?: number
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      upsert_item_by_name: {
        Args: {
          p_name: string
          p_brand: string
          p_price: number
          p_category?: string
          p_in_stock?: boolean
        }
        Returns: Database['public']['Tables']['items']['Row']
      }
      batch_upsert_items: {
        Args: {
          items_data: Record<string, unknown>
        }
        Returns: Database['public']['Tables']['items']['Row'][]
      }
      get_suggested_recipes: {
        Args: {
          p_limit?: number
        }
        Returns: {
          recipe_id: number
          recipe_name: string
          total_ingredients: number
          available_ingredients: number
          availability_percentage: number
        }[]
      }
      get_analytics_data: {
        Args: {
          p_days_back?: number
        }
        Returns: {
          avg_meal_cost: number
          avg_calories: number
          avg_protein: number
          avg_carbs: number
          avg_fat: number
          total_meals: number
          top_recipes: Record<string, unknown>
        }[]
      }
      update_recipe_stats: {
        Args: {
          p_recipe_id: number
        }
        Returns: void
      }
      calculate_recipe_cost: {
        Args: {
          p_recipe_id: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
