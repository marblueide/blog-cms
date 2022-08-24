export type InputTipParamsType = {
  keywords: string,
  type?: string,
  location?:  string,
  city?: string,
  citylimit?: string,
  datatype?: string
}

export type InputTipResponseType = {
  status: string,
  info: string,
  count: string,
  tips: InputTipType[]
}

export type InputTipType = {
  id: string,
  name: string,
  district: string,
  adcode: string,
  location: string,
  address: string,
  typecode: string,
}