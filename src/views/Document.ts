import { BlockObjectRequest } from "@notionhq/client";
import { Member, Members, TasksType } from "../members/Member";
import { StatusType } from "../const/Type";

export const getTitle = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `【${year}-${month}-${day}】議事録`;
};

export const getOpeningDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const hours = "14";
  const minutes = "00";
  return `${year}-${month}-${day}T${hours}:${minutes}:00.000+09:00`;
};

export const getListParents = (members: Members): BlockObjectRequest[] => {
  const listParents: BlockObjectRequest[] = [];
  members.getMembers().forEach((member) => {
    const listParent = getListParent(member);
    listParents.push(listParent);
  });
  return listParents;
};

export const getListParent = (member: Member): BlockObjectRequest => {
  return {
    object: "block",
    type: "bulleted_list_item",
    bulleted_list_item: {
      rich_text: [
        {
          text: { content: `${member.name}` },
        },
      ],
    },
  };
};

export const getStatusBullet = (status: StatusType): BlockObjectRequest => ({
  object: "block",
  type: "bulleted_list_item",
  bulleted_list_item: {
    rich_text: [
      {
        text: { content: status },
      },
    ],
  },
});

export const getTaskBlocks = (tasks: TasksType): BlockObjectRequest[] => {
  const taskBlocks: BlockObjectRequest[] = [];
  tasks.forEach((task) => {
    const block: BlockObjectRequest = {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            type: "text",
            text: { content: task.title, link: { url: task.url } },
          },
        ],
      },
    };
    taskBlocks.push(block);
  });
  return taskBlocks;
};

const createCompletedChildren = (tasks: TasksType): BlockObjectRequest[] => {
  const completed: BlockObjectRequest[] = [];
  tasks.forEach((task) => {
    const block: BlockObjectRequest = {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
        rich_text: [
          {
            text: { content: "" },
          },
        ],
      },
    };
  });

  return completed;
};
