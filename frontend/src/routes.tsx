import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProblemRecommendations from "./components/problem/ProblemRecommedation";
import UserPage from "./pages/user/UserPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route
          path="user/:id"
          element={<UserPage></UserPage>}
        />
        <Route
          path="problem"
          element={<ProblemRecommendations></ProblemRecommendations>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
