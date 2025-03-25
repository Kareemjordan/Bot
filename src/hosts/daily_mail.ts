import * as cheerio from "cheerio";

import { fetchHTML } from "../utils/data";

const baseUri = "https://www.dailymail.co.uk";
const newsPath = "/sport/manchester-united";
const hashTag = "#Dailymail";

const main = async (): Promise<{ articleUri: string; hashTag: string }> => {
  let articleUri = "";
  const data: string | undefined = await fetchHTML(`${baseUri}${newsPath}`);
  const $ = cheerio.load(data);
  const title = $('div[data-track-module="topics_pagination_desktop"]').find('h2:first').find('a')
  if (title) {
    const href = title.attr("href");
    if (href) {
      if (href.includes("://")) {
        articleUri = href;
      } else {
        articleUri = `${baseUri}${href}`;
      }
    }
  }
  return { articleUri, hashTag };
};

export default main;
