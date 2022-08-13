import { Tag, TagType } from "@/types";
import { Pagination } from "@/types/common";
import gql from "graphql-tag";
import { query } from "../request";

export async function getTagList(
  limit: number = 10,
  offset: number = 0,
  type?: TagType | null
) {
  const res = await query<{
    getTagsList: Pagination<Tag>;
  }>(
    gql`
      query GetTagsList($paginationQuery: PaginationQuerInput!, $type: Int) {
        getTagsList(paginationQuery: $paginationQuery, type: $type) {
          totalCount
          nodes {
            id
            type
            name
            nameEn
            weight
            createTime
          }
        }
      }
    `,
    {
      paginationQuery: {
        limit,
        offset,
      },
      type,
    },
    {
      fetchPolicy: "network-only",
    }
  );
  return res.getTagsList;
}
