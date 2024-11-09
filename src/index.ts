import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";

import { scrapeMeta } from "./utils/data";
import post from "./utils/post";

import independent, {
  hashTag as independentHashtag,
} from "./hosts/independent";

dotenv.config();

const agent = new AtpAgent({
  service: "https://bsky.social",
});

async function main() {
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER as string,
    password: process.env.BSKY_PASSWORD as string,
  });

  const indepedentUri = await independent();

  if (indepedentUri) {
    const { title, description, thumb } = await scrapeMeta(
      agent,
      indepedentUri
    );

    if (title && description) {
      await post(
        agent,
        independentHashtag,
        indepedentUri,
        title,
        description,
        thumb
      );
    }
  }
}

main();
