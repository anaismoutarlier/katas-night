import winner_badge from "./winner_badge.svg"

export default function Team({ team, data, winners, isWinner, gameOngoing }) {
  const winner = winners.find(el => el.team === team.team) 
  const won = isWinner && isWinner.team === team.team
  const isCheater = data["CHEATERS"].find(el  => el.team === team.team)
  const isLeader = data.leading.find(el => el.team === team.team)
  const isRecent = data.recent.find(el => el.team === team.team)
  
  let status = ""
  if (isRecent && gameOngoing) status = " recent"
  if (isLeader) status = " leader"
  if (winner) status = " winner"
  if (won) status = " winner new"
  if (isCheater) status = " cheater"

  return (
    <div className='wrapper'>
      <div className={`team-card${status}`}>
        { 
          (won || winner) && 
          <>
            <h3 className='winner-banner'>WINNER !</h3>
            <img className='winner-badge' src={winner_badge} alt="winner" />
          </>
        }
        <div>
          <h4>{ team.team }</h4>
          <div className='content-container'>
            {
              team.students.map(student => <img className="avatar" src={ student.avatar ? `https://ariane.lacapsule.academy/images/avatar/${student._id}.jpg` : `https://ariane.lacapsule.academy/images/avatar/_male-default.jpg` } alt={ "" }/>)
            }
          </div>
        </div>
        <div>
          <h5 className='team-count'>{ team.count }</h5>
        </div>
        <div className='exercise-wrapper'>
          { team.lastExercise.replace(/#[0-9]+\s-\s/, "") }
        </div>
      </div>
    </div>
  )
}
