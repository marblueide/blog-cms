import { Article } from "@/types";
import { Pagination } from "@/types/common";
import gql from "graphql-tag";
import _ from "lodash";
import { query } from "../request";

export async function getArticleList(limit: number = 10, offset: number = 0) {
  let res = await query<{ getArticleList: Pagination<Article> }>(
    gql`
      query getArticleList($limit: Int!, $offset: Int!) {
        getArticleList(limit: $limit, offset: $offset) {
          totalCount
          nodes {
            id
            title
            viewNum
            summary
            content
            contentNum
            likes
            weight
            isPublic
            createTime
            updateTime
            tags {
              id
              name
            }
            groups {
              id
              name
            }
          }
        }
      }
    `,
    {
      limit,
      offset,
    },
    {
      fetchPolicy: "network-only",
    }
  );
  return res.getArticleList;
}

export async function getArticleById(id: string) {
  let res = await query<{
    getArticleById: Article
  }>(
    gql`
      query GetArticleById($ArticleId: String!) {
        getArticleById(id: $ArticleId) {
          id
          title
          viewNum
          summary
          content
          contentNum
          likes
          weight
          isPublic
          createTime
          updateTime
          tags {
            id
            name
          }
          groups {
            id
            name
          }
        }
      }
    `,
    {
      ArticleId: id,
    },
    {
      fetchPolicy: "network-only"
    }
  );
  return res.getArticleById
}
