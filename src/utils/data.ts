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
      // const uri = 'https://www.independent.co.uk/sport/football/liverpool-injuries-team-news-arne-slot-tsimikas-robertson-b2643620.html'
      // const title = 'Slot gives verdict on key battle for position at Liverpool'
      // const description = 'The Reds boss also has a decision to make in attack after Luis Diaz scored three'
      // const image = 'https://static.independent.co.uk/2024/11/08/09/newFile-2.jpg?quality=75&width=1200&auto=webp'

      if (image) {
        const remoteImage = await axios.get(image, {
          responseType: "arraybuffer",
        });
        const imageContentType = remoteImage.headers["content-type"];
        const imageBlob = remoteImage.data;
        const upload = await agent.uploadBlob(imageBlob, {
          encoding: imageContentType,
        });
        if (upload) {
          thumb = upload.data.blob;
        }
      }
    }
  }
  return { title, description, thumb };
};
