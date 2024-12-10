class SolvedacService {
  async searchUsers(query) {
    return axios.get(`https://solved.ac/api/v3/search/user?query=${query}`);
  }
  // 푼 전체 문제 가져오가
  async getUserProblemAll(handle) {
    const { count, items } = await Promise.all([
      axios.get(`https://solved.ac/api/v3/search/problem`, {
        params: {
          query: `query=solved_by:${handle}`,
        },
      }),
    ]);
    return { count, items };
  }
  // 푼 문제 태그별 누계 가져오기
  async getUserProblemStats(handle) {
    const { count, items } = await Promise.all([
      axios.get(`https://solved.ac/api/v3/user/problem_tag_stats`, {
        params: {
          query: `handle=${handle}`,
          sort: "asc",
        },
      }),
    ]);
    let tagRank = [];
    for (let i = 0; i < 10; i++) {
      let tag = items[i].tag.displayedNames[0].name;
      tagRank.push([tag, items[i].solved]);
    }
    return { count, items };
  }
  // 태그별 문제 가져오기
  async getProblemsByTag(tag) {
    return axios.get(`https://solved.ac/api/v3/search/problem`, {
      params: {
        query: `query=solvable:true+tag:${tag}`,
        page: 1,
        sort: "solved",
        direction: "desc",
      },
    });
  }
  // 문제 하나 정보 가져오기
  async getProblemInfo(bojId) {
    return axios.get(`https://solved.ac/api/v3/problem/show?problemId=`, {
      params: {
        query: `problemId=${bojId}`,
      },
    });
  }
}

export default SolvedacService;
