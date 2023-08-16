import axios from "axios";

export const axiosPSLInstance = () => {
  return axios.create({
    baseURL: "https://www.psl.co.za/matchcentre",
  });
};
