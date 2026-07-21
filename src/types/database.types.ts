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
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
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
            foreignKeyName: "stock_levels_workspace_id_fkey"
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
      canal_commande: "site_web" | "amazon" | "manuel"
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
      statut_contact_crm: "prospect" | "client" | "perdu"
      statut_invitation: "en_attente" | "acceptee" | "expiree" | "revoquee"
      statut_membre: "actif" | "invite" | "suspendu"
      statut_tache: "a_faire" | "en_cours" | "terminee"
      type_activite_crm: "note" | "appel" | "email" | "rdv"
      type_alerte_stock: "rupture" | "stock_bas" | "surstock"
      type_evenement_calendrier: "reunion" | "echeance" | "rappel"
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
      canal_commande: ["site_web", "amazon", "manuel"],
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
      statut_contact_crm: ["prospect", "client", "perdu"],
      statut_invitation: ["en_attente", "acceptee", "expiree", "revoquee"],
      statut_membre: ["actif", "invite", "suspendu"],
      statut_tache: ["a_faire", "en_cours", "terminee"],
      type_activite_crm: ["note", "appel", "email", "rdv"],
      type_alerte_stock: ["rupture", "stock_bas", "surstock"],
      type_evenement_calendrier: ["reunion", "echeance", "rappel"],
    },
  },
} as const
