import asciiFolder from "../asciiFolder";

const createSearchTerms = (str: string): Array<string> => {
  const normalizedString = asciiFolder(str);

  const terms: Array<string> = [];

  /**
   * Pass through the string one character at a time
   */
  for (let i = 0; i <= normalizedString.length; i++) {
    const termsLength = i + 1;
    if (i === normalizedString.length) break;

    /**
     * At each step of the string, generate the next set of terms. e.g.
     *
     * str: 'hey'
     * set one: 'h', 'e', 'y',
     * set two: 'he', 'ey',
     * set three: 'hey'
     * outcome: ['h', 'e', 'y', 'he', 'ey', 'hey']
     */
    generateTermsLoop: for (let n = 0; n <= normalizedString.length; n++) {
      if (n >= termsLength) break generateTermsLoop;
      terms.push(normalizedString.slice(n, termsLength));
    }
  }

  return Array.from(new Set(terms));
};

export default createSearchTerms;
