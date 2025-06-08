import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client";
import { MEMBER_IDS, TASK_STATUS } from "./NotionConst";

export const isPageObjectResponse = (obj: any): obj is PageObjectResponse =>
  obj && typeof obj === "object" && "object" in obj && obj.object === "page";

export const isBlockObjectResponse = (obj: any): obj is BlockObjectResponse =>
  obj && typeof obj === "object" && "object" in obj && obj.object === "block";

export const isBulletedListItem = (
  obj: BlockObjectResponse
): obj is BlockObjectResponse & { type: "bulleted_list_item" } =>
  obj?.type === "bulleted_list_item";

export type StatusType = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const isStatusType = (status: string): status is StatusType =>
  status === TASK_STATUS.DONE ||
  status === TASK_STATUS.IN_PROGRESS ||
  status === TASK_STATUS.REVIEW;

export type MemberNameType = keyof typeof MEMBER_IDS;

export const isMemberNameType = (name: string): name is MemberNameType =>
  Object.keys(MEMBER_IDS).includes(name);

export type ParentBulletInfoType = {
  id: string;
  staff: MemberNameType;
};
export type StatusBulletInfoType = {
  id: string;
  parentId: string;
  status: StatusType;
};
