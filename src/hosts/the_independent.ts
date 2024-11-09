import * as cheerio from "cheerio";

import { fetchHTML } from "../utils/data";

const baseUri = "https://www.independent.co.uk";
const newsPath = "/topic/liverpool-fc";
export const hashTag = "#TheIndependent";

const main = async (): Promise<string> => {
  let articleUri = "";
  const data: string | undefined = await fetchHTML(`${baseUri}${newsPath}`);
  const $ = cheerio.load(data);
  const title = $("body").find("h2:first");
  if (title) {
    const anchor = $(title).find("a");
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
