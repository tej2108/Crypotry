import React from 'react';
import './Welcome.css'

export default class Welcome extends React.Component {
    render() {
        return (
            <div >
                <h2> <a className="welcome"  href="/login/github">Login</a></h2>
            </div>
        )
    }
}

