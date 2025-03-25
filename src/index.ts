import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";

import { scrapeMeta } from "./utils/data";
import post from "./utils/post";

import theIndependent from "./hosts/the_independent";
import theMirror from "./hosts/the_mirror";
import theGuardian from "./hosts/the_guardian";
import espn from "./hosts/espn";
import theathletic from "./hosts/the_athletic"
import dailymail from "./hosts/daily_mail"

dotenv.config();

type PostExternalType = {
  uri: string | undefined;
  title: string | undefined;
  description: string | undefined;
  thumb: string | undefined;
};

const agent = new AtpAgent({
  service: "https://bsky.social",
});

async function main() {
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER as string,
    password: process.env.BSKY_PASSWORD as string,
  });

  const { data: posts } = await agent.getAuthorFeed({
    actor: process.env.BSKY_IDENTIFIER as string,
    limit: 50,
  });

  const previousUris: string[] = [];

  if (posts) {
    posts.feed.forEach((p) => {
      const embed = p.post.embed;
      if (embed) {
        const embedExternal = embed.external as PostExternalType;
        if (embedExternal.uri) {
          previousUris.push(embedExternal.uri);
        }
      }
    });
  }

  const theGuardianData = await theGuardian();
  const theMirrorData = await theMirror();
  const theIndepedentData = await theIndependent();
  const espnData = await espn();
  const theathleticData = await theathletic();
  const dailymailData = await dailymail();

  const hostData = [
    theGuardianData,
    theMirrorData,
    theIndepedentData,
    espnData,
    theathleticData,
    dailymailData,
  ];

  hostData.forEach(async (hd) => {
    const { articleUri, hashTag } = hd;
    if (articleUri && !previousUris.includes(articleUri)) {
      const { title, description, thumb } = await scrapeMeta(agent, articleUri);
      if (title && description) {
        if (hashTag === "#TheIndependent") {
          let output = "";
          output += `${hashTag} | ${articleUri}\n`;
          output += `Title: ${title}\n`;
          output += `Description: ${description}\n`;
          output += `Thumb: ${thumb?.mimeType} (mimetype), ${thumb?.size} (size)\n`;
          console.log(output);
        } else {
          await post(agent, hashTag, articleUri, title, description, thumb);
        }
      }
    }
  });
}

main();
