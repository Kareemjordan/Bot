import { AtpAgent } from "@atproto/api";
import * as dotenv from "dotenv";

import { scrapeMeta } from "./utils/data";
import post from "./utils/post";

import theIndependent, {
  hashTag as theIndependentHashtag,
} from "./hosts/the_independent";
import liverpoolEcho, {
  hashTag as liverpoolEchoHashtag,
} from "./hosts/liverpool_echo";
import theMirror, { hashTag as theMirrorHashtag } from "./hosts/the_mirror";
import theGuardian, {
  hashTag as theGuardianHashtag,
} from "./hosts/the_guardian";

dotenv.config();

const agent = new AtpAgent({
  service: "https://bsky.social",
});

async function main() {
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER as string,
    password: process.env.BSKY_PASSWORD as string,
  });

  // const theGuardianUri = await theGuardian();
  // const theMirrorUri = await theMirror();
  // const liverpoolEchoUri = await liverpoolEcho();
  // const theIndepedentUri = await theIndependent();

  // if (theGuardianUri) {
  //   const { title, description, thumb } = await scrapeMeta(
  //     agent,
  //     theGuardianUri
  //   );

  //   if (title && description) {
  //     await post(
  //       agent,
  //       theGuardianHashtag,
  //       theGuardianUri,
  //       title,
  //       description,
  //       thumb
  //     );
  //   }
  // }

  // if (theMirrorUri) {
  //   const { title, description, thumb } = await scrapeMeta(agent, theMirrorUri);

  //   if (title && description) {
  //     await post(
  //       agent,
  //       theMirrorHashtag,
  //       theMirrorUri,
  //       title,
  //       description,
  //       thumb
  //     );
  //   }
  // }

  // if (liverpoolEchoUri) {
  //   const { title, description, thumb } = await scrapeMeta(
  //     agent,
  //     liverpoolEchoUri
  //   );

  //   if (title && description) {
  //     await post(
  //       agent,
  //       liverpoolEchoHashtag,
  //       liverpoolEchoUri,
  //       title,
  //       description,
  //       thumb
  //     );
  //   }
  // }

  // if (theIndepedentUri) {
  //   const { title, description, thumb } = await scrapeMeta(
  //     agent,
  //     theIndepedentUri
  //   );

  //   if (title && description) {
  //     await post(
  //       agent,
  //       theIndependentHashtag,
  //       theIndepedentUri,
  //       title,
  //       description,
  //       thumb
  //     );
  //   }
  // }
}

main();
