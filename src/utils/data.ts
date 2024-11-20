import axios from "axios";
import * as cheerio from "cheerio";
import { AtpAgent } from "@atproto/api";

export const fetchHTML = async (uri: string): Promise<string> => {
  let response = "";
  try {
    const r = await axios.get(uri);
    response = r.data;
  } catch (err) {
    console.log("fetchHTML error: ", err);
  }
  return response;
};

export const scrapeMeta = async (agent: AtpAgent, uri: string) => {
  let title = "";
  let description = "";
  let thumb = undefined;
  if (uri) {
    const data: string | undefined = await fetchHTML(uri);
    const $ = cheerio.load(data);
    const scrapedTitle = $('meta[property="og:title"]').attr("content");
    if (scrapedTitle) {
      title = scrapedTitle;
    }
    const scrapedDescription = $('meta[property="og:description"]').attr(
      "content"
    );
    if (scrapedDescription) {
      description = scrapedDescription;
    }

    // Scrapes meta image and uploads it to Bluesky CDN
    if (title && description) {
      const image = $('meta[property="og:image"]').attr("content");
      if (image) {
        const remoteImage = await axios.get(image, {
          responseType: "arraybuffer",
        });
        const imageContentType = remoteImage.headers["content-type"];
        const imageBlob = remoteImage.data;
        const bskyFileLimit = 976560;
        if (
          imageBlob &&
          imageBlob.length > 0 &&
          imageBlob.length < bskyFileLimit
        ) {
          const upload = await agent.uploadBlob(imageBlob, {
            encoding: imageContentType,
          });
          if (upload) {
            thumb = upload.data.blob;
          }
        }
      }
    }
  }
  return { title, description, thumb };
};
