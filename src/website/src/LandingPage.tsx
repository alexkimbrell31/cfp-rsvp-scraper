import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// import './App.css'


type Team = {
  id: number
  name: string
  active: number
}

type GetTeamsResponse = {
  success: boolean
  data: Team[]
  count: number
}

export const LandingPage = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    fetch('/api/teams')
      .then(response => {
        if (!response.ok) {
          console.error(`API request failed with status: ${response.status}`)
          return null
        }
        return response.json()
      })
      .then((response: GetTeamsResponse | null) => {
        // Gracefully handle missing data array
        if (response && Array.isArray(response.data)) {
          setTeams(response.data)
        } else {
          console.error('API returned invalid data structure:', response)
          setError('Invalid data format received')
          setTeams([])
        }
      })
      .catch(error => {
        console.error('Error fetching teams:', error)
        setError(error.message)
        setTeams([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div>
        <h1>CFP RSVP Teams</h1>
        <p>Loading teams...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h1>CFP RSVP Teams</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>CFP RSVP Teams</h1>
      {teams.length === 0 ? (
        <p>No teams found</p>
      ) : (
        <div>
          {teams.map((team: Team) => (
            <div key={team.id}>
              <Link to={`/teams/${team.id}`}>
                <button type="button">
                  <h3>{team.name}</h3>
                  <p>Status: {team.active === 1 ? 'Active' : 'Inactive'}</p>
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LandingPage