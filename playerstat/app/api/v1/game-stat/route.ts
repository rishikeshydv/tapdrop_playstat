import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(){
    const universeIds = ["3991674697","5107841430","5186418034","5644087344","5777122777","5469100421","5337048999","5704018616"]
    const games = []

    // Get game data for each universe
    for (const universeId of universeIds){
        const response = await axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`)
        const gameData =  response.data.data[0]
        const gameInfo = {
            id: universeId,
            name: gameData.name,
            visits: gameData.visits,
            players: gameData.playing,
            favorites: gameData.favoritedCount,
            image: ""
        }
        games.push(gameInfo)
    }

    //order the games list in descending order of "players"
    games.sort((a,b) => b.players -  a.players)


    //Get game image for each game
    //link: https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&size=768x432&format=Png&isCircular=false
    for (const game of games){
        const response = await axios.get(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${game.id}&size=768x432&format=Png&isCircular=false`)
        game.image = response.data.data[0].thumbnails[0].imageUrl
    }

    return NextResponse.json(games)
}