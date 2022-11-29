import { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"
import "./App.css"
import { fetchBets, FetchBetsResponse, Bet as BetType, Booker as BookerType } from "./providers/bets_ward"

export type BetSuggestionItem = {
  suggestedBet: number
  maxProfit: number
}

export type BetSuggestion = {
  booker1: BetSuggestionItem
  booker2: BetSuggestionItem
}

function suggestBettingRatio(bet: BetType, value: number): BetSuggestion {
  const booker1Odd = parseFloat(bet.booker1.odd)
  const booker2Odd = parseFloat(bet.booker2.odd)
  const sumOdds = booker1Odd + booker2Odd
  return {
    booker1: {
      suggestedBet: value * (1 - booker1Odd / sumOdds),
      maxProfit: value * (1 - booker1Odd / sumOdds) * booker1Odd
    },
    booker2: {
      suggestedBet: value * (1 - booker2Odd / sumOdds),
      maxProfit: value * (1 - booker2Odd / sumOdds) * booker2Odd
    }
  }
}

function BetBooker(props: BookerType) {
  return <>
    <td>{props.sport}</td>
    <td>{props.coeff.title}</td>
    <td>{props.event}</td>
    <td><a href={props.link} target='_blank'>{props.name}</a></td>
    <td>{props.odd}</td>
  </>
}

function Bet(props: BetType) {
  return (
    <tr>
      <th scope='row'>{props.profit}</th>
      <td>{props.roi}</td>
      <td>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>sport</th>
              <th scope='col'>coeff.title</th>
              <th scope='col'>event</th>
              <th scope='col'>name</th>
              <th scope='col'>odd</th>
            </tr>
          </thead>
          <tbody>
            <tr><BetBooker {...props.booker1} /></tr>
            <tr><BetBooker {...props.booker2} /></tr>
          </tbody>
        </table>
      </td>
    </tr>
  )
}

function BetTable(props: FetchBetsResponse) {
  return (
    <table className='table table-hover table-striped'>
      <thead>
        <tr>
          <th scope='col'>Profit</th>
          <th scope='col'>roi</th>
        </tr>
      </thead>
      <tbody>
        {props.bets.map(
          (bet: { id: any }) => <Bet key={bet.id} {...bet} />
        )}
      </tbody>
    </table>
  )
}

function App() {
  const [betsResponse, setBetsResponse] = useState<FetchBetsResponse>()

  useEffect(() => {
    const interval = setInterval(() => fetchBets().then(setBetsResponse), 3000);
    return () => clearInterval(interval)
  }, [betsResponse])

  if (!betsResponse)
    return <div className='container'>Loading</div>

  return (
    <div className='container'>
      <div className="row">
        <div className='col'>
          <BetTable  {...betsResponse} />
        </div>
      </div>
    </div>
  )
}

export default App