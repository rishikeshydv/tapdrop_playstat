"use client"

import GameProp from "@/components/GameProp";
import Header from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";

interface GameProp {
  name: string;
  visits: number;
  players: number;
  favorites: number;
}
export default function Home() {
  const [games, setGames] = useState<GameProp[]>([])
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [totalVisits, setTotalVisits] = useState(0)
  useEffect(() => {
    axios.get('/api/v1/game-stat').then((response) => {
      setGames(response.data)
    })
  }, [])

  useEffect(() => {
    let players = 0
    let visits = 0
    games.forEach((game) => {
      players += game.players
      visits += game.visits
    })
    setTotalPlayers(players)
    setTotalVisits(visits)
  }, [games])

return (
<div>
<Header totalPlayers={totalPlayers} totalVisits={totalVisits}/>
<div className="grid md:grid-cols-4">
{
  games.map((game:any) => (

          <GameProp
      key = {game.name}
      name={game.name}
      visits={game.visits}
      players={game.players}
      favorites={game.favorites}
    />
  ))
}
</div>
</div>
  );
}
