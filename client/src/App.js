import React, { useState, useEffect } from 'react'

function App() {
  // 'data' is the actual variable and setData is the function we can use to manipulate the state of the 'data' variable. 
  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/members").then(
        res => res.json()   // put the response the /member route gives us gets put into json
    ).then(
        data => {           // whatever data is inside the json gets put into the 'data' variable using the setData function
            setData(data)   
            console.log(data) // to make sure the api fetch worked we console log to see if the data was retrieved
        }
    )
  }, []) // pass in empty array with useEffect block to ensure it only runs once


  return (
    <div>App</div>
  )
}

export default App