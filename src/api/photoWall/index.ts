import { PhotoWall } from "@/types";
import { Pagination } from "@/types/common";
import gql from "graphql-tag";
import _ from "lodash";
import { query } from "../request";

export async function getPhotoWallList(limit: number = 10, offset: number = 0) {
  let res = await query<{
    getPhotoWallList: Pagination<PhotoWall>;
  }>(
    gql`
      query GetPhotoWallList($input: PaginationQuerInput!) {
        getPhotoWallList(input: $input) {
          totalCount
          nodes {
            id
            name
            path
            originUrl
            author
            createTime
            tags {
              id
              name
            }
          }
        }
      }
    `,
    {
      input: {
        limit,
        offset,
      },
    },
    {
      fetchPolicy: "network-only",
    }
  );
  return res.getPhotoWallList;
}
