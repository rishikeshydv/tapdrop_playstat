import axios from 'axios';
import { NextResponse } from 'next/server';

interface Game {
  id: string;
  name: string;
  visits: number;
  players: number;
  favorites: number;
  image: string;
}

export async function GET() {
  const universeIds = ["3991674697", "5107841430", "5186418034", "5644087344", "5469100421", "5337048999", "5704018616"];
  
  try {
    console.log('Fetching game data');
    const gameDataPromises = universeIds.map(universeId =>
      axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`, {
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
        }
      })
    );

    const gameDataResponses = await Promise.all(gameDataPromises);
    const games: Game[] = gameDataResponses.map((response, index) => {
      const gameData = response.data.data[0];
      console.log(`Fetched data for universeId ${universeIds[index]}: `, gameData);
      return {
        id: universeIds[index],
        name: gameData.name,
        visits: gameData.visits,
        players: gameData.playing,
        favorites: gameData.favoritedCount,
        image: ""
      };
    });

    // Order the games list in descending order of "players"
    games.sort((a, b) => b.players - a.players);

    // Fetch game images in parallel
    console.log('Fetching game images');
    const imagePromises = games.map(game =>
      axios.get(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${game.id}&size=768x432&format=Png&isCircular=false`, {
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
        }
      })
    );

    const imageResponses = await Promise.all(imagePromises);
    imageResponses.forEach((response, index) => {
      games[index].image = response.data.data[0].thumbnails[0].imageUrl;
      console.log(`Fetched image for game ${games[index].id}`);
    });

    console.log('Returning games data');
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching game data:', error);
    return NextResponse.json({ error: 'Error fetching game data' }, { status: 500 });
  }
}
