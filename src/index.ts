import { PageObjectResponse } from "@notionhq/client";
import { getDatabaseData } from "@/api/notion/DBRequest";
import {
  appendStatusBullets,
  appendTasks,
  createDocument,
  getBlockList,
} from "@/api/notion/DocumentRequest";
import { taskDBId } from "@/const/NotionConst";
import { Members } from "@/members/Member";
import { isBlockObjectResponse, isBulletedListItem } from "@/const/Type";
import {
  formatParentBullets,
  formatStatusBullets,
} from "@/formatter/Formatter";

const main = async () => {
  try {
    const startTime = performance.now();
    const tasksRes = await getDatabaseData(taskDBId);
    const members = new Members(tasksRes);
    const createPageRes = await createDocument(members);
    const id = createPageRes.id;

    const createdBlock = await getBlockList(id);
    const results = createdBlock.results;
    const bulletListItems = results.filter(
      (item) => isBlockObjectResponse(item) && isBulletedListItem(item)
    );
    const parentBulletInfo = formatParentBullets(bulletListItems);
    const statusBullets = await appendStatusBullets(parentBulletInfo);
    const statusBulletInfo = formatStatusBullets(statusBullets);
    await appendTasks(parentBulletInfo, statusBulletInfo, members);
    const endTIme = performance.now();

    console.info(
      `Document created successfully in ${(
        (endTIme - startTime) /
        1000
      ).toFixed(2)} seconds`
    );
  } catch (endpointsError) {
    console.error("An error occurred:", endpointsError);
  }
};

main();
