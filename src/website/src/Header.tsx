// Header component for the website. This is a simple header that will be used on all pages of the website. 
// It will contain the CFP RSVP Logo in the upper left hand corner and will contain links at the top from 
// left to right for the following pages: Home, 100/300 Level Price Graph, Team Analytics, 
// Current Team Odds (Playoffs & National Championship Odds)
import React from 'react'

export const Header = () => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f5f5f5' }}>
                <h3>CFP RSVP (Home)</h3>
                <h3>100/300 Level Price Graph</h3>
                <h3>Team Analytics</h3>
                <h3>Current Team Odds</h3>
            </div>
        </>
    )
}

export default Header