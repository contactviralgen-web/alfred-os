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
    PostgrestVersion: "14.5"
  }
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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      activity_log: {
        Row: {
          acteur_id: string | null
          action: string
          cible_id: string | null
          cible_type: string | null
          cree_le: string
          id: string
          metadonnees: Json
          organization_id: string
          workspace_id: string | null
        }
        Insert: {
          acteur_id?: string | null
          action: string
          cible_id?: string | null
          cible_type?: string | null
          cree_le?: string
          id?: string
          metadonnees?: Json
          organization_id: string
          workspace_id?: string | null
        }
        Update: {
          acteur_id?: string | null
          action?: string
          cible_id?: string | null
          cible_type?: string | null
          cree_le?: string
          id?: string
          metadonnees?: Json
          organization_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_acteur_id_fkey"
            columns: ["acteur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      amazon_connections: {
        Row: {
          connecte_le: string | null
          id: string
          marketplaces: string[]
          modifie_le: string
          organization_id: string
          seller_id: string | null
          statut: Database["public"]["Enums"]["statut_connexion_amazon"]
          workspace_id: string
        }
        Insert: {
          connecte_le?: string | null
          id?: string
          marketplaces?: string[]
          modifie_le?: string
          organization_id: string
          seller_id?: string | null
          statut?: Database["public"]["Enums"]["statut_connexion_amazon"]
          workspace_id: string
        }
        Update: {
          connecte_le?: string | null
          id?: string
          marketplaces?: string[]
          modifie_le?: string
          organization_id?: string
          seller_id?: string | null
          statut?: Database["public"]["Enums"]["statut_connexion_amazon"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "amazon_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "amazon_connections_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_executions: {
        Row: {
          cree_le: string
          id: string
          resume: string
          rule_id: string
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          resume: string
          rule_id: string
          workspace_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          resume?: string
          rule_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_executions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_executions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actif: boolean
          action: Database["public"]["Enums"]["action_automatisation"]
          cree_le: string
          declencheur: Database["public"]["Enums"]["declencheur_automatisation"]
          description: string | null
          id: string
          nom: string
          organization_id: string
          workspace_id: string
        }
        Insert: {
          actif?: boolean
          action: Database["public"]["Enums"]["action_automatisation"]
          cree_le?: string
          declencheur: Database["public"]["Enums"]["declencheur_automatisation"]
          description?: string | null
          id?: string
          nom: string
          organization_id: string
          workspace_id: string
        }
        Update: {
          actif?: boolean
          action?: Database["public"]["Enums"]["action_automatisation"]
          cree_le?: string
          declencheur?: Database["public"]["Enums"]["declencheur_automatisation"]
          description?: string | null
          id?: string
          nom?: string
          organization_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_rules_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          cree_le: string
          cree_par: string | null
          debut_le: string
          fin_le: string | null
          id: string
          organization_id: string
          titre: string
          type: Database["public"]["Enums"]["type_evenement_calendrier"]
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          cree_par?: string | null
          debut_le: string
          fin_le?: string | null
          id?: string
          organization_id: string
          titre: string
          type?: Database["public"]["Enums"]["type_evenement_calendrier"]
          workspace_id: string
        }
        Update: {
          cree_le?: string
          cree_par?: string | null
          debut_le?: string
          fin_le?: string | null
          id?: string
          organization_id?: string
          titre?: string
          type?: Database["public"]["Enums"]["type_evenement_calendrier"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_activities: {
        Row: {
          contact_id: string | null
          contenu: string
          cree_le: string
          cree_par: string | null
          date_activite: string
          id: string
          organization_id: string
          type: Database["public"]["Enums"]["type_activite_crm"]
          workspace_id: string
        }
        Insert: {
          contact_id?: string | null
          contenu: string
          cree_le?: string
          cree_par?: string | null
          date_activite?: string
          id?: string
          organization_id: string
          type?: Database["public"]["Enums"]["type_activite_crm"]
          workspace_id: string
        }
        Update: {
          contact_id?: string | null
          contenu?: string
          cree_le?: string
          cree_par?: string | null
          date_activite?: string
          id?: string
          organization_id?: string
          type?: Database["public"]["Enums"]["type_activite_crm"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "v_crm_contact_summary"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "crm_activities_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_activities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          assigne_a: string | null
          cree_le: string
          cree_par: string | null
          email: string | null
          id: string
          modifie_le: string
          nom: string | null
          notes: string | null
          organization_id: string
          prenom: string | null
          score_ia: number | null
          source: string | null
          statut: Database["public"]["Enums"]["statut_contact_crm"]
          tags: string[]
          telephone: string | null
          workspace_id: string
        }
        Insert: {
          assigne_a?: string | null
          cree_le?: string
          cree_par?: string | null
          email?: string | null
          id?: string
          modifie_le?: string
          nom?: string | null
          notes?: string | null
          organization_id: string
          prenom?: string | null
          score_ia?: number | null
          source?: string | null
          statut?: Database["public"]["Enums"]["statut_contact_crm"]
          tags?: string[]
          telephone?: string | null
          workspace_id: string
        }
        Update: {
          assigne_a?: string | null
          cree_le?: string
          cree_par?: string | null
          email?: string | null
          id?: string
          modifie_le?: string
          nom?: string | null
          notes?: string | null
          organization_id?: string
          prenom?: string | null
          score_ia?: number | null
          source?: string | null
          statut?: Database["public"]["Enums"]["statut_contact_crm"]
          tags?: string[]
          telephone?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_assigne_a_fkey"
            columns: ["assigne_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contacts_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_contacts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          cree_le: string
          email: string
          expire_le: string
          id: string
          invite_par: string | null
          organization_id: string
          role_id: string
          statut: Database["public"]["Enums"]["statut_invitation"]
          token: string
        }
        Insert: {
          cree_le?: string
          email: string
          expire_le?: string
          id?: string
          invite_par?: string | null
          organization_id: string
          role_id: string
          statut?: Database["public"]["Enums"]["statut_invitation"]
          token?: string
        }
        Update: {
          cree_le?: string
          email?: string
          expire_le?: string
          id?: string
          invite_par?: string | null
          organization_id?: string
          role_id?: string
          statut?: Database["public"]["Enums"]["statut_invitation"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invite_par_fkey"
            columns: ["invite_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          cree_le: string
          destinataire_id: string
          id: string
          lien: string | null
          lue: boolean
          message: string | null
          organization_id: string
          titre: string
          type: string
        }
        Insert: {
          cree_le?: string
          destinataire_id: string
          id?: string
          lien?: string | null
          lue?: boolean
          message?: string | null
          organization_id: string
          titre: string
          type: string
        }
        Update: {
          cree_le?: string
          destinataire_id?: string
          id?: string
          lien?: string | null
          lue?: boolean
          message?: string | null
          organization_id?: string
          titre?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_destinataire_id_fkey"
            columns: ["destinataire_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          marge_unitaire: number
          order_id: string
          prix_unitaire: number
          product_id: string | null
          quantite: number
        }
        Insert: {
          id?: string
          marge_unitaire?: number
          order_id: string
          prix_unitaire?: number
          product_id?: string | null
          quantite?: number
        }
        Update: {
          id?: string
          marge_unitaire?: number
          order_id?: string
          prix_unitaire?: number
          product_id?: string | null
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
        ]
      }
      orders: {
        Row: {
          canal: Database["public"]["Enums"]["canal_commande"]
          client_nom: string | null
          contact_id: string | null
          cree_le: string
          id: string
          montant_marge: number
          montant_total: number
          numero_commande: string
          organization_id: string
          statut: Database["public"]["Enums"]["statut_commande"]
          workspace_id: string
        }
        Insert: {
          canal?: Database["public"]["Enums"]["canal_commande"]
          client_nom?: string | null
          contact_id?: string | null
          cree_le?: string
          id?: string
          montant_marge?: number
          montant_total?: number
          numero_commande: string
          organization_id: string
          statut?: Database["public"]["Enums"]["statut_commande"]
          workspace_id: string
        }
        Update: {
          canal?: Database["public"]["Enums"]["canal_commande"]
          client_nom?: string | null
          contact_id?: string | null
          cree_le?: string
          id?: string
          montant_marge?: number
          montant_total?: number
          numero_commande?: string
          organization_id?: string
          statut?: Database["public"]["Enums"]["statut_commande"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "v_crm_contact_summary"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          cree_le: string
          id: string
          invite_par: string | null
          organization_id: string
          role_id: string
          statut: Database["public"]["Enums"]["statut_membre"]
          user_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          invite_par?: string | null
          organization_id: string
          role_id: string
          statut?: Database["public"]["Enums"]["statut_membre"]
          user_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          invite_par?: string | null
          organization_id?: string
          role_id?: string
          statut?: Database["public"]["Enums"]["statut_membre"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_invite_par_fkey"
            columns: ["invite_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          cree_le: string
          cree_par: string | null
          id: string
          logo_url: string | null
          modifie_le: string
          nom: string
          parametres: Json
          plan: Database["public"]["Enums"]["plan_organisation"]
          slug: string
          supprime_le: string | null
        }
        Insert: {
          cree_le?: string
          cree_par?: string | null
          id?: string
          logo_url?: string | null
          modifie_le?: string
          nom: string
          parametres?: Json
          plan?: Database["public"]["Enums"]["plan_organisation"]
          slug: string
          supprime_le?: string | null
        }
        Update: {
          cree_le?: string
          cree_par?: string | null
          id?: string
          logo_url?: string | null
          modifie_le?: string
          nom?: string
          parametres?: Json
          plan?: Database["public"]["Enums"]["plan_organisation"]
          slug?: string
          supprime_le?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          cle: string
          description: string | null
          id: string
          module: string
        }
        Insert: {
          cle: string
          description?: string | null
          id?: string
          module: string
        }
        Update: {
          cle?: string
          description?: string | null
          id?: string
          module?: string
        }
        Relationships: []
      }
      product_cost_settings: {
        Row: {
          cout_divers_flat: number
          cout_douane_flat: number
          cout_transport_flat: number
          cree_le: string
          frais_amazon_pct: number
          frais_fba_flat: number
          frais_stockage_unitaire_flat: number
          id: string
          modifie_le: string
          organization_id: string
          product_id: string
          taux_retour_pct: number
          workspace_id: string
        }
        Insert: {
          cout_divers_flat?: number
          cout_douane_flat?: number
          cout_transport_flat?: number
          cree_le?: string
          frais_amazon_pct?: number
          frais_fba_flat?: number
          frais_stockage_unitaire_flat?: number
          id?: string
          modifie_le?: string
          organization_id: string
          product_id: string
          taux_retour_pct?: number
          workspace_id: string
        }
        Update: {
          cout_divers_flat?: number
          cout_douane_flat?: number
          cout_transport_flat?: number
          cree_le?: string
          frais_amazon_pct?: number
          frais_fba_flat?: number
          frais_stockage_unitaire_flat?: number
          id?: string
          modifie_le?: string
          organization_id?: string
          product_id?: string
          taux_retour_pct?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_cost_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_cost_settings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_cost_settings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_cost_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      product_returns: {
        Row: {
          cree_le: string
          id: string
          motif: Database["public"]["Enums"]["motif_retour_amazon"]
          organization_id: string
          product_id: string
          quantite: number
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          motif?: Database["public"]["Enums"]["motif_retour_amazon"]
          organization_id: string
          product_id: string
          quantite?: number
          workspace_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          motif?: Database["public"]["Enums"]["motif_retour_amazon"]
          organization_id?: string
          product_id?: string
          quantite?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_returns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_returns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_returns_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_returns_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          actif: boolean
          categorie: string | null
          cree_le: string
          id: string
          image_url: string | null
          modifie_le: string
          nom: string
          organization_id: string
          prix_achat: number
          prix_vente: number
          sku: string
          workspace_id: string
        }
        Insert: {
          actif?: boolean
          categorie?: string | null
          cree_le?: string
          id?: string
          image_url?: string | null
          modifie_le?: string
          nom: string
          organization_id: string
          prix_achat?: number
          prix_vente?: number
          sku: string
          workspace_id: string
        }
        Update: {
          actif?: boolean
          categorie?: string | null
          cree_le?: string
          id?: string
          image_url?: string | null
          modifie_le?: string
          nom?: string
          organization_id?: string
          prix_achat?: number
          prix_vente?: number
          sku?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cree_le: string
          derniere_connexion_le: string | null
          derniere_organisation_id: string | null
          email: string
          id: string
          modifie_le: string
          nom_complet: string | null
        }
        Insert: {
          avatar_url?: string | null
          cree_le?: string
          derniere_connexion_le?: string | null
          derniere_organisation_id?: string | null
          email: string
          id: string
          modifie_le?: string
          nom_complet?: string | null
        }
        Update: {
          avatar_url?: string | null
          cree_le?: string
          derniere_connexion_le?: string | null
          derniere_organisation_id?: string | null
          email?: string
          id?: string
          modifie_le?: string
          nom_complet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_derniere_organisation_fk"
            columns: ["derniere_organisation_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      reimbursement_claims: {
        Row: {
          cree_le: string
          dossier_texte: string | null
          id: string
          modifie_le: string
          montant_estime: number
          organization_id: string
          product_id: string
          quantite: number
          statut: Database["public"]["Enums"]["statut_reclamation"]
          type_incident: Database["public"]["Enums"]["type_incident_remboursement"]
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          dossier_texte?: string | null
          id?: string
          modifie_le?: string
          montant_estime?: number
          organization_id: string
          product_id: string
          quantite?: number
          statut?: Database["public"]["Enums"]["statut_reclamation"]
          type_incident: Database["public"]["Enums"]["type_incident_remboursement"]
          workspace_id: string
        }
        Update: {
          cree_le?: string
          dossier_texte?: string | null
          id?: string
          modifie_le?: string
          montant_estime?: number
          organization_id?: string
          product_id?: string
          quantite?: number
          statut?: Database["public"]["Enums"]["statut_reclamation"]
          type_incident?: Database["public"]["Enums"]["type_incident_remboursement"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reimbursement_claims_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reimbursement_claims_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reimbursement_claims_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reimbursement_claims_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_forecasts: {
        Row: {
          chiffre_affaires_prevu: number
          date: string
          genere_le: string
          id: string
          intervalle_confiance_bas: number
          intervalle_confiance_haut: number
          modele: string
          organization_id: string
          workspace_id: string
        }
        Insert: {
          chiffre_affaires_prevu?: number
          date: string
          genere_le?: string
          id?: string
          intervalle_confiance_bas?: number
          intervalle_confiance_haut?: number
          modele?: string
          organization_id: string
          workspace_id: string
        }
        Update: {
          chiffre_affaires_prevu?: number
          date?: string
          genere_le?: string
          id?: string
          intervalle_confiance_bas?: number
          intervalle_confiance_haut?: number
          modele?: string
          organization_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_forecasts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_forecasts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_metrics: {
        Row: {
          benefice: number
          chiffre_affaires: number
          date: string
          id: string
          nombre_commandes: number
          organization_id: string
          panier_moyen: number
          workspace_id: string
        }
        Insert: {
          benefice?: number
          chiffre_affaires?: number
          date: string
          id?: string
          nombre_commandes?: number
          organization_id: string
          panier_moyen?: number
          workspace_id: string
        }
        Update: {
          benefice?: number
          chiffre_affaires?: number
          date?: string
          id?: string
          nombre_commandes?: number
          organization_id?: string
          panier_moyen?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_metrics_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          cree_le: string
          description: string | null
          est_systeme: boolean
          id: string
          nom: string
          organization_id: string | null
          slug: string
        }
        Insert: {
          cree_le?: string
          description?: string | null
          est_systeme?: boolean
          id?: string
          nom: string
          organization_id?: string | null
          slug: string
        }
        Update: {
          cree_le?: string
          description?: string | null
          est_systeme?: boolean
          id?: string
          nom?: string
          organization_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_alerts: {
        Row: {
          cree_le: string
          id: string
          product_id: string
          statut: Database["public"]["Enums"]["statut_alerte_stock"]
          type: Database["public"]["Enums"]["type_alerte_stock"]
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          product_id: string
          statut?: Database["public"]["Enums"]["statut_alerte_stock"]
          type: Database["public"]["Enums"]["type_alerte_stock"]
          workspace_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          product_id?: string
          statut?: Database["public"]["Enums"]["statut_alerte_stock"]
          type?: Database["public"]["Enums"]["type_alerte_stock"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_alerts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_alerts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_levels: {
        Row: {
          id: string
          mis_a_jour_le: string
          product_id: string
          quantite_disponible: number
          quantite_reservee: number
          seuil_alerte: number
          workspace_id: string
        }
        Insert: {
          id?: string
          mis_a_jour_le?: string
          product_id: string
          quantite_disponible?: number
          quantite_reservee?: number
          seuil_alerte?: number
          workspace_id: string
        }
        Update: {
          id?: string
          mis_a_jour_le?: string
          product_id?: string
          quantite_disponible?: number
          quantite_reservee?: number
          seuil_alerte?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_levels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_levels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_levels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          cree_le: string
          id: string
          motif: string | null
          organization_id: string
          product_id: string
          quantite: number
          type: Database["public"]["Enums"]["type_mouvement_stock"]
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          motif?: string | null
          organization_id: string
          product_id: string
          quantite: number
          type: Database["public"]["Enums"]["type_mouvement_stock"]
          workspace_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          motif?: string | null
          organization_id?: string
          product_id?: string
          quantite?: number
          type?: Database["public"]["Enums"]["type_mouvement_stock"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_movements_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_invoices: {
        Row: {
          cree_le: string
          date_echeance: string | null
          date_emission: string
          date_paiement: string | null
          id: string
          montant: number
          numero_facture: string
          organization_id: string
          statut: Database["public"]["Enums"]["statut_facture_fournisseur"]
          supplier_id: string
          supplier_order_id: string | null
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          date_echeance?: string | null
          date_emission?: string
          date_paiement?: string | null
          id?: string
          montant?: number
          numero_facture: string
          organization_id: string
          statut?: Database["public"]["Enums"]["statut_facture_fournisseur"]
          supplier_id: string
          supplier_order_id?: string | null
          workspace_id: string
        }
        Update: {
          cree_le?: string
          date_echeance?: string | null
          date_emission?: string
          date_paiement?: string | null
          id?: string
          montant?: number
          numero_facture?: string
          organization_id?: string
          statut?: Database["public"]["Enums"]["statut_facture_fournisseur"]
          supplier_id?: string
          supplier_order_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "v_supplier_performance"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_invoices_supplier_order_id_fkey"
            columns: ["supplier_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_invoices_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_order_items: {
        Row: {
          cree_le: string
          id: string
          prix_unitaire: number
          product_id: string
          quantite: number
          supplier_order_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          prix_unitaire?: number
          product_id: string
          quantite: number
          supplier_order_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          prix_unitaire?: number
          product_id?: string
          quantite?: number
          supplier_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "supplier_order_items_supplier_order_id_fkey"
            columns: ["supplier_order_id"]
            isOneToOne: false
            referencedRelation: "supplier_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_orders: {
        Row: {
          cree_le: string
          date_commande: string
          date_livraison_prevue: string | null
          date_livraison_reelle: string | null
          date_paiement_prevue: string | null
          id: string
          modifie_le: string
          montant_total: number
          notes: string | null
          numero_commande: string
          organization_id: string
          statut: Database["public"]["Enums"]["statut_commande_fournisseur"]
          supplier_id: string
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          date_commande?: string
          date_livraison_prevue?: string | null
          date_livraison_reelle?: string | null
          date_paiement_prevue?: string | null
          id?: string
          modifie_le?: string
          montant_total?: number
          notes?: string | null
          numero_commande: string
          organization_id: string
          statut?: Database["public"]["Enums"]["statut_commande_fournisseur"]
          supplier_id: string
          workspace_id: string
        }
        Update: {
          cree_le?: string
          date_commande?: string
          date_livraison_prevue?: string | null
          date_livraison_reelle?: string | null
          date_paiement_prevue?: string | null
          id?: string
          modifie_le?: string
          montant_total?: number
          notes?: string | null
          numero_commande?: string
          organization_id?: string
          statut?: Database["public"]["Enums"]["statut_commande_fournisseur"]
          supplier_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "v_supplier_performance"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "supplier_orders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          adresse: string | null
          cree_le: string
          delai_livraison_jours: number | null
          email: string | null
          id: string
          modifie_le: string
          nom: string
          notes: string | null
          organization_id: string
          statut: Database["public"]["Enums"]["statut_fournisseur"]
          telephone: string | null
          workspace_id: string
        }
        Insert: {
          adresse?: string | null
          cree_le?: string
          delai_livraison_jours?: number | null
          email?: string | null
          id?: string
          modifie_le?: string
          nom: string
          notes?: string | null
          organization_id: string
          statut?: Database["public"]["Enums"]["statut_fournisseur"]
          telephone?: string | null
          workspace_id: string
        }
        Update: {
          adresse?: string | null
          cree_le?: string
          delai_livraison_jours?: number | null
          email?: string | null
          id?: string
          modifie_le?: string
          nom?: string
          notes?: string | null
          organization_id?: string
          statut?: Database["public"]["Enums"]["statut_fournisseur"]
          telephone?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigne_a: string | null
          cree_le: string
          description: string | null
          echeance_le: string | null
          id: string
          modifie_le: string
          organization_id: string
          priorite: Database["public"]["Enums"]["priorite_tache"]
          statut: Database["public"]["Enums"]["statut_tache"]
          titre: string
          workspace_id: string
        }
        Insert: {
          assigne_a?: string | null
          cree_le?: string
          description?: string | null
          echeance_le?: string | null
          id?: string
          modifie_le?: string
          organization_id: string
          priorite?: Database["public"]["Enums"]["priorite_tache"]
          statut?: Database["public"]["Enums"]["statut_tache"]
          titre: string
          workspace_id: string
        }
        Update: {
          assigne_a?: string | null
          cree_le?: string
          description?: string | null
          echeance_le?: string | null
          id?: string
          modifie_le?: string
          organization_id?: string
          priorite?: Database["public"]["Enums"]["priorite_tache"]
          statut?: Database["public"]["Enums"]["statut_tache"]
          titre?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigne_a_fkey"
            columns: ["assigne_a"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          cree_le: string
          team_id: string
          user_id: string
        }
        Insert: {
          cree_le?: string
          team_id: string
          user_id: string
        }
        Update: {
          cree_le?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          cree_le: string
          description: string | null
          id: string
          modifie_le: string
          nom: string
          organization_id: string
        }
        Insert: {
          cree_le?: string
          description?: string | null
          id?: string
          modifie_le?: string
          nom: string
          organization_id: string
        }
        Update: {
          cree_le?: string
          description?: string | null
          id?: string
          modifie_le?: string
          nom?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_cost_settings: {
        Row: {
          cree_le: string
          id: string
          modifie_le: string
          organization_id: string
          prix_ttc: boolean
          taux_tva_pct: number
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          modifie_le?: string
          organization_id: string
          prix_ttc?: boolean
          taux_tva_pct?: number
          workspace_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          modifie_le?: string
          organization_id?: string
          prix_ttc?: boolean
          taux_tva_pct?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_cost_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_cost_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          cree_le: string
          id: string
          role_id: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          cree_le?: string
          id?: string
          role_id?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          cree_le?: string
          id?: string
          role_id?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          cree_le: string
          cree_par: string | null
          description: string | null
          icone: string | null
          id: string
          modifie_le: string
          nom: string
          organization_id: string
          parametres: Json
          slug: string
          supprime_le: string | null
        }
        Insert: {
          cree_le?: string
          cree_par?: string | null
          description?: string | null
          icone?: string | null
          id?: string
          modifie_le?: string
          nom: string
          organization_id: string
          parametres?: Json
          slug: string
          supprime_le?: string | null
        }
        Update: {
          cree_le?: string
          cree_par?: string | null
          description?: string | null
          icone?: string | null
          id?: string
          modifie_le?: string
          nom?: string
          organization_id?: string
          parametres?: Json
          slug?: string
          supprime_le?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_cree_par_fkey"
            columns: ["cree_par"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspaces_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_crm_contact_summary: {
        Row: {
          contact_id: string | null
          derniere_commande_le: string | null
          nombre_commandes: number | null
          total_depense: number | null
          workspace_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      v_product_margins: {
        Row: {
          canal: Database["public"]["Enums"]["canal_commande"] | null
          categorie: string | null
          chiffre_affaires: number | null
          cout_divers_flat: number | null
          cout_douane_flat: number | null
          cout_transport_flat: number | null
          cree_le: string | null
          frais_amazon_pct: number | null
          frais_fba_flat: number | null
          frais_stockage_unitaire_flat: number | null
          order_id: string | null
          order_item_id: string | null
          organization_id: string | null
          prix_achat: number | null
          prix_ttc: boolean | null
          prix_unitaire: number | null
          product_id: string | null
          produit_nom: string | null
          quantite: number | null
          statut: Database["public"]["Enums"]["statut_commande"] | null
          taux_retour_pct: number | null
          taux_tva_pct: number | null
          workspace_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      v_supplier_performance: {
        Row: {
          commandes_livrees: number | null
          commandes_livrees_a_temps: number | null
          commandes_livrees_avec_dates: number | null
          supplier_id: string | null
          workspace_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      v_top_products: {
        Row: {
          categorie: string | null
          chiffre_affaires: number | null
          image_url: string | null
          marge_totale: number | null
          nom: string | null
          organization_id: string | null
          product_id: string | null
          quantite_vendue: number | null
          workspace_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_margins"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_invitation: {
        Args: { p_token: string }
        Returns: {
          cree_le: string
          id: string
          invite_par: string | null
          organization_id: string
          role_id: string
          statut: Database["public"]["Enums"]["statut_membre"]
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "organization_members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_organization: {
        Args: { p_nom: string; p_slug: string }
        Returns: {
          cree_le: string
          cree_par: string | null
          id: string
          logo_url: string | null
          modifie_le: string
          nom: string
          parametres: Json
          plan: Database["public"]["Enums"]["plan_organisation"]
          slug: string
          supprime_le: string | null
        }
        SetofOptions: {
          from: "*"
          to: "organizations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_invitation_preview: {
        Args: { p_token: string }
        Returns: {
          email: string
          expire_le: string
          organization_nom: string
          role_nom: string
          statut: Database["public"]["Enums"]["statut_invitation"]
        }[]
      }
      has_permission: {
        Args: { p_organization_id: string; p_permission_key: string }
        Returns: boolean
      }
      is_organization_member: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      is_workspace_member: {
        Args: { p_workspace_id: string }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_action?: string
          p_cible_id?: string
          p_cible_type?: string
          p_metadonnees?: Json
          p_organization_id: string
          p_workspace_id?: string
        }
        Returns: string
      }
      relier_ou_creer_contact_depuis_commande: {
        Args: {
          p_client_nom: string
          p_email?: string
          p_organization_id: string
          p_workspace_id: string
        }
        Returns: string
      }
    }
    Enums: {
      action_automatisation: "creer_tache" | "envoyer_notification"
      canal_commande: "site_web" | "amazon" | "manuel"
      declencheur_automatisation:
        | "stock_bas"
        | "commande_bloquee"
        | "fournisseur_en_retard"
      motif_retour_amazon:
        | "defectueux"
        | "ne_correspond_pas"
        | "taille_couleur"
        | "change_avis"
        | "autre"
      plan_organisation: "essai" | "starter" | "pro" | "entreprise"
      priorite_tache: "basse" | "normale" | "haute"
      statut_alerte_stock: "ouverte" | "resolue"
      statut_commande:
        | "en_attente"
        | "confirmee"
        | "expediee"
        | "livree"
        | "bloquee"
        | "annulee"
      statut_commande_fournisseur:
        | "brouillon"
        | "envoyee"
        | "confirmee"
        | "en_transit"
        | "livree"
        | "annulee"
      statut_connexion_amazon: "connecte" | "deconnecte"
      statut_contact_crm: "prospect" | "client" | "perdu"
      statut_facture_fournisseur: "en_attente" | "payee" | "en_retard"
      statut_fournisseur: "actif" | "inactif"
      statut_invitation: "en_attente" | "acceptee" | "expiree" | "revoquee"
      statut_membre: "actif" | "invite" | "suspendu"
      statut_reclamation:
        | "detecte"
        | "dossier_pret"
        | "soumis"
        | "recupere"
        | "rejete"
      statut_tache: "a_faire" | "en_cours" | "terminee"
      type_activite_crm: "note" | "appel" | "email" | "rdv"
      type_alerte_stock: "rupture" | "stock_bas" | "surstock"
      type_evenement_calendrier: "reunion" | "echeance" | "rappel"
      type_incident_remboursement:
        | "stock_perdu"
        | "stock_endommage"
        | "remboursement_manquant"
        | "frais_errone"
      type_mouvement_stock: "entree" | "sortie" | "ajustement"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      action_automatisation: ["creer_tache", "envoyer_notification"],
      canal_commande: ["site_web", "amazon", "manuel"],
      declencheur_automatisation: [
        "stock_bas",
        "commande_bloquee",
        "fournisseur_en_retard",
      ],
      motif_retour_amazon: [
        "defectueux",
        "ne_correspond_pas",
        "taille_couleur",
        "change_avis",
        "autre",
      ],
      plan_organisation: ["essai", "starter", "pro", "entreprise"],
      priorite_tache: ["basse", "normale", "haute"],
      statut_alerte_stock: ["ouverte", "resolue"],
      statut_commande: [
        "en_attente",
        "confirmee",
        "expediee",
        "livree",
        "bloquee",
        "annulee",
      ],
      statut_commande_fournisseur: [
        "brouillon",
        "envoyee",
        "confirmee",
        "en_transit",
        "livree",
        "annulee",
      ],
      statut_connexion_amazon: ["connecte", "deconnecte"],
      statut_contact_crm: ["prospect", "client", "perdu"],
      statut_facture_fournisseur: ["en_attente", "payee", "en_retard"],
      statut_fournisseur: ["actif", "inactif"],
      statut_invitation: ["en_attente", "acceptee", "expiree", "revoquee"],
      statut_membre: ["actif", "invite", "suspendu"],
      statut_reclamation: [
        "detecte",
        "dossier_pret",
        "soumis",
        "recupere",
        "rejete",
      ],
      statut_tache: ["a_faire", "en_cours", "terminee"],
      type_activite_crm: ["note", "appel", "email", "rdv"],
      type_alerte_stock: ["rupture", "stock_bas", "surstock"],
      type_evenement_calendrier: ["reunion", "echeance", "rappel"],
      type_incident_remboursement: [
        "stock_perdu",
        "stock_endommage",
        "remboursement_manquant",
        "frais_errone",
      ],
      type_mouvement_stock: ["entree", "sortie", "ajustement"],
    },
  },
} as const
