<template>
  <div
    class="emoji-box"
    :class="{ top: top, left: left, right: right, bottom: bottom }"
    v-if="emojiVisible"
  >
    <article class="">
      <div class="title">
        <span>{{ currentIcon }}</span>
        <span class="el-icon" @click="emit('update:emojiVisible', false)"
          ><Close
        /></span>
      </div>
      <div class="content-box">
        <span
          class="content"
          :style="{ 'flex-basis': 100 / colLen + '%' }"
          v-for="it in filterEmoji(EmojiData[currentIcon])"
          @click="handlerClick(it.emoji)"
        >
          {{ it.emoji }}
        </span>
      </div>
    </article>
    <div class="emoji-tabs">
      <span
        class="emoji-tab"
        :class="{ active: key == currentIcon }"
        @click="currentIcon = key"
        v-for="(it, key) in customIcon"
        >{{ it }}</span
      >
    </div>
  </div>
  <div class="emoji-modal" v-if="emojiVisible" @click="emit('update:emojiVisible', false)"></div>
</template>

<script lang="ts" setup>
import OriginData from "@/assets/emoji-data.json";
import { Close } from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import { IconData, IconGroup, IconGroupKey, IconGroupListType } from "./types";
let EmojiData: IconData = OriginData as IconData;
console.log(Object.keys(EmojiData));

const props = withDefaults(
  defineProps<{
    emojiVisible: boolean;
    colLen?: number;
    customIcon?: IconGroupListType;
    top?: boolean;
    left?: boolean;
    right?: boolean;
    bottom?: boolean;
  }>(),
  {
    emojiVisible: false,
    customIcon: {
      //@ts-ignore
      "Smileys & Emotion": "😀",
      "People & Body": "👋",
      "Animals & Nature": "🦊",
      "Food & Drink": "🍊",
      Activities: "🎃",
      Objects: "👔",
      Symbols: "🆎",
      Flags: "🚩",
    },
    colLen: 8,
  }
);

const emit = defineEmits<{
  (e: "update:emojiVisible", show: boolean): void;
  (e: "emojiClick", emoji: string): void;
}>();

const currentIcon = ref<IconGroupKey>("Smileys & Emotion");
const filterEmoji = computed(() => {
  return (list: IconGroup) => {
    return list.filter((it) => {
      if (it.emoji.length >= 5) return false;
      return true;
    });
  };
});

const handlerClick = (emoji: string) => {
  emit("emojiClick", emoji);
  emit("update:emojiVisible", false);
};
</script>

<style lang="scss" scoped>
.emoji-box {
  position: absolute;
  width: 400px;
  border-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  background-color: white;
  overflow: hidden;
  z-index: 99;
  &.top {
    bottom: 100%;
  }
  &.left {
    right: 100%;
    transform: translateY(-100%);
  }
  &.bottom {
    top: 100%;
  }
  &.right {
    left: 100%;
    transform: translateY(-100%);
  }
}
.title {
  display: flex;
  padding: 10px 15px;
  justify-content: space-between;
  align-items: center;
}
.content-box {
  display: flex;
  flex-wrap: wrap;
  height: 300px;
  overflow: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .content {
    text-align: center;
    font-size: 18px;
    line-height: 40px;
    cursor: pointer;
  }
}
.emoji-tabs {
  white-space: nowrap;
  overflow-x: scroll;
  text-align: left;
  &::-webkit-scrollbar {
    display: none;
  }
  .emoji-tab {
    display: inline-block;
    padding: 5px 15px;
    text-align: center;
    transition: background-color 0.3s;
    &.active {
      background-color: #b7b7b7;
    }
  }
}

.emoji-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 98;
}
</style>
