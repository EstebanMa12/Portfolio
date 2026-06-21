export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          content: string;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          locale: string;
          published_at: string | null;
          reading_time_min: number | null;
          seo_canonical: string | null;
          seo_description: string | null;
          seo_noindex: boolean;
          seo_og_image: string | null;
          seo_title: string | null;
          slug: string;
          status: Database["public"]["Enums"]["content_status"];
          tags: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          content: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt: string;
          id?: string;
          locale?: string;
          published_at?: string | null;
          reading_time_min?: number | null;
          seo_canonical?: string | null;
          seo_description?: string | null;
          seo_noindex?: boolean;
          seo_og_image?: string | null;
          seo_title?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["content_status"];
          tags?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          locale?: string;
          published_at?: string | null;
          reading_time_min?: number | null;
          seo_canonical?: string | null;
          seo_description?: string | null;
          seo_noindex?: boolean;
          seo_og_image?: string | null;
          seo_title?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["content_status"];
          tags?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experience_technologies: {
        Row: {
          experience_id: string;
          technology_id: string;
        };
        Insert: {
          experience_id: string;
          technology_id: string;
        };
        Update: {
          experience_id?: string;
          technology_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "experience_technologies_experience_id_fkey";
            columns: ["experience_id"];
            isOneToOne: false;
            referencedRelation: "experiences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "experience_technologies_technology_id_fkey";
            columns: ["technology_id"];
            isOneToOne: false;
            referencedRelation: "technologies";
            referencedColumns: ["id"];
          },
        ];
      };
      experiences: {
        Row: {
          bullets: Json;
          company: string;
          created_at: string;
          end_date: string | null;
          id: string;
          locale: string;
          role: string;
          sort_order: number;
          start_date: string;
          updated_at: string;
        };
        Insert: {
          bullets?: Json;
          company: string;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          locale?: string;
          role: string;
          sort_order?: number;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          bullets?: Json;
          company?: string;
          created_at?: string;
          end_date?: string | null;
          id?: string;
          locale?: string;
          role?: string;
          sort_order?: number;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          created_at: string;
          filename: string;
          id: string;
          mime_type: string;
          size_bytes: number;
          storage_path: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          filename: string;
          id?: string;
          mime_type: string;
          size_bytes: number;
          storage_path: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          filename?: string;
          id?: string;
          mime_type?: string;
          size_bytes?: number;
          storage_path?: string;
        };
        Relationships: [];
      };
      page_content: {
        Row: {
          data: Json;
          id: string;
          locale: string;
          updated_at: string;
        };
        Insert: {
          data: Json;
          id: string;
          locale?: string;
          updated_at?: string;
        };
        Update: {
          data?: Json;
          id?: string;
          locale?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_technologies: {
        Row: {
          project_id: string;
          technology_id: string;
        };
        Insert: {
          project_id: string;
          technology_id: string;
        };
        Update: {
          project_id?: string;
          technology_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey";
            columns: ["technology_id"];
            isOneToOne: false;
            referencedRelation: "technologies";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          category: string;
          content: string | null;
          cover_image_url: string | null;
          created_at: string;
          demo_url: string | null;
          featured: boolean;
          github_url: string | null;
          id: string;
          locale: string;
          problem: string;
          result: string;
          seo_canonical: string | null;
          seo_description: string | null;
          seo_noindex: boolean;
          seo_og_image: string | null;
          seo_title: string | null;
          slug: string;
          solution: string;
          sort_order: number;
          status: Database["public"]["Enums"]["content_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          content?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          demo_url?: string | null;
          featured?: boolean;
          github_url?: string | null;
          id?: string;
          locale?: string;
          problem: string;
          result: string;
          seo_canonical?: string | null;
          seo_description?: string | null;
          seo_noindex?: boolean;
          seo_og_image?: string | null;
          seo_title?: string | null;
          slug: string;
          solution: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          content?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          demo_url?: string | null;
          featured?: boolean;
          github_url?: string | null;
          id?: string;
          locale?: string;
          problem?: string;
          result?: string;
          seo_canonical?: string | null;
          seo_description?: string | null;
          seo_noindex?: boolean;
          seo_og_image?: string | null;
          seo_title?: string | null;
          slug?: string;
          solution?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["content_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seo_settings: {
        Row: {
          default_description: string;
          default_og_image: string | null;
          id: number;
          locale: string;
          site_name: string;
          site_url: string;
          title_template: string;
          twitter_handle: string | null;
          updated_at: string;
        };
        Insert: {
          default_description: string;
          default_og_image?: string | null;
          id: number;
          locale?: string;
          site_name: string;
          site_url: string;
          title_template?: string;
          twitter_handle?: string | null;
          updated_at?: string;
        };
        Update: {
          default_description?: string;
          default_og_image?: string | null;
          id?: number;
          locale?: string;
          site_name?: string;
          site_url?: string;
          title_template?: string;
          twitter_handle?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          category: Database["public"]["Enums"]["tech_category"];
          created_at: string;
          icon_url: string | null;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          category: Database["public"]["Enums"]["tech_category"];
          created_at?: string;
          icon_url?: string | null;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          category?: Database["public"]["Enums"]["tech_category"];
          created_at?: string;
          icon_url?: string | null;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      content_status: "draft" | "published";
      tech_category: "language" | "framework" | "infra" | "database" | "tool";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export const Constants = {
  public: {
    Enums: {
      content_status: ["draft", "published"],
      tech_category: ["language", "framework", "infra", "database", "tool"],
    },
  },
} as const;
