import { Pagination, StatusModel, Type } from "@/types";
import gql from "graphql-tag";
import { query, mutation } from "../request";

export const getType = async (offset: number = 1, limit: number = 10) => {
  return await query<{
    getTypeByRoot: Pagination<Type>;
  }>(
    gql`
      query getType($getTypeByRootInput2: PaginationQuerInput!) {
        getTypeByRoot(input: $getTypeByRootInput2) {
          nodes {
            id
            name
            nameEn
            describe
            createTime
            rootType {
              id
              name
            }
            parentType {
              id
              name
            }
            children: childType {
              ...typeFields
            }
            hasChildren
          }
          totalCount
        }
      }

      fragment typeFields on Type {
        id
        name
        nameEn
        describe
        createTime
        rootType {
          id
          name
        }
        parentType {
          id
          name
        }
        children: childType {
          id
          name
          createTime
          rootType {
            id
            name
          }
          parentType {
            id
            name
          }
        }
      }
    `,
    {
      getTypeByRootInput2: {
        limit,
        offset: offset,
      },
    },
    {
      fetchPolicy: "cache-and-network",
    }
  );
};

export const getTypeByNameVague = async (name: string) => {
  let res =  await query<{
    getTypeByNameVague: Type[];
  }>(
    gql`
      query GetTypeByNameVague($name: String!) {
        getTypeByNameVague(name: $name) {
          id
          name
          nameEn
          describe
        }
      }
    `,
    {
      name
    },
    {
      fetchPolicy: "cache-and-network",
    }
  );
  return res.getTypeByNameVague
};

export const deleteType = async (id: string) => {
  return mutation<
    {
      deleteType: StatusModel;
    },
    {
      deleteTypeId: string;
    }
  >(
    gql`
      mutation deleteType($deleteTypeId: String!) {
        deleteType(id: $deleteTypeId) {
          code
          msg
        }
      }
    `,
    {
      deleteTypeId: id,
    }
  );
};

export const createType = async ({
  name,
  nameEn,
  describe,
  parentType,
  rootType,
}: Type) => {
  return await mutation<{
    createType: StatusModel;
  }>(
    gql`
      mutation createType($input: createTypeInput!) {
        createType(input: $input) {
          code
          msg
        }
      }
    `,
    {
      input: {
        name,
        nameEn,
        describe,
        parentType: parentType?.id ?? null,
        rootType: rootType?.id ?? null,
      },
    }
  );
};

export const updateType = async ({ name, id, nameEn, describe }: Type) => {
  return await mutation<{
    updateType: StatusModel;
  }>(
    gql`
      mutation updateType($input: updateTypeInput!) {
        updateType(input: $input) {
          code
          msg
        }
      }
    `,
    {
      input: {
        name,
        id,
        nameEn,
        describe,
      },
    }
  );
};

export const getTypeByName = async (name: string) => {
  return await query<{
    getTypeByNameAndRoot: Type;
  }>(
    gql`
      query getTypeByName($name: String!) {
        getTypeByNameAndRoot(name: $name) {
          id
          name
          childType {
            id
            name
            childType {
              id
              name
            }
          }
        }
      }
    `,
    {
      name,
    },
    {
      fetchPolicy: "cache-and-network",
    }
  );
};
