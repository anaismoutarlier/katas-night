import winner_badge from "./winner_badge.svg"
import { useRef, useEffect, useState } from "react" 

export default function Team({ team, data, winners, isWinner, gameOngoing }) {
  const winner = winners.find(el => el.team === team.team) 
  const won = isWinner && isWinner.team === team.team
  const isCheater = data["CHEATERS"].find(el  => el.team === team.team)
  const isLeader = data.leading.find(el => el.team === team.team)
  const isRecent = data.recent.find(el => el.team === team.team)
  
  const [dimensions, setDimensions] = useState({ minHeight: 140, minWidth: 140 })
  
  useEffect(() => {
    if (cardRef.current) setDimensions({ minHeight: cardRef.current.offsetHeight, minWidth: cardRef.current.offsetWidth })
  }, [])

  const cardRef = useRef()

  let status = ""
  if (isRecent && gameOngoing) status = " recent"
  if (isLeader) status = " leader"
  if (winner) status = " winner"
  if (won) status = " winner new"
  if (isCheater) status = " cheater"

  return (
    <div className='wrapper' style={ dimensions }>
      <div className={`team-card${status}`} ref={ ref => ref = cardRef }>
        { 
          (won || winner) && 
          <>
            <h3 className='winner-banner'>WINNER !</h3>
            <img className='winner-badge' src={winner_badge} alt="winner" />
          </>
        }
        <div className="team-header">
          <h4 dangerouslySetInnerHTML={ { __html: team.team } } />
          <div className='content-container'>
            {
              team.students.sort((a,b) => a.name.charCodeAt(0) - b.name.charCodeAt(0)).map(student => <img className="avatar" key={student._id} alt={student.name} src={ student.avatar ? `https://ariane.lacapsule.academy/images/avatar/${student._id}.jpg` : `https://ariane.lacapsule.academy/images/avatar/_male-default.jpg` }/>)
            }
          </div>
        </div>
        <div>
          <h5 className='team-count'>{ isCheater ? isCheater.count : team.count }</h5>
        </div>
        <div className='exercise-wrapper'>
          {
            isCheater ?
            <>
              <p style={{ color: '#f94a56', fontWeight: 900, margin: 0 }}>ERROR 404:</p>
              {
                isCheater.skipped.map(step => <p key={step} style={{ color: '#f94a56', margin: 0 }}>{step}</p>)
              }
            </>
            :
            <p style={{ color: winner ? '#F8B64C' : "#000000", fontWeight: 900, margin: 0 }}>{ team.lastExercise }</p>
          }
        </div>
      </div>
    </div>
  )
}
