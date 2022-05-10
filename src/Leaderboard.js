import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from "react-router-dom"

import Progress from "./Progress"
import Campus from './Campus'

export default function Leaderboard() {
  const [data, setData] = useState(null)
  const [winners, setWinners] = useState([])
  const [isWinner, setIsWinner] = useState(null)
  const [timeout, setTimeout] = useState(null)
  const [gameOngoing, setGameOngoing] = useState(false)

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
        console.log("filter",res.all.filter(team => team.count === res.steps.length))
        if (end > now) {
          setGameOngoing(true)
          setIsWinner(res.leading[0])
        } else {
          if (interval) clearInterval(interval)
        }
      }
    }
    fetchData()
    // interval = setInterval(() => fetchData(), 10000)

    // return  () => interval ? clearInterval(interval) : null
  }, [batchId, navigate])

  useEffect(() => isWinner && winners.find(team => team.team === isWinner.team) ? setTimeout(() => setIsWinner(null), 5000) : undefined, [winners, isWinner])
  
  return (
    <div className="container leaderboard">
      {
        data &&
        <>
          <div className="header">
            <h1 className="appTitle">{ data.name }</h1>
            <Progress total={ data.steps.length } currentIndex={ data.maxCount || 0 } width={`calc(100vw - 500px)`} />
            <div className='countdown-placeholder'/>
          </div>
          <div className="board">
            {
              data.campus.map(campus => <Campus key={ campus._id } campus={ campus } gameOngoing={gameOngoing} isWinner={isWinner} data={ data } winners={winners} />)
            }
          </div>
        </>
      }
    </div>
  )
}
