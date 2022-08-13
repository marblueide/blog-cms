import { Pagination, StatusModel } from "@/types";
import gql from "graphql-tag";
import { query, mutation } from "../request";

export const getCommnet = async (offset: number = 1, limit: number = 10) => {
  return await query<{ getCommentByRoot: Pagination<Comment> }>(
    gql`
      query ($input: PaginationQuerInput!) {
        getCommentByRoot(input: $input) {
          nodes {
            id
            name
            content
            email
            likes
            visible
            hasChildren
            createTime
            article {
              id
              title
            }
            rootComment {
              id
            }
            parentComment {
              id
            }
            children: childComment {
              id
              name
              content
              email
              likes
              visible
              createTime
              article {
                id
              }
              rootComment {
                id
              }
              parentComment {
                id
              }
            }
          }
          totalCount
        }
      }
    `,
    {
      input: {
        offset: offset - 1,
        limit,
      },
    }
  );
};

export const switchCommentVisible = async (id: string, visible: boolean) => {
  const mutate = mutation<
    {
      updateComment: StatusModel;
    },
    {
      update: {
        id: string;
        visible: boolean;
      };
    }
  >(gql`
    mutation switchCommentVisible($update: updateCommentInput!) {
      updateComment(comment: $update) {
        code
        msg
      }
    }
  `);
  try {
    let res = await mutate({update:{id,visible}});
    return res?.data?.updateComment
  } catch (error) {
    console.log(error)
  }
  
};
