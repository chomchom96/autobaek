const axios = require("../util/axios");

const SolvedacService = {
  async searchUsers(query) {
    try {
      const response = await axios.get(`https://solved.ac/api/v3/search/user`, {
        params: { query }
      });
      return response.data;
    } catch (error) {
      console.error("Error searching users:", error.message);
      throw error;
    }
  },

  async getUserProblemAll(handle) {
    try {
      const response = await axios.get(`https://solved.ac/api/v3/search/problem`, {
        params: { query: `solved_by:${handle}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user problems:", error.message);
      throw error;
    }
  },

  async getUserProblemStats(handle) {
    try {
      const response = await axios.get(`https://solved.ac/api/v3/user/problem_tag_stats`, {
        params: {
          handle,
          direction: "asc"
        }
      });
      
      const { count, items } = response.data;
      let tagRank = [];
      
      for (let i = 0; i < Math.min(10, items.length); i++) {
        let tag = items[i].tag.displayNames[0].name;
        tagRank.push([tag, items[i].solved]);
      }
      
      return { count, items, tagRank };
    } catch (error) {
      console.error("Error fetching user problem stats:", error.message);
      throw error;
    }
  },

  async getProblemsByTag(tag) {
    try {
      const response = await axios.get(`https://solved.ac/api/v3/search/problem`, {
        params: {
          query: `solvable:true+tag:${tag}`,
          page: 1,
          sort: "solved",
          direction: "desc"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching problems by tag:", error.message);
      throw error;
    }
  },

  async getProblemInfo(bojId) {
    try {
      const response = await axios.get(`https://solved.ac/api/v3/problem/show`, {
        params: { problemId: bojId }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching problem info:", error.message);
      throw error;
    }
  },
};

module.exports = SolvedacService;