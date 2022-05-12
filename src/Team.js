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

  let error;
  if (isCheater) {
    console.log(isCheater.count)
    error = isCheater.skipped.map(step => `${step}, `).join("").split("")
    error = error.slice(0, error.length - 2)
    error.join("")
  }
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
        <div className="team-header">
          <h4>{ team.team }</h4>
          <div className='content-container'>
            {
              [ ...team.students].map(({ name }) => name).sort().map((el, i) => {
                let student = team.students.find(e => e.name === el)
                return <img className="avatar" key={student._id} alt={student.name} src={ student.avatar ? `https://ariane.lacapsule.academy/images/avatar/${student._id}.jpg` : `https://ariane.lacapsule.academy/images/avatar/_male-default.jpg` }/>
            })
            }
          </div>
        </div>
        <div>
          <h5 className='team-count'>{ isCheater ? isCheater.count : team.count }</h5>
        </div>
        <div className='exercise-wrapper'>
          {
            isCheater ?
            <><span style={{ color: '#f94a56' }}><span style={{ fontWeight: 900 }}>ERROR 404:</span> { error }</span></>
            :
            team.lastExercise
          }
        </div>
      </div>
    </div>
  )
}
