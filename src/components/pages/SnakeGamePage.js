import { Route } from "react-router-dom";
import SnakeGame from "../games/snake-game/SnakeGame";

const SnakeGamePage = (props) => {
  return <Route path="/snake-game" exact render={() => <SnakeGame />} />;
};

export default SnakeGamePage;
