import axios from "axios";

export const fetchHTML = async (url: string): Promise<string> => {
  let response = "";
  try {
    const r = await axios.get(url);
    response = r.data;
  } catch (err) {
    console.log("fetchHTML error: ", err);
  }
  return response;
};
