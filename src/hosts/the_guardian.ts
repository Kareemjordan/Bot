import * as cheerio from "cheerio";

import { fetchHTML } from "../utils/data";

const baseUri = "https://www.theguardian.com";
const newsPath = "/football/manchester-united";
const hashTag = "#TheGuardian";

const main = async (): Promise<{ articleUri: string; hashTag: string }> => {
  let articleUri = "";
  const data: string | undefined = await fetchHTML(`${baseUri}${newsPath}`);
  const $ = cheerio.load(data);
  const title = $("body").find("h3:first");
  const titleText = $(title).text();
  // Guardian sometimes have a prefix e.g. "Opta Analyst" element inside the H3
  // Headline should be last element
  const titleLastElementText = $(title).find("*:last").text();
  if (titleText || titleLastElementText) {
    const anchor = $("body").find(
      `[aria-label="${titleLastElementText ? titleLastElementText : titleText
      }"]:first`
    );
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
