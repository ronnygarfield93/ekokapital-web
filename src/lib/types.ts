export type Lang = "id" | "en";

export type PostCategory = "news" | "education" | "announcement" | "research";

export interface PostItem {
  id: number;
  slug: string;
  category: PostCategory;
  title_id: string;
  title_en: string;
  excerpt_id: string;
  excerpt_en: string;
  content_id: string;
  content_en: string;
  cover_image: string | null;
  published: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export type DocumentCategory =
  | "financial_report"
  | "rups"
  | "gcg"
  | "form"
  | "etop_manual";

export interface DocumentItem {
  id: number;
  category: DocumentCategory;
  year: number | null;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  file_url: string;
  file_size: string;
  published: number;
  created_at: string;
}

export interface WppeStaffItem {
  id: number;
  name: string;
  license_type: string;
  license_number: string;
  position_id: string;
  position_en: string;
  active: number;
  sort_order: number;
}

export interface NoticeItem {
  id: number;
  type: "fraud_alert" | "announcement";
  title_id: string;
  title_en: string;
  body_id: string;
  body_en: string;
  cta_label_id: string | null;
  cta_label_en: string | null;
  cta_url: string | null;
  show_as_modal: number;
  active: number;
  updated_at: string;
}

export type SubmissionType = "contact" | "complaint" | "whistleblowing";
export type SubmissionStatus = "new" | "in_review" | "resolved" | "closed";

export interface SubmissionItem {
  id: number;
  ticket_code: string;
  type: SubmissionType;
  is_anonymous: number;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  client_code: string | null;
  subject: string;
  message: string;
  status: SubmissionStatus;
  admin_notes: string | null;
  ip_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: "superadmin" | "editor";
  must_change_password: number;
  created_at: string;
  last_login_at: string | null;
}

export interface AuditLogItem {
  id: number;
  admin_email: string;
  action: string;
  target: string;
  ip_address: string;
  created_at: string;
}
