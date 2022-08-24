import axios, { AxiosResponse } from "axios";
import { InputTipParamsType, InputTipResponseType } from "./type";

const key = "e594af48db742a0d4fa50ecba373b47d";

const request = axios.create();
request.interceptors.response.use((response) => {
  return response.data;
});

const inputTip = (
  params: InputTipParamsType
): Promise<AxiosResponse<InputTipResponseType>["data"]> => {
  return request.get("https://restapi.amap.com/v3/assistant/inputtips", {
    params: {
      key,
      ...params,
    },
  });
};

export const gaodeMap = {
  inputTip,
};
