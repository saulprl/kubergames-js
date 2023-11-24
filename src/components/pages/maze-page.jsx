import { Route } from "react-router-dom";

import Maze from "../games/maze-generator/maze";

const MazePage = () => {
  return <Route path="/maze-generator" exact render={() => <Maze />} />;
};

export default MazePage;
