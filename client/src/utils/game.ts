import { Game, Player, Team } from "../model";

export const getParticipantNames = (game?: Game) => {
  console.log(game);
  if (!game) {
    return { homeName: "", awayName: "" };
  }
  if (game.playerType === "single") {
    const homeParticipant = game.homeParticipant as Player;
    const awayParticipant = game.awayParticipant as Player;
    return {
      homeName: homeParticipant.nickName,
      awayName: awayParticipant.nickName,
    };
  } else {
    const homeParticipant = game.homeParticipant as Team;
    const awayParticipant = game.awayParticipant as Team;
    return {
      homeName: homeParticipant.name,
      awayName: awayParticipant.name,
    };
  }
};
