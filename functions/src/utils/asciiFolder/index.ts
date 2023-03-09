import * as foldToAscii from "fold-to-ascii";

const asciiFolder = (str: string): string =>
  foldToAscii
    .foldMaintaining(str)
    .replace(/\s/g, "")
    .toLocaleLowerCase() as string;

export default asciiFolder;
