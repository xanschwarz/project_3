import React from "react";
import Home from "../pages/Home";
import BossBattle from "../pages/Fighting/BossBattle";
import BossBattle2 from "../pages/Fighting/BossBattle2";
import BossBattle3 from "../pages/Fighting/BossBattle3";
import BossBattle4 from "../pages/Fighting/BossBattle4";
import BossBattle5 from "../pages/Fighting/BossBattle5";
import GatherChoice from "../pages/Gathering/GatherChoice";
import Gathering from "../pages/Gathering/Gathering";
import Gathering2 from "../pages/Gathering/Gathering2";
import Gathering3 from "../pages/Gathering/Gathering3";
import Gathering4 from "../pages/Gathering/Gathering4";
import Fighting from "../pages/Fighting/Fighting";
import MinionBattle from "../pages/Fighting/MinionBattle";
import MinionBattle2 from "../pages/Fighting/MinionBattle2";
import MinionBattle3 from "../pages/Fighting/MinionBattle3";
import MinionBattle4 from "../pages/Fighting/MinionBattle4";
import MinionBattle5 from "../pages/Fighting/MinionBattle5";
import Store from "../pages/Store/Store";
import Profile from "../pages/Profile";
import { Route } from "react-router-dom";

export default function GameContainer() {
  return (
    <div>
      <Route path="/Home" component={Home} />
      <Route path="/MinionBattle" component={MinionBattle} />
      <Route path="/MinionBattle2" component={MinionBattle2} />
      <Route path="/MinionBattle3" component={MinionBattle3} />
      <Route path="/MinionBattle4" component={MinionBattle4} />
      <Route path="/MinionBattle5" component={MinionBattle5} />
      <Route path="/BossBattle" component={BossBattle} />
      <Route path="/BossBattle2" component={BossBattle2} />
      <Route path="/BossBattle3" component={BossBattle3} />
      <Route path="/BossBattle4" component={BossBattle4} />
      <Route path="/BossBattle5" component={BossBattle5} />
      <Route path="/Fighting" component={Fighting} />
      <Route path="/GatherChoice" component={GatherChoice} />
      <Route path="/Gathering" component={Gathering} />
      <Route path="/Gathering2" component={Gathering2} />
      <Route path="/Gathering3" component={Gathering3} />
      <Route path="/Gathering4" component={Gathering4} />
      <Route path="/Store" component={Store} />
      <Route path="/Profile" component={Profile} />
    </div>
  );
}
