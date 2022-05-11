const Step = ({ index, isActive, isNext, total, width }) => {
  return (
    <div className="progress-wrapper" style={ { width: index < total ? width : "28px" } }>
      <div className={ `progress-outer${isActive ? " active" : ""}` }>
        <div className={ `progress-inner${ isActive ? " active" : ""}` } />
      </div>
      {
        index < total &&
        <div className={ `progress-bar${isNext ? " partial" : isActive ? " active": ""}` } style={ { width: 'calc(100% - 28px)'}} />
      }
    </div>
  )
}

export default function Progress({ total, currentIndex, width }) {
  return (
    <div style={ { width } } className="progress">
      {
        Array.from({ length: total }, (_, i) => i + 1)
        .map(step => <Step key={`step-${step}`} index={step} width={`calc(100% / ${total - 2})`} total={ total } currentIndex={ currentIndex } isActive={step <= currentIndex } isNext={ step === currentIndex } />)
      }
    </div>
  )
}
