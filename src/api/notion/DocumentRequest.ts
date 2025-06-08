import {
  AppendBlockChildrenResponse,
  BlockObjectRequest,
} from "@notionhq/client/build/src/api-endpoints";
import { notion, TASK_STATUS } from "@/const/NotionConst";
import { Members } from "@/members/Member";
import {
  getListParents,
  getOpeningDate,
  getStatusBullet,
  getTaskBlocks,
  getTitle,
} from "@/views/Document";
import { ParentBulletInfoType, StatusBulletInfoType } from "@/const/Type";

export const createDocument = async (members: Members) => {
  try {
    const children = getListParents(members);
    const res = await notion.pages.create({
      parent: { database_id: process.env.DOC_DB_ID as string },
      properties: {
        タイトル: {
          title: [
            {
              type: "text",
              text: { content: getTitle() },
            },
          ],
        },
        開催日時: {
          date: {
            start: getOpeningDate(),
          },
        },
      },
      children,
    });
    return res;
  } catch (e) {
    throw new Error(`Error creating document: ${e}`);
  }
};

export const getBlockList = async (block_id: string) => {
  try {
    const res = await notion.blocks.children.list({ block_id });
    return res;
  } catch (e) {
    throw new Error(`Error fetching block list: ${e}`);
  }
};

export const appendStatusBullets = async (bullets: ParentBulletInfoType[]) => {
  try {
    const statusBullets: BlockObjectRequest[] = [
      getStatusBullet(TASK_STATUS.DONE),
      getStatusBullet(TASK_STATUS.REVIEW),
      getStatusBullet(TASK_STATUS.IN_PROGRESS),
    ];

    const promises: Promise<AppendBlockChildrenResponse>[] = [];
    bullets.forEach((bullet) => {
      const bulletId = bullet.id;
      const promise = notion.blocks.children.append({
        block_id: bulletId,
        children: statusBullets,
      });
      promises.push(promise);
    });

    const resArr = await Promise.all(promises);
    return resArr;
  } catch (e) {
    throw new Error(`Error setting status bullets: ${e}`);
  }
};

export const appendTasks = async (
  parentBulletInfo: ParentBulletInfoType[],
  statusBullets: StatusBulletInfoType[],
  members: Members
) => {
  try {
    const memberList = members.getMembers();
    const promises: Promise<AppendBlockChildrenResponse>[] = [];
    memberList.forEach((member) => {
      Object.values(TASK_STATUS).forEach((status) => {
        const parent = parentBulletInfo.find(
          (bullet) => bullet.staff === member.name
        );
        if (!parent) {
          throw new Error(`Parent bullet not found for member ${member.name}`);
        }
        const parentId = parent.id;
        const statusBullet = statusBullets.find(
          (bullet) => bullet.status === status && bullet.parentId === parentId
        );
        if (!statusBullet) {
          throw new Error(
            `Status bullet not found for status ${status} and parent ID ${parentId}`
          );
        }
        const targetId = statusBullet.id;

        const tasks = member.getTasks();
        const targetTasks = tasks.filter((task) => task.status === status);
        const taskBlocks = getTaskBlocks(targetTasks);
        if (!taskBlocks.length) return;

        promises.push(
          notion.blocks.children.append({
            block_id: targetId,
            children: taskBlocks,
          })
        );
      });
    });
    const resArr = await Promise.all(promises);
    return resArr;
  } catch (e) {
    throw new Error(`Error appending tasks: ${e}`);
  }
};
