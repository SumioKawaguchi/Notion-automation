import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  isMemberNameType,
  isStatusType,
  MemberNameType,
  StatusType,
} from "@/const/Type";
import { MEMBER_IDS } from "@/const/NotionConst";

type TaskType = {
  title: string;
  status: StatusType;
  url: string;
};

export type TasksType = TaskType[];

export class Member {
  readonly id: string;
  readonly name: MemberNameType;
  private tasks: TasksType = [];

  constructor(name: MemberNameType, id: string) {
    this.id = id;
    this.name = name;
  }

  public getTasks = (): TasksType => this.tasks;

  private getOwnTasks = (pages: PageObjectResponse[]): PageObjectResponse[] => {
    const ownPages = pages.filter((page) => {
      const properties = page.properties;
      const memberProp = properties["担当者"];
      if (memberProp && memberProp.type === "people") {
        const people = memberProp.people;
        return people.some((person) => person.id === this.id);
      }
      return false;
    });
    return ownPages;
  };

  setTasks = (pages: PageObjectResponse[]): void => {
    try {
      const tasks: TasksType = [];
      const ownPages = this.getOwnTasks(pages);

      ownPages.forEach((page) => {
        const properties = page.properties;
        const url = page.url;
        let title = "";
        const titleProp = properties["Title"];
        if (
          titleProp.type === "title" &&
          Array.isArray(titleProp.title) &&
          titleProp.title.length > 0
        ) {
          title = titleProp.title[0].plain_text;
        }
        let status = "";
        const statusProp = properties["ステータス"];
        if (statusProp && statusProp.type === "status" && statusProp.status) {
          status = statusProp.status.name;
        }
        if (!isStatusType(status)) {
          throw new Error(`Invalid status "${status}" for task "${title}"..`);
        }

        tasks.push({
          title,
          status,
          url,
        });
      });

      this.tasks = tasks;
    } catch (e) {
      throw new Error(e as string);
    }
  };
}

export class Members {
  private members: Member[] = [];

  constructor(tasks: PageObjectResponse[]) {
    this.setMembers(tasks);
  }

  private setMembers = (tasks: PageObjectResponse[]) => {
    const members: Member[] = [];
    const memberObj = MEMBER_IDS;
    Object.entries(memberObj).map(([name, id]) => {
      if (!isMemberNameType(name)) {
        throw new Error(`Invalid member name "${name}".`);
      }
      const member = new Member(name, id);
      member.setTasks(tasks);
      members.push(member);
    });
    this.members = members;
  };

  getMembers = (): Member[] => this.members;
}
