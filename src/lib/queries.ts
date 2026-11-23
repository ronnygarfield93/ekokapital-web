import { getDb } from "./db";
import type {
  DocumentCategory,
  DocumentItem,
  NoticeItem,
  PostCategory,
  PostItem,
  WppeStaffItem,
} from "./types";

function toPlain<T>(row: unknown): T {
  return { ...(row as Record<string, unknown>) } as T;
}

function toPlainList<T>(rows: unknown[]): T[] {
  return rows.map((r) => toPlain<T>(r));
}

export function getPublishedPosts(options?: {
  category?: PostCategory;
  search?: string;
  limit?: number;
}): PostItem[] {
  const db = getDb();
  const clauses: string[] = ["published = 1"];
  const params: Array<string | number> = [];

  if (options?.category) {
    clauses.push("category = ?");
    params.push(options.category);
  }
  if (options?.search && options.search.trim()) {
    const like = `%${options.search.trim()}%`;
    clauses.push(
      "(title_id LIKE ? OR title_en LIKE ? OR excerpt_id LIKE ? OR excerpt_en LIKE ? OR content_id LIKE ? OR content_en LIKE ?)"
    );
    params.push(like, like, like, like, like, like);
  }

  let sql = `SELECT * FROM posts WHERE ${clauses.join(" AND ")} ORDER BY published_at DESC, id DESC`;
  if (options?.limit) {
    sql += " LIMIT ?";
    params.push(options.limit);
  }
  return toPlainList<PostItem>(db.prepare(sql).all(...params));
}

export function getPostBySlug(slug: string): PostItem | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM posts WHERE slug = ? AND published = 1")
    .get(slug);
  return row ? toPlain<PostItem>(row) : null;
}

export function getPublishedDocuments(category?: DocumentCategory): DocumentItem[] {
  const db = getDb();
  if (category) {
    const orderBy =
      category === "etop_desktop" ? "id ASC" : "year DESC, id DESC";
    return toPlainList<DocumentItem>(
      db
        .prepare(
          `SELECT * FROM documents WHERE published = 1 AND category = ? ORDER BY ${orderBy}`
        )
        .all(category)
    );
  }
  return toPlainList<DocumentItem>(
    db
      .prepare(
        "SELECT * FROM documents WHERE published = 1 ORDER BY category ASC, year DESC, id DESC"
      )
      .all()
  );
}

export function getActiveWppeStaff(): WppeStaffItem[] {
  const db = getDb();
  return toPlainList<WppeStaffItem>(
    db
      .prepare(
        "SELECT * FROM wppe_staff WHERE active = 1 ORDER BY sort_order ASC, id ASC"
      )
      .all()
  );
}

export function getActiveNotices(): NoticeItem[] {
  const db = getDb();
  return toPlainList<NoticeItem>(
    db.prepare("SELECT * FROM notices WHERE active = 1 ORDER BY id DESC").all()
  );
}
