import Team from './Team'

export default function Campus({ campus, ...props }) {

  return (
    <div className="campus-card">
      <div className="campus-header">
        <h4>{ campus._id }</h4>
      </div>
      <div className="campus-body">
        {
          campus.teams.map(team => <Team key={ team.team } team={team} { ...props }/>)
        }
      </div>
    </div>
  )
}
