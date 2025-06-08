import {
  AppendBlockChildrenParameters,
  AppendBlockChildrenResponse,
  BulletedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  isBlockObjectResponse,
  isBulletedListItem,
  isMemberNameType,
  isStatusType,
  ParentBulletInfoType,
  StatusBulletInfoType,
} from "../const/Type";

export const formatParentBullets = (
  bullets: BulletedListItemBlockObjectResponse[]
) => {
  const bulletInfo: ParentBulletInfoType[] = [];

  bullets.map((bullet) => {
    const bulletId = bullet.id;
    const bulletText = bullet.bulleted_list_item.rich_text[0].plain_text;
    if (!isMemberNameType(bulletText)) {
      throw new Error(
        `Invalid bullet text: ${bulletText}. Expected a member name.`
      );
    }
    bulletInfo.push({
      id: bulletId,
      staff: bulletText,
    });
  });

  return bulletInfo;
};

export const formatStatusBullets = (
  bulletsList: AppendBlockChildrenResponse[]
) => {
  const statusBullets: StatusBulletInfoType[] = [];
  bulletsList.forEach((bullets) => {
    bullets.results.forEach((bullet) => {
      if (!(isBlockObjectResponse(bullet) && isBulletedListItem(bullet))) {
        return;
      }
      const id = bullet.id;
      const parentId =
        bullet.parent.type === "block_id" ? bullet.parent.block_id : "";
      if (!parentId) throw `Parent ID is missing for bullet with ID: ${id}`;
      const richText = bullet.bulleted_list_item.rich_text[0].plain_text.trim();
      if (!isStatusType(richText)) {
        throw new Error(
          `Invalid bullet text: ${richText}. Expected a member name.`
        );
      }
      statusBullets.push({ id, parentId, status: richText });
    });
  });
  return statusBullets;
};
