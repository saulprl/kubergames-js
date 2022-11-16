import { Route } from "react-router-dom";
import SpaceInvaders from "../games/space-invaders/SpaceInvaders";

const SpaceInvadersPage = (props) => {
  return (
    <Route path="/space-invaders" exact render={() => <SpaceInvaders />} />
  );
};

export default SpaceInvadersPage;
