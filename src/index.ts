import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";

import { scrapeMeta } from "./utils/data";
import post from "./utils/post";

import theIndependent from "./hosts/the_independent";
import liverpoolEcho from "./hosts/liverpool_echo";
import theMirror from "./hosts/the_mirror";
import theGuardian from "./hosts/the_guardian";

dotenv.config();

type postExternalType = {
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

  const { data: getProfile } = await agent.getProfile({
    actor: process.env.BSKY_IDENTIFIER as string,
  });

  const { data: posts } = await agent.getAuthorFeed({
    actor: getProfile.did,
    limit: 30,
  });

  const previousUris: string[] = [];

  if (posts) {
    posts.feed.forEach((p) => {
      const embed = p.post.embed;
      if (embed) {
        const embedExternal = embed.external as postExternalType;
        if (embedExternal.uri) {
          previousUris.push(embedExternal.uri);
        }
      }
    });
  }

  const theGuardianData = await theGuardian();
  const theMirrorData = await theMirror();
  const liverpoolEchoData = await liverpoolEcho();
  const theIndepedentData = await theIndependent();

  const hostData = [
    theGuardianData,
    theMirrorData,
    liverpoolEchoData,
    theIndepedentData,
  ];

  hostData.forEach(async (hd) => {
    const { articleUri, hashTag } = hd;
    if (!previousUris.includes(articleUri)) {
      const { title, description, thumb } = await scrapeMeta(agent, articleUri);
      if (title && description) {
        await post(agent, hashTag, articleUri, title, description, thumb);
      }
    }
  });
}

main();
