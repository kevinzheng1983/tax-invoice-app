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
  graphql_public: {
    Tables: { [_ in never]: never };
    Views: { [_ in never]: never };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
  public: {
    Tables: {
      business_settings: {
        Row: {
          ahm_provider_number: string;
          arhg_provider_number: string;
          bupa_provider_number: string;
          created_at: string;
          default_provider_number: string;
          hcf_provider_number: string;
          id: boolean;
          medibank_provider_number: string;
          updated_at: string;
        };
        Insert: {
          ahm_provider_number?: string;
          arhg_provider_number?: string;
          bupa_provider_number?: string;
          created_at?: string;
          default_provider_number?: string;
          hcf_provider_number?: string;
          id?: boolean;
          medibank_provider_number?: string;
          updated_at?: string;
        };
        Update: {
          ahm_provider_number?: string;
          arhg_provider_number?: string;
          bupa_provider_number?: string;
          created_at?: string;
          default_provider_number?: string;
          hcf_provider_number?: string;
          id?: boolean;
          medibank_provider_number?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          address: string | null;
          created_at: string;
          email: string | null;
          id: string;
          insurance_company: string | null;
          name: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          insurance_company?: string | null;
          name: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          insurance_company?: string | null;
          name?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          amount: number;
          created_at: string;
          customer_id: string;
          id: string;
          invoice_date: string;
          invoice_number: string;
          item_description: string;
          tax: number;
          updated_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          customer_id: string;
          id?: string;
          invoice_date?: string;
          invoice_number: string;
          item_description: string;
          tax?: number;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          customer_id?: string;
          id?: string;
          invoice_date?: string;
          invoice_number?: string;
          item_description?: string;
          tax?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals["public"];

export type Tables<
  TableName extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[TableName] extends {
  Row: infer Row;
}
  ? Row
  : never;

export type TablesInsert<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends { Insert: infer Insert }
    ? Insert
    : never;

export type TablesUpdate<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName] extends { Update: infer Update }
    ? Update
    : never;
