<template>
  <div class="editor-box">
    <Editor
      :value="content"
      :plugins="plugins"
      @change="emits('update:content', $event)"
      :locale="zhHans"
      :uploadImages="uploadImage"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps, defineEmits } from "vue";
import { Editor, Viewer } from "@bytemd/vue-next";
import zhHans from "bytemd/lib/locales/zh_Hans.json";
import gfm from "@bytemd/plugin-gfm";
import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import "bytemd/dist/index.css";
// import "juejin-markdown-themes/dist/juejin.min.css";
import 'github-markdown-css/github-markdown.css'
import 'highlight.js/styles/a11y-light.css'

interface ResultUpload {
  title: string,
  url: string
}

interface UploadImage {
  (files: File[]) : ResultUpload[]
}

const plugins = [
  gfm(),
  breaks(),
  frontmatter(),
  gemoji(),
  highlight(),
  math(),
  mediumZoom(),
  mermaid(),
];

const props = defineProps<{
  content: string,
  uploadImage: UploadImage
}>();

const emits = defineEmits<{
  (e: "update:content", html: string): void;
}>();
</script>

<style lang="scss" scoped>
.editor-box {
  :deep(.bytemd) {
    height: 400px;
    z-index: 3;
    .bytemd-body {
      height: calc(100% - 65px);
    }
    .bytemd-status {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
