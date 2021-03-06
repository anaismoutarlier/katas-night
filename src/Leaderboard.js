import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"

import Countdown from 'react-countdown'

import Progress from "./Progress"
import Campus from './Campus'

import alarm_clock from "./alarm_clock.png"
import logo from "./Lacapsule-logo-simple.png"

export default function Leaderboard() {
  const [data, setData] = useState(null)
  const [winners, setWinners] = useState([])
  const [isWinner, setIsWinner] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [startDate, setStartDate] = useState(null)
  const [gameOngoing, setGameOngoing] = useState(null)
  
  const { batchId } = useParams()
  
  useEffect(() => {
    let interval;

    let winnersList = [];
    const fetchData = async () => {
      let now = new Date()

      if(startDate && now < startDate) return

      const data = await fetch(`https://ariane-backend-test.herokuapp.com/batch/katas/progress/${batchId}`)
      const json = await data.json()

      const { result, dateStart, dateEnd, ...res } = json

      if (result) {
        
        let start = new Date(dateStart)
        let end = new Date(dateEnd)

        setData(res)

        if (start > now) {
          setStartDate(start)
          return
        }
        
        setWinners(res.all.filter(team => team.count === res.steps.length))
        if (end > now) {
          setGameOngoing(true)
          setEndDate(end)
          
          if (res.leading.length) {
            let newWinners = res.leading.filter(team => team.count === res.steps.length && !winnersList.find(el => el.team === team.team))

            if (newWinners.length) console.log(new Date(newWinners[0].updatedAt) > new Date().setMinutes(new Date().getMinutes() - 3))
            if(newWinners.length && newWinners[0].count === res.steps.length) {
              setIsWinner(newWinners[0])
              setTimeout(() => setIsWinner(null), 3000)
            }

            winnersList = res.leading.filter(team => team.count === res.steps.length)
          }
        } else {
          setWinners([res.leading[0]])
          if (interval) clearInterval(interval)
        }
      }
    }

    fetchData()
    interval = setInterval(() => fetchData(), 7000)

    return  () => interval ? clearInterval(interval) : null
  }, [batchId, startDate])

  const endGame = async () => {
    await fetch(`https://ariane-backend.herokuapp.com/batch/katas/end/${batchId}`, {
      method: "POST"
    })
    setGameOngoing(false)
  }

  return (
    <div className="container leaderboard">
      {
        data &&
        <>
          <div className="header">
            <div style={{ display: "flex", alignItems: "center"}}>
              <img src={ logo } alt="logo" style={{ height: 25, width: 28, marginRight: 7 }} />
              <h1 className="appTitle">{ data.name }</h1>
            </div>
            <Progress total={ data.steps.length } currentIndex={ data.maxCount || 0 } width={`calc(100vw - ${gameOngoing ? 600 : 520}px)`} />
            <div className='countdown-wrapper' style={{ width: gameOngoing ? 270 : 180}}>
              {
                gameOngoing && endDate &&
                <Countdown date={ endDate } onStop={endGame} onComplete={endGame} renderer={ ({formatted: { hours, minutes, seconds }}) => <div className='countdown' style={ { color: hours < 1 && minutes < 5 ? "#f94a56": "#f8f9fa" } }>{hours}:{minutes}:{seconds}</div>} />
              }
              <div className={`anchor${endDate && gameOngoing === false ? " open" : ""}`}>
                <div className='alarm'>
                  <img className="alarm-icon" src={ alarm_clock } alt="alarm" />
                  <h1 className='alarm-banner'>STOP CHRONO !</h1>
                </div>
              </div>
              {
                gameOngoing === null && startDate < new Date() &&
                <div className='countdown' style={{ display: "flex", justifyContent: "center", width: '150px', border: `2px solid ${data.maxCount === data.steps.length ? "#F8B64C" : data.maxCount > Math.floor(data.steps.length * 0.75) ? "#98edc4" : data.maxCount < data.steps.length / 2 ? "#f94a56" : "white"}` }}>
                  <h1 className="appTitle" style={{ fontWeight: "5rem", color: data.maxCount === data.steps.length ? "#F8B64C" : data.maxCount > Math.floor(data.steps.length * 0.75) ? "#98edc4" : data.maxCount < data.steps.length / 2 ? "#f94a56" : "white" }}>{ data.maxCount } / { data.steps.length }</h1>
                </div>
              }
            </div>
          </div>
          <div className="board">
            {
              data.campus.length === 0 ?
              <h1 className='pending-banner'>?? vos marques . . .</h1>
              :
              data.campus.map(campus => <Campus key={ campus._id } campus={ campus } gameOngoing={gameOngoing} isWinner={isWinner} data={ data } winners={winners} />)
            }
          </div>
        </>
      }
    </div>
  )
}
