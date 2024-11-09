import { AtpAgent, RichText } from "@atproto/api";
import * as dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";

import { fetchHTML } from "./utils/data";
import { post } from "./utils/post";

import independent from "./hosts/independent";

dotenv.config();

const agent = new AtpAgent({
  service: "https://bsky.social",
});

async function main() {
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER as string,
    password: process.env.BSKY_PASSWORD as string,
  });

  const indy = await independent();

  if (indy) {
    const data: string | undefined = await fetchHTML(indy);
    const $ = cheerio.load(data);
    const uri = indy;
    const title = $('meta[property="og:title"]').attr("content");
    const description = $('meta[property="og:description"]').attr("content");

    if (title && description) {
      const image = $('meta[property="og:image"]').attr("content");
      let uploadedBlob = undefined;
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
          uploadedBlob = upload.data.blob;
        }
      }

      await post(agent, "#Indy", uri, title, description, uploadedBlob);
    }
  }
}

main();
