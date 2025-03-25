import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";

import { scrapeMeta } from "../utils/data";

import theIndependent from "./the_independent";
import theMirror from "./the_mirror";
import theGuardian from "./the_guardian";
import espn from "./espn";
import dailyMail from "./daily_mail";
import theathletic from "./the_athletic"

dotenv.config();

type postExternalType = {
  uri: string | undefined;
  title: string | undefined;
  description: string | undefined;
  thumb: string | undefined;
};

type postExternalRecord = {
  text: string;
  createdAt: string;
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

  console.log("50 previous posts");
  console.log("=================");
  if (posts) {
    posts.feed.forEach((p) => {
      const embed = p.post.embed;
      const record = p.post.record as postExternalRecord;
      let output = "";
      if (record) {
        output += `${record.text}`;
      }
      if (embed) {
        const embedExternal = embed.external as postExternalType;
        if (embedExternal.uri) {
          output += ` | ${embedExternal.uri}`;
        }
      }
      console.log(output);
    });
  }
  console.log("=================\n\n");

  const theGuardianData = await theGuardian();
  const theMirrorData = await theMirror();
  const theIndepedentData = await theIndependent();
  const espnData = await espn();
  const dailyMailData = await dailyMail();
  const theathleticData = await theathletic();

  const hostData = [
    theGuardianData,
    theMirrorData,
    theIndepedentData,
    espnData,
    dailyMailData,
    theathleticData,
  ];

  console.log("Host data");
  console.log("=========");

  hostData.forEach(async (hd) => {
    let output = "";
    const { articleUri, hashTag } = hd;
    output += `${hashTag} | ${articleUri}\n`;
    const { title, description, thumb } = await scrapeMeta(agent, articleUri);
    output += `Title: ${title}\n`;
    output += `Description: ${description}\n`;
    output += `Thumb: ${thumb?.mimeType} (mimetype), ${thumb?.size} (size)\n`;
    console.log(output);
    console.log("--------");
  });
}

main();
