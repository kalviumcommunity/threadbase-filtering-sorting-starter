import axios from "axios";

export const getThreads = async (page = 1) => {
  const res = await axios.get("/api/threads", {
    params: {
      page,
    },
  });

  return res.data;
};