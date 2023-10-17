import React, { Component } from 'react';


export class LoginForm extends Component {
    static displayName = LoginForm.name;
    render() {
        const contactServer = () => {
            fetch('https://localhost:7063/api/values', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            // Since React and ASP.NET Core are served from the same origin in your setup, a relative URL will work.
                .then(response => response.text())
                .then(data => {
                    console.log(data); // Should print "Hello from ASP.NET Core Web API!"
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

        console.log("moshiach now!")
        return (
            
            <div>
                <button onClick={contactServer}>press</button>
            </div>
           
        )
    }
}