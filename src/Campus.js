import React from 'react'

import Team from './Team'

export default function Campus({ campus, data, winners, isWinner, gameOngoing }) {
  console.log({ winners })
  return (
    <div className="campus-card">
      <div className="campus-header">
        <h4>{ campus._id }</h4>
      </div>
      <div className="campus-body">
        {
          campus.teams.map(team => <Team key={ team.team } team={team} gameOngoing={gameOngoing} data={data} winners={winners} isWinner={isWinner}/>)
        }
      </div>
    </div>
  )
}
