import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest){
    const universeIds = ["3991674697","5107841430","5773880372","5644087344","5777122777","5469100421","5337048999"]
    const games = []
    for (const universeId of universeIds){
        const response = await axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`)
        const gameData =  response.data.data[0]
        const gameInfo = {
            name: gameData.name,
            visits: gameData.visits,
            players: gameData.playing,
            favorites: gameData.favoritedCount
        }
        games.push(gameInfo)
    }
    return NextResponse.json(games)
}