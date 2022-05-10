import React from 'react'
import { useParams, useNavigate } from "react-router-dom"

export default function Start() {
    const { batchId } = useParams()
    const navigate = useNavigate()

    const handleClick = async () => {
        let data = await fetch(`http://localhost:3000/batch/katas/start/${batchId}`, {
            method: "POST",
        })

        let { result } = await data.json()

        if (result) navigate(`/leaderboard/${batchId}`)
    }

    return (
        <div className="container start">
            <button className="start-button" onClick={ handleClick }>LET'S GO !</button>
        </div>
    )
}
