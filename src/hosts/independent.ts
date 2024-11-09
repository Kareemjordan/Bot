import * as cheerio from "cheerio";

import { fetchHTML } from "../utils/data";

const main = async (): Promise<string> => {
  let articleUrl = "";
  const data: string | undefined = await fetchHTML(
    "https://www.independent.co.uk/topic/liverpool-fc"
  );
  const $ = cheerio.load(data);
  const title = $("body").find("h2:first");
  if (title) {
    const anchor = $(title).find("a");
    if (anchor) {
      const href = anchor.attr("href");
      if (href) {
        if (href.includes("://")) {
          articleUrl = href;
        } else {
          articleUrl = `https://www.independent.co.uk${href}`;
        }
      }
    }
  }
  return articleUrl;
};

export default main;
