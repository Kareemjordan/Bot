import * as cheerio from "cheerio";

import { fetchHTML } from "../utils/data";

const baseUri = "https://www.theguardian.com";
const newsPath = "/football/liverpool";
export const hashTag = "#TheGuardian";

const main = async (): Promise<string> => {
  let articleUri = "";
  const data: string | undefined = await fetchHTML(`${baseUri}${newsPath}`);
  const $ = cheerio.load(data);
  const title = $("body").find("h3:first");
  if (title) {
    const anchor = $("body").find(`[aria-label="${title.text()}"]:first`);
    if (anchor) {
      const href = anchor.attr("href");
      if (href) {
        if (href.includes("://")) {
          articleUri = href;
        } else {
          articleUri = `${baseUri}${href}`;
        }
      }
    }
  }
  return articleUri;
};

export default main;
