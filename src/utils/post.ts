import { AtpAgent, BlobRef, RichText } from "@atproto/api";

export const post = async (
  agent: AtpAgent,
  postText: string,
  uri: string,
  title: string,
  description: string | undefined,
  thumb: BlobRef | undefined
) => {
  const rt = new RichText({
    text: postText,
  });

  await rt.detectFacets(agent);

  await agent.post({
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets: rt.facets,
    embed: {
      $type: "app.bsky.embed.external",
      external: {
        uri,
        title,
        description,
        thumb,
      },
    },
  });
};
