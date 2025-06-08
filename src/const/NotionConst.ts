import * as dotenv from "dotenv";
import fetch from "node-fetch";
import { Client } from "@notionhq/client";

(globalThis as any).fetch = fetch;
dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_TOKEN });
export const taskDBId = process.env.TASK_DB_ID as string;
export const docId = process.env.DOC_DB_ID as string;


// ここにメンバーを追加していく
export const MEMBER_IDS = {
  "🔴川口純生": "e3cfe6f0-0732-419d-ad9c-95b7df8fca5a",
  "🔵iimon君": "55205053-6def-44e3-a48c-64748ed0f2ee",
} as const;

// タスクのステータス
export const TASK_STATUS = {
  DONE: "完了",
  IN_PROGRESS: "進行中",
  REVIEW: "レビュー依頼中",
} as const;
