export interface Theme {
  bg_color: string;
  title_color: string;
  text_color: string;
  icon_color: string;
}

export const themes: Record<string, Theme> = {
  light: {
    bg_color: "fffefe",
    title_color: "2f80ed",
    text_color: "434d58",
    icon_color: "4c71f2",
  },
  dark: {
    bg_color: "151515",
    title_color: "fb8c00",
    text_color: "9f9f9f",
    icon_color: "fb8c00",
  },
  dracula: {
    bg_color: "282a36",
    title_color: "ff79c6",
    text_color: "f8f8f2",
    icon_color: "8be9fd",
  },
  github_dark: {
    bg_color: "0d1117",
    title_color: "58a6ff",
    text_color: "c9d1d9",
    icon_color: "79c0ff",
  },
};

export function getTheme(themeName: string = "light", customBg?: string): Theme {
  const theme = { ...(themes[themeName] || themes.light) };
  if (customBg) {
    theme.bg_color = customBg.replace("#", "");
  }
  return theme;
}
