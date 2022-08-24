export type IconAtom = {
  emoji: string;
  skin_tone_support: boolean;
  skin_tone_support_unicode_version: string;
  name: string;
  slug: string;
  unicode_version: string;
  emoji_version: string;
};

export type IconGroup = IconAtom[];

export type IconData = {
  "Smileys & Emotion": IconGroup;
  "People & Body": IconGroup;
  "Animals & Nature": IconGroup;
  "Food & Drink": IconGroup;
  "Travel & Places": IconGroup;
  Activities: IconGroup;
  Objects: IconGroup;
  Symbols: IconGroup;
  Flags: IconGroup;
};

export enum IconGroupList {
  "Smileys & Emotion" = "😀",
  "People & Body" = "👋",
  "Animals & Nature" = "🦊",
  "Food & Drink" = "🍊",
  "Travel & Places" = "🕌",
  "Activities" = "🎃",
  "Objects" = "👔",
  "Symbols" = "🆎",
  "Flags" = "🚩",
}

export type IconGroupListType = {
  [key in keyof IconData]?: string;
};

export type IconGroupKey = keyof IconData;
