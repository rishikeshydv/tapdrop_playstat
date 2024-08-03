"use client"
export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'
import GameProp from "@/components/GameProp";
import Header from "@/components/Header";
import axios from "axios";
import { useEffect, useState } from "react";

interface GameProp {
  id: string;
  name: string;
  visits: number;
  players: number;
  favorites: number;
  image: string;
}
export default function Home() {
  const [games, setGames] = useState<GameProp[]>([])
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [totalVisits, setTotalVisits] = useState(0)

  const fetchGameStats = async () => {
    try {
      const response = await axios.get('/api/v1/game-stat', {
        headers: {
          'Cache-Control': 'no-cache' // Ensure no caching happens
        },
      });
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching game stats:', error);
    }
  };
  
  useEffect(() => {
    fetchGameStats();
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
      key = {game.id}
      id={game.id}
      name={game.name}
      visits={game.visits}
      players={game.players}
      favorites={game.favorites}
      image={game.image}
    />
  ))
}
</div>
</div>
  );
}
