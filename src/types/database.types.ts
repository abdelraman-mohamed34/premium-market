export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: { id: string; tenant_id: string | null; email: string | null; full_name: string | null; phone: string | null; avatar_url: string | null; role: string; status: string; is_email_verified: boolean; created_at: string; updated_at: string };
                Insert: { id: string; tenant_id?: string | null; email?: string | null; full_name?: string | null; phone?: string | null; avatar_url?: string | null; role?: string; status?: string; is_email_verified?: boolean };
                Update: { tenant_id?: string | null; email?: string | null; full_name?: string | null; phone?: string | null; avatar_url?: string | null; role?: string; status?: string; is_email_verified?: boolean; updated_at?: string };
                Relationships: [];
            };
            tenant_memberships: {
                Row: { user_id: string; tenant_id: string; role: string; status: string };
                Insert: { user_id: string; tenant_id: string; role: string; status: string };
                Update: { user_id?: string; tenant_id?: string; role?: string; status?: string };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
}
