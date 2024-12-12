const axios = require("axios");

const SolvedacService = {
  async searchUsers(query) {
    const response = await axios.get(
      `https://solved.ac/api/v3/search/user?query=${query.query}`
    );
    return response.data;
  },
  // 푼 전체 문제 가져오가
  async getUserProblemAll(handle) {
    const response = await axios.get([
      axios.get(`https://solved.ac/api/v3/search/problem`, {
        params: {
          query: `query=solved_by:${handle}`,
        },
      }),
    ]);
    return response.data;
  },
  // 푼 문제 태그별 누계 가져오기
  async getUserProblemStats(handle) {
    const response = await axios.get(
      `https://solved.ac/api/v3/user/problem_tag_stats`,
      {
        params: {
          query: `handle=${handle}`,
          sort: "asc",
        },
      }
    );
    const { count, items } = response.data;

    let tagRank = [];
    for (let i = 0; i < 10; i++) {
      let tag = items[i].tag.displayedNames[0].name;
      tagRank.push([tag, items[i].solved]);
    }
    return { count, items };
  },
  // 태그별 문제 가져오기
  async getProblemsByTag(tag) {
    const response = await axios.get(
      `https://solved.ac/api/v3/search/problem`,
      {
        params: {
          query: `query=solvable:true+tag:${tag}`,
          page: 1,
          sort: "solved",
          direction: "desc",
        },
      }
    );
    return response.data;
  },
  // 문제 하나 정보 가져오기
  async getProblemInfo(bojId) {
    const response = await axios.get(
      `https://solved.ac/api/v3/problem/show?problemId=`,
      {
        params: {
          query: `problemId=${bojId}`,
        },
      }
    );

    return response.data;
  },
};

module.exports = SolvedacService;
