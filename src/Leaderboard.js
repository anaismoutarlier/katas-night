import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom"

import Countdown from 'react-countdown'

import Progress from "./Progress"
import Campus from './Campus'

import alarm_clock from "./alarm_clock.png"

export default function Leaderboard() {
  const [data, setData] = useState(null)
  const [winners, setWinners] = useState([])
  const [isWinner, setIsWinner] = useState(null)
  const [timeout, setTimeout] = useState(null)
  const [gameOngoing, setGameOngoing] = useState(null)
  
  const { batchId } = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    let interval;

    const fetchData = async () => {
      const data = await fetch(`http://localhost:3000/batch/katas/progress/${batchId}`)
      const json = await data.json()

      const { result, dateStart, dateEnd, ...res } = json

      if (result) {
        
        let start = new Date(dateStart)
        let end = new Date(dateEnd)
        let now = new Date()

        if (start > now) {
          navigate(`/start/${batchId}`)
          return
        }
        
        setData(res)
        setWinners(res.all.filter(team => team.count === res.steps.length))

        if (end > now) {
          setGameOngoing(true)
          setIsWinner(res.leading[0])
          setTimeout(end)
        } else {
          if (interval) clearInterval(interval)
        }
      }
    }

    fetchData()
    interval = setInterval(() => fetchData(), 10000)

    return  () => interval ? clearInterval(interval) : null
  }, [batchId])

  useEffect(() => isWinner && winners.find(team => team.team === isWinner.team) ? setTimeout(() => setIsWinner(null), 5000) : undefined, [winners, isWinner])

  const endGame = async () => {
    await fetch(`http://localhost:3000/batch/katas/end/${batchId}`)

    setGameOngoing(false)
  }
  return (
    <div className="container leaderboard">
      {
        data &&
        <>
          <div className="header">
            <h1 className="appTitle">{ data.name }</h1>
            <Progress total={ data.steps.length } currentIndex={ data.maxCount || 0 } width={`calc(100vw - 500px)`} />
            <div className='countdown-wrapper'>
              {
                gameOngoing &&
                <Countdown date={ timeout } onStop={endGame} onComplete={endGame} renderer={ ({formatted: { hours, minutes, seconds }}) => <div className='countdown' style={ { color: minutes <= 5 ? "#f94a56": "#f8f9fa" } }>{hours}:{minutes}:{seconds}</div>} />
              }
              <div className={`anchor${gameOngoing === false ? " open" : ""}`}>
                <div className='alarm'>
                  <img className="alarm-icon" src={ alarm_clock } alt="alarm" />
                  <h1 className='alarm-banner'>STOP CHRONO !</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="board">
            {
              data.campus.length === 0 ?
              <h1 className='pending-banner'>À vos marques . . .</h1>
              :
              data.campus.map(campus => <Campus key={ campus._id } campus={ campus } gameOngoing={gameOngoing} isWinner={isWinner} data={ data } winners={winners} />)
            }
          </div>
        </>
      }
    </div>
  )
}
