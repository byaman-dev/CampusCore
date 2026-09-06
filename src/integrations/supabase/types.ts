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
  public: {
    Tables: {
      achievements: {
        Row: {
          achiever: string | null
          archived: boolean
          category: string
          created_at: string
          description: string
          featured: boolean
          id: string
          image_url: string | null
          published: boolean
          sort_order: number
          title: string
          updated_at: string
          verified: boolean
          year: string | null
        }
        Insert: {
          achiever?: string | null
          archived?: boolean
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          verified?: boolean
          year?: string | null
        }
        Update: {
          achiever?: string | null
          archived?: boolean
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          verified?: boolean
          year?: string | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          created_at: string
          group_name: string
          id: string
          image_url: string | null
          note: string
          sort_order: number
          title: string
          updated_at: string
          verified: boolean
          visible: boolean
        }
        Insert: {
          created_at?: string
          group_name?: string
          id?: string
          image_url?: string | null
          note?: string
          sort_order?: number
          title: string
          updated_at?: string
          verified?: boolean
          visible?: boolean
        }
        Update: {
          created_at?: string
          group_name?: string
          id?: string
          image_url?: string | null
          note?: string
          sort_order?: number
          title?: string
          updated_at?: string
          verified?: boolean
          visible?: boolean
        }
        Relationships: []
      }
      admission_enquiries: {
        Row: {
          admin_note: string | null
          class_applied: string | null
          created_at: string
          email: string | null
          id: string
          message: string | null
          parent_name: string | null
          phone: string | null
          source: string
          status: string
          student_name: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          class_applied?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          parent_name?: string | null
          phone?: string | null
          source?: string
          status?: string
          student_name: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          class_applied?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string | null
          parent_name?: string | null
          phone?: string | null
          source?: string
          status?: string
          student_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      assignment_submissions: {
        Row: {
          assignment_id: string
          created_at: string
          file_path: string | null
          id: string
          marks: number | null
          remark: string | null
          status: string
          student_user_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          file_path?: string | null
          id?: string
          marks?: number | null
          remark?: string | null
          status?: string
          student_user_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          file_path?: string | null
          id?: string
          marks?: number | null
          remark?: string | null
          status?: string
          student_user_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          attachment_path: string | null
          class_id: string
          created_at: string
          detail: string
          due_date: string | null
          id: string
          max_marks: number | null
          posted_by: string | null
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          attachment_path?: string | null
          class_id: string
          created_at?: string
          detail?: string
          due_date?: string | null
          id?: string
          max_marks?: number | null
          posted_by?: string | null
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          attachment_path?: string | null
          class_id?: string
          created_at?: string
          detail?: string
          due_date?: string | null
          id?: string
          max_marks?: number | null
          posted_by?: string | null
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string | null
          created_at: string
          date: string
          id: string
          note: string | null
          recorded_by: string | null
          status: string
          student_user_id: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          recorded_by?: string | null
          status?: string
          student_user_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          recorded_by?: string | null
          status?: string
          student_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_label: string | null
          actor_user_id: string | null
          created_at: string
          detail: Json
          id: string
          object_id: string | null
          object_type: string | null
        }
        Insert: {
          action: string
          actor_label?: string | null
          actor_user_id?: string | null
          created_at?: string
          detail?: Json
          id?: string
          object_id?: string | null
          object_type?: string | null
        }
        Update: {
          action?: string
          actor_label?: string | null
          actor_user_id?: string | null
          created_at?: string
          detail?: Json
          id?: string
          object_id?: string | null
          object_type?: string | null
        }
        Relationships: []
      }
      classes: {
        Row: {
          created_at: string
          id: string
          name: string
          section: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          section?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          section?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          body: string | null
          created_at: string
          data: Json
          enabled: boolean
          heading: string | null
          id: string
          image_url: string | null
          key: string
          label: string
          link_label: string | null
          link_to: string | null
          page: string
          sort_order: number
          subheading: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json
          enabled?: boolean
          heading?: string | null
          id?: string
          image_url?: string | null
          key: string
          label?: string
          link_label?: string | null
          link_to?: string | null
          page?: string
          sort_order?: number
          subheading?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json
          enabled?: boolean
          heading?: string | null
          id?: string
          image_url?: string | null
          key?: string
          label?: string
          link_label?: string | null
          link_to?: string | null
          page?: string
          sort_order?: number
          subheading?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          archived: boolean
          created_at: string
          description: string
          doc_date: string | null
          file_path: string | null
          file_url: string | null
          group_name: string
          id: string
          is_public: boolean
          kind: string
          session: string | null
          sort_order: number
          title: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          archived?: boolean
          created_at?: string
          description?: string
          doc_date?: string | null
          file_path?: string | null
          file_url?: string | null
          group_name?: string
          id?: string
          is_public?: boolean
          kind?: string
          session?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          archived?: boolean
          created_at?: string
          description?: string
          doc_date?: string | null
          file_path?: string | null
          file_url?: string | null
          group_name?: string
          id?: string
          is_public?: boolean
          kind?: string
          session?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      events: {
        Row: {
          archived: boolean
          attachment_url: string | null
          category: string
          created_at: string
          description: string
          event_date: string | null
          event_time: string | null
          featured: boolean
          id: string
          image_url: string | null
          location: string | null
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          archived?: boolean
          attachment_url?: string | null
          category?: string
          created_at?: string
          description?: string
          event_date?: string | null
          event_time?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          location?: string | null
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          archived?: boolean
          attachment_url?: string | null
          category?: string
          created_at?: string
          description?: string
          event_date?: string | null
          event_time?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          location?: string | null
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          blurb: string
          created_at: string
          detail: string
          id: string
          image_url: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          blurb?: string
          created_at?: string
          detail?: string
          id?: string
          image_url?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          blurb?: string
          created_at?: string
          detail?: string
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      faculty_members: {
        Row: {
          active: boolean
          bio: string | null
          created_at: string
          designation: string
          full_name: string
          group_name: string
          id: string
          photo_url: string | null
          public_visible: boolean
          qualification: string
          sort_order: number
          subjects: string[]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          bio?: string | null
          created_at?: string
          designation?: string
          full_name?: string
          group_name?: string
          id?: string
          photo_url?: string | null
          public_visible?: boolean
          qualification?: string
          sort_order?: number
          subjects?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          bio?: string | null
          created_at?: string
          designation?: string
          full_name?: string
          group_name?: string
          id?: string
          photo_url?: string | null
          public_visible?: boolean
          qualification?: string
          sort_order?: number
          subjects?: string[]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          description: string
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          album_id: string | null
          alt_text: string
          archived: boolean
          caption: string
          category: string
          created_at: string
          featured: boolean
          id: string
          image_url: string
          show_on_home: boolean
          sort_order: number
          storage_path: string | null
          taken_on: string | null
          title: string
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          alt_text?: string
          archived?: boolean
          caption?: string
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url: string
          show_on_home?: boolean
          sort_order?: number
          storage_path?: string | null
          taken_on?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          alt_text?: string
          archived?: boolean
          caption?: string
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string
          show_on_home?: boolean
          sort_order?: number
          storage_path?: string | null
          taken_on?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      homework: {
        Row: {
          attachment_path: string | null
          class_id: string
          created_at: string
          detail: string
          due_date: string | null
          id: string
          posted_by: string | null
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          attachment_path?: string | null
          class_id: string
          created_at?: string
          detail?: string
          due_date?: string | null
          id?: string
          posted_by?: string | null
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          attachment_path?: string | null
          class_id?: string
          created_at?: string
          detail?: string
          due_date?: string | null
          id?: string
          posted_by?: string | null
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string
          archived: boolean
          bucket: string
          category: string
          created_at: string
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          title: string
          updated_at: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string
          archived?: boolean
          bucket?: string
          category?: string
          created_at?: string
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string
          archived?: boolean
          bucket?: string
          category?: string
          created_at?: string
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          featured: boolean
          id: string
          label: string
          parent_key: string | null
          route: string
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          featured?: boolean
          id?: string
          label: string
          parent_key?: string | null
          route: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          featured?: boolean
          id?: string
          label?: string
          parent_key?: string | null
          route?: string
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      notices: {
        Row: {
          archived: boolean
          attachment_name: string | null
          attachment_url: string | null
          body: string | null
          category: string
          created_at: string
          expiry_date: string | null
          id: string
          pinned: boolean
          publish_date: string
          published: boolean
          sort_order: number
          summary: string
          title: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          archived?: boolean
          attachment_name?: string | null
          attachment_url?: string | null
          body?: string | null
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          pinned?: boolean
          publish_date?: string
          published?: boolean
          sort_order?: number
          summary?: string
          title: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          archived?: boolean
          attachment_name?: string | null
          attachment_url?: string | null
          body?: string | null
          category?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          pinned?: boolean
          publish_date?: string
          published?: boolean
          sort_order?: number
          summary?: string
          title?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      parent_students: {
        Row: {
          created_at: string
          id: string
          parent_user_id: string
          relation: string
          student_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_user_id: string
          relation?: string
          student_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_user_id?: string
          relation?: string
          student_user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          admin_id: string | null
          admin_level: string | null
          admission_number: string | null
          class_id: string | null
          created_at: string
          email: string | null
          employee_id: string | null
          full_name: string
          id: string
          login_id: string | null
          must_change_password: boolean
          parent_id: string | null
          phone: string | null
          roll_number: string | null
          section: string | null
          student_id: string | null
          subjects: string[]
          updated_at: string
        }
        Insert: {
          active?: boolean
          admin_id?: string | null
          admin_level?: string | null
          admission_number?: string | null
          class_id?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          full_name?: string
          id: string
          login_id?: string | null
          must_change_password?: boolean
          parent_id?: string | null
          phone?: string | null
          roll_number?: string | null
          section?: string | null
          student_id?: string | null
          subjects?: string[]
          updated_at?: string
        }
        Update: {
          active?: boolean
          admin_id?: string | null
          admin_level?: string | null
          admission_number?: string | null
          class_id?: string | null
          created_at?: string
          email?: string | null
          employee_id?: string | null
          full_name?: string
          id?: string
          login_id?: string | null
          must_change_password?: boolean
          parent_id?: string | null
          phone?: string | null
          roll_number?: string | null
          section?: string | null
          student_id?: string | null
          subjects?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          class_id: string | null
          created_at: string
          exam_name: string
          grade: string | null
          id: string
          marks: number | null
          max_marks: number
          published: boolean
          recorded_by: string | null
          session: string | null
          student_user_id: string
          subject: string
          term: string | null
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          exam_name: string
          grade?: string | null
          id?: string
          marks?: number | null
          max_marks?: number
          published?: boolean
          recorded_by?: string | null
          session?: string | null
          student_user_id: string
          subject: string
          term?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          exam_name?: string
          grade?: string | null
          id?: string
          marks?: number | null
          max_marks?: number
          published?: boolean
          recorded_by?: string | null
          session?: string | null
          student_user_id?: string
          subject?: string
          term?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          academic_session: string
          address: string
          email: string
          favicon_url: string | null
          footer_text: string
          id: string
          logo_url: string | null
          map_lat: string | null
          map_lng: string | null
          map_url: string | null
          office_hours: string
          phones: string[]
          school_name: string
          seo_description: string
          seo_image_url: string | null
          seo_title: string
          short_name: string
          social_links: Json
          tagline: string
          updated_at: string
        }
        Insert: {
          academic_session?: string
          address?: string
          email?: string
          favicon_url?: string | null
          footer_text?: string
          id?: string
          logo_url?: string | null
          map_lat?: string | null
          map_lng?: string | null
          map_url?: string | null
          office_hours?: string
          phones?: string[]
          school_name?: string
          seo_description?: string
          seo_image_url?: string | null
          seo_title?: string
          short_name?: string
          social_links?: Json
          tagline?: string
          updated_at?: string
        }
        Update: {
          academic_session?: string
          address?: string
          email?: string
          favicon_url?: string | null
          footer_text?: string
          id?: string
          logo_url?: string | null
          map_lat?: string | null
          map_lng?: string | null
          map_url?: string | null
          office_hours?: string
          phones?: string[]
          school_name?: string
          seo_description?: string
          seo_image_url?: string | null
          seo_title?: string
          short_name?: string
          social_links?: Json
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      teacher_classes: {
        Row: {
          class_id: string
          created_at: string
          id: string
          subject: string | null
          teacher_user_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          subject?: string | null
          teacher_user_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          subject?: string | null
          teacher_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_classes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable_slots: {
        Row: {
          class_id: string
          created_at: string
          end_time: string | null
          id: string
          period: number
          room: string | null
          start_time: string | null
          subject: string
          teacher_user_id: string | null
          updated_at: string
          weekday: number
        }
        Insert: {
          class_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          period: number
          room?: string | null
          start_time?: string | null
          subject: string
          teacher_user_id?: string | null
          updated_at?: string
          weekday: number
        }
        Update: {
          class_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          period?: number
          room?: string | null
          start_time?: string | null
          subject?: string
          teacher_user_id?: string | null
          updated_at?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "timetable_slots_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_my_child: { Args: { _student_user_id: string }; Returns: boolean }
      is_teacher: { Args: never; Returns: boolean }
      teaches_class: { Args: { _class_id: string }; Returns: boolean }
      teaches_student: { Args: { _student_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin" | "parent"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "admin", "parent"],
    },
  },
} as const
