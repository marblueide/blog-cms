import { getGroupByVagueName } from "@/api";
import { Article, Type } from "@/types";
import { Ref, ref } from "vue";

const queryGroupSearchAsync = async (val: string, cb: (arg: any) => void) => {
  const res = await getGroupByVagueName(val);
  cb(res);
};

export const useGroupTagInput = (form: Ref<Article>) => {
  const inputValue = ref("");
  const handleGroupInputConfirm = () => {
    if (inputValue.value) {
      form.value.groups?.push({
        name: inputValue.value,
      });
    }
  };
  const handleGroupCloseTag = (tag: Type) => {
    const index = form.value.groups?.findIndex((v) => v == tag);
    index != -1 && form.value.groups?.splice(index as number, 1);
  };
  return {
    inputValue,
    handleGroupInputConfirm,
    queryGroupSearchAsync,
    handleGroupCloseTag,
  };
};
