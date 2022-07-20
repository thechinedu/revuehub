type Styles = {
  [key: string]: string;
};

type StyleConfig = {
  [key: string]: boolean;
};

type ClassNamesFn = (styles: Styles, styleConfig: StyleConfig) => string;

export const cn: ClassNamesFn = (styles, styleConfig) => {
  let res = "";

  for (const [property, value] of Object.entries(styleConfig)) {
    if (value) res += `${styles[property]} `;
  }

  return res.trimEnd();
};
