class SolvedacService {
  async searchUsers(query) {
    return axios.get(`https://solved.ac/api/v3/search/user?query=${query}`);
  }

  async getUserProblemStats(handle) {
    const [problems, tagStats] = await Promise.all([
      axios.get(
        `https://solved.ac/api/v3/search/problem?query=solved_by:${handle}`
      ),
      axios.get(
        `https://solved.ac/api/v3/user/problem_tag_stats?handle=${handle}`
      ),
    ]);
    return { problems, tagStats };
  }

  async getProblemsByTag(tag, page) {
    return axios.get(`https://solved.ac/api/v3/search/problem`, {
      params: {
        query: `solvable:true+tag:${tag}`,
        page: 0,
        sort: "solved",
        direction: "desc",
      },
    });
  }
}

export default SolvedacService;
