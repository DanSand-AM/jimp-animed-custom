import { BmFont } from "./types.js";

export function measureText(font: BmFont, text: string) {
  let x = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;
    const fontChar = font.chars[char];

    if (fontChar) {
      const fontKerning = font.kernings[char];
      const nextChar = text[i + 1];
      const kerning =
        fontKerning && nextChar && fontKerning[nextChar]
          ? fontKerning[nextChar] || 0
          : 0;

      x += (fontChar.xadvance || 0) + kerning;
    }
  }

  return x;
}

export function splitLines(font: BmFont, text: string, maxWidth: number) {
  const words = text.replace(/[\r\n]+/g, " \n").split(" ");

  const lines: string[][] = [];
  let currentLine: string[] = [];
  let longestLine = 0;

  words.forEach((word) => {
    const line = [...currentLine, word].join(" ");
    const length = measureText(font, line);

    if (length <= maxWidth && !word.includes("\n")) {
      if (length > longestLine) {
        longestLine = length;
      }

      currentLine.push(word);
    } else {
      lines.push(currentLine);
      currentLine = [word.replace("\n", "")];
    }
  });

  lines.push(currentLine);

  return {
    lines,
    longestLine,
  };
}

export function measureTextHeight(
  font: BmFont,
  text: string,
  maxWidth: number
) {
  const { lines } = splitLines(font, text, maxWidth);

  return lines.length * font.common.lineHeight;
}