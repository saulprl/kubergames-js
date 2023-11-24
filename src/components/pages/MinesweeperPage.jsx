import { Route } from "react-router-dom";

import Minesweeper from "../games/minesweeper/Minesweeper";

const MinesweeperPage = () => {
  return <Route path="/minesweeper" exact render={() => <Minesweeper />} />;
};

export default MinesweeperPage;
