import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notion } from "@/const/NotionConst";
import { isPageObjectResponse } from "@/const/Type";

export const getDatabaseData = async (
  databaseId: string
): Promise<PageObjectResponse[]> => {
  try {
    const res = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: "ステータス",
            status: { equals: "完了" },
          },
          {
            property: "ステータス",
            status: { equals: "進行中" },
          },
        ],
      },
    });
    if (!res || !res.results) {
      throw new Error("No results found in the database.");
    }
    const pageObjList = res.results.filter((item) =>
      isPageObjectResponse(item)
    );
    return pageObjList;
  } catch (e) {
    throw new Error(`Error fetching database data: ${e}`);
  }
};
