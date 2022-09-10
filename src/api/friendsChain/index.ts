import { FriendsChain, FriendsChainType } from "@/types";
import { Pagination, StatusModel } from "@/types/common";
import gql from "graphql-tag";
import { query, mutation } from "../request";

export const getFriendsChainList = async (limit: number, page: number = 1) => {
  return await query<{
    getFriendsChainList: Pagination<FriendsChain>;
  }>(
    gql`
      query getFriendsChain($getFriendsChainListInput: PaginationQuerInput!) {
        getFriendsChainList(input: $getFriendsChainListInput) {
          nodes {
            id
            name
            link
            imgSrc
            Introduction
            type {
              id
              name
            }
          }
          totalCount
        }
      }
    `,
    {
      getFriendsChainListInput: {
        limit,
        offset: (page - 1) * limit,
      },
    },
    {
      fetchPolicy: "cache-and-network",
    }
  );
};

export const deleteFriendsChain = async (id: string) => {
  return await mutation<
    {
      deleteFriendsChain: StatusModel;
    },
    {
      id: string;
    }
  >(
    gql`
      mutation deleteFriendsChain($id: String!) {
        deleteFriendsChain(id: $id) {
          code
          msg
        }
      }
    `,
    {
      id,
    }
  );
};

export const getChainTypeList = async (
  limit: number = 10,
  page: number = 1
) => {
  return await query<{
    getChainTypeList: Pagination<FriendsChainType>;
  }>(
    gql`
      query listFriendType($input: PaginationQuerInput!) {
        getChainTypeList(input: $input) {
          nodes {
            id
            name
          }
          totalCount
        }
      }
    `,
    {
      input: {
        limit,
        offset: (page - 1) * limit,
      },
    },
    {
      fetchPolicy: "network-only",
    }
  );
};

export const deletChainType = async (id: string) => {
  return await mutation<
    {
      deleteChainType: StatusModel;
    },
    {
      id: string;
    }
  >(
    gql`
      mutation deleteChainType($id: String!) {
        deleteChainType(id: $id) {
          code
          msg
        }
      }
    `,
    {
      id,
    }
  );
};

export const updateChainType = async (id: string, name?: string) => {
  return await mutation<
    {
      updateChainType: StatusModel;
    },
    {
      input: {
        id: string;
        name: string | null | undefined;
      };
    }
  >(
    gql`
      mutation updateChainType($input: UpdateFriendsChainType!) {
        updateChainType(input: $input) {
          code
          msg
        }
      }
    `,
    {
      input: {
        id,
        name,
      },
    }
  );
};

export const createChainType = async (name?: string) => {
  return mutation<
    {
      createChainType: StatusModel;
    },
    {
      name?: string;
    }
  >(
    gql`
      mutation createFriendType($name: String!) {
        createChainType(name: $name) {
          code
          msg
        }
      }
    `,
    {
      name,
    }
  );
};
