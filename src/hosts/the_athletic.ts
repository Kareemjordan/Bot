import * as cheerio from "cheerio";

import { fetchHTML } from "../utils/data";

const baseUri = "https://www.nytimes.com/";
const newsPath = "/athletic/football/team/manchester-united";
const hashTag = "#TheAthletic";

const main = async (): Promise<{ articleUri: string; hashTag: string }> => {
  let articleUri = "";
  const data: string | undefined = await fetchHTML(`${baseUri}${newsPath}`);
  const $ = cheerio.load(data);
  const title = $("body").find("h4");
  if (title) {
    const anchor = title.closest("a");
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
  return { articleUri, hashTag };
};

export default main;
