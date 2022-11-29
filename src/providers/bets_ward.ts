export type Booker = {
    coeff: {
        abbr: string
        title: string
    }
    date: string
    event: string
    hour: string
    link: string
    name: string
    odd: string
    players: string
    sport: string
    timestamp: string
}

export type Bet = {
    age: string
    booker1: Booker
    booker2: Booker
    html: string
    id: string
    new: Array<string>
    profit: number
    roi: string
}

export type FetchBetsResponse = {
    betLength: number
    bets: Bet[]
    time: Date
}

async function fetchBets(): Promise<FetchBetsResponse> {
    const response = await fetch("https://bets.ward.live/bets")
    const bets = await response.json()
    console.log(bets)
    return bets
}

export {
    fetchBets
}