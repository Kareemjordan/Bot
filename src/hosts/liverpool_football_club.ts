import axios from "axios";

const baseUri = "https://www.liverpoolfc.com";
const hashTag = "#LiverpoolFootballClub";
const kickerBlacklist = ["Media watch"];

type LiverpoolAPIEntry = {
  id: number;
  url: string;
  kicker: string;
};

type LiverpoolAPIResponse = {
  count: number;
  results: LiverpoolAPIEntry[];
};

const main = async (): Promise<{ articleUri: string; hashTag: string }> => {
  let articleUri = "";
  let data: LiverpoolAPIResponse | null = null;
  try {
    const response = await axios.get(
      "https://backend.liverpoolfc.com/lfc-rest-api/news?perPage=1"
    );
    data = response.data;
    if (data) {
      const results = data.results;
      if (results.length > 0) {
        if (!kickerBlacklist.includes(results[0].kicker)) {
          articleUri = `${baseUri}${results[0].url}`;
        }
      }
    }
  } catch (err) {
    console.log("Liverpool FC API error: ", err);
  }
  return {
    articleUri,
    hashTag,
  };
};

export default main;
