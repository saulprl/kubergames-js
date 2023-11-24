import { Route } from "react-router-dom";
import FlappyBird from "../games/flappy-bird/FlappyBird";

const FlappyBirdPage = () => {
  return <Route path="/flappy-bird" exact render={() => <FlappyBird />} />;
};

export default FlappyBirdPage;
