import { getTagByNameVague } from "@/api";
import { Type } from "@/types";
import { Ref, ref } from "vue";

const querySearchAsync = async (val: string, cb: (arg: any) => void) => {
  const res = await getTagByNameVague(val);
  cb(res.getTagByVagueName);
};

export const useTagInput = (form: Ref) => {
  const inputValue = ref("");
  const handleInputConfirm = () => {
    if (inputValue.value) {
      form.value.tags?.push({
        name: inputValue.value,
      });
    }
  };
  const handleCloseTag = (tag: Type) => {
    const index = form.value.tags?.findIndex((v) => v == tag);
    index != -1 && form.value.tags?.splice(index as number, 1);
  };
  return {
    inputValue,
    handleInputConfirm,
    querySearchAsync,
    handleCloseTag,
  };
};
