import { Route } from "react-router-dom";

import LangtonsAnt from "../games/langtons-ant/langtons-ant";

const LangtonsPage = () => {
  return <Route path="/langtons-ant" exact render={() => <LangtonsAnt />} />;
};

export default LangtonsPage;
