import axios from "../util/axios.js";

interface UserSearchResponse {
  count: number;
  items: UserItem[];
}

interface UserItem {
  handle: string;
  tier: string;
}

interface UserInfoResponse {
  tier: number;
  maxStreak: number;
}

interface UserProblemResponse {
  count: number;
  items: UserProblemItem[];
}

interface UserProblemItem {
  level: number;
  averageTries: number;
  tags: any;
  titleKo: string;
  problemId: string;
  tried: number;
}

interface UserProblemStatsResponse {
  count: number;
  items: UserProblemStatItem[];
  tagRank: [string, number][];
}

interface UserProblemStatItem {
  tag: {
    displayNames: { name: string }[];
  };
  solved: number;
}

interface ProblemsByTagResponse {
  count: number;
  items: ProblemItem[];
}

interface ProblemItem {
  problemId: string;
  title: string;
}

interface ProblemInfoResponse {
  tags: any;
  problemId: string;
  titleKo: string;
  level: number;
  averageTries: number;
}

const SolvedacService = {
  async searchUsers(query: string): Promise<UserSearchResponse> {
    try {
      const response = await axios.get<UserSearchResponse>(
        `https://solved.ac/api/v3/search/user`,
        {
          params: { query },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserInfo(handle: string): Promise<UserInfoResponse> {
    try {
      const response = await axios.get<UserInfoResponse>(
        `https://solved.ac/api/v3/user/show`,
        {
          params: {
            handle: handle,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserProblemAll(
    handle: string,
    page: number
  ): Promise<UserProblemResponse> {
    try {
      const response = await axios.get<UserProblemResponse>(
        `https://solved.ac/api/v3/search/problem`,
        {
          params: {
            query: `solved_by:${handle}`,
            page: page,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getUserProblemStats(handle: string): Promise<UserProblemStatsResponse> {
    try {
      const response = await axios.get<UserProblemStatsResponse>(
        `https://solved.ac/api/v3/user/problem_tag_stats`,
        {
          params: {
            handle,
            direction: "asc",
          },
        }
      );

      const { count, items } = response.data;
      let tagRank: [string, number][] = [];

      for (let i = 0; i < Math.min(10, items.length); i++) {
        let tag = items[i].tag.displayNames[0].name;
        tagRank.push([tag, items[i].solved]);
      }

      return { count, items, tagRank };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getProblemsByTag(tag: string): Promise<ProblemsByTagResponse> {
    try {
      const response = await axios.get<ProblemsByTagResponse>(
        `https://solved.ac/api/v3/search/problem`,
        {
          params: {
            query: `solvable:true+tag:${tag}`,
            page: 1,
            sort: "solved",
            direction: "desc",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getProblemInfo(bojId: string): Promise<ProblemInfoResponse> {
    try {
      const response = await axios.get<ProblemInfoResponse>(
        `https://solved.ac/api/v3/problem/show`,
        {
          params: { problemId: bojId },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default SolvedacService;
