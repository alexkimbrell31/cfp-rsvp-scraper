import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

type TeamPriceData = {
    id: number
    name: string
    price: number
    timestamp: string
}

type GetTeamResponse = {
  success: boolean
  data: TeamPriceData[]
  count: number
}

export const TeamPage = () => {
    const [teamPriceData, setTeamPriceData] = useState<TeamPriceData[] | null>(null)
    const { teamId } = useParams<{ teamId: string }>()

    useEffect(() => {
        fetch(`/api/prices/${teamId}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`API request failed with status: ${response.status}`)
                    return null
                }
                return response.json() as Promise<GetTeamResponse>
            })
            .then((response) => {
                if (response && response.success) {
                    console.log('setting team price data:', response.data)
                    setTeamPriceData(response.data)
                }
            })
            .catch(error => {
                console.error('Error fetching team data:', error)
            })
    }, [teamId])

    console.log('Team price data:', teamPriceData)

    return (
        <div>
            <h1> {teamPriceData && teamPriceData.length > 0 ? teamPriceData[0].name : ''} Team Page - ID: {teamPriceData && teamPriceData.length > 0 ? teamPriceData[0].id : ''} </h1>
            <p>Team price data graph will go here</p>
        </div>
    )
}

export default TeamPage