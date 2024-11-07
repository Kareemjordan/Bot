import { AtpAgent } from '@atproto/api'
import * as dotenv from 'dotenv';

dotenv.config();

const agent = new AtpAgent({
  service: 'https://bsky.social'
})

async function main() {
  await agent.login({
    identifier: process.env.BSKY_IDENTIFIER as string,
    password: process.env.BSKY_PASSWORD as string,
  })
  await agent.post({
    text: 'Hello world'
  })
  console.log('Posted to profile')
}

main();