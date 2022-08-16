import gql from "graphql-tag"
import { query } from "../request"

export const getPhoto = async (limit:number,offset:number) => {
  return await query(
    gql`
    `,
    {
      
    }
  )
}