import { useState, useEffect } from "react";

export function loadUserData(username) {
    const [data, setData] = useState(null)

    useEffect(() => {
        async function getData(){
            const res = await fetch(`http://localhost:8080/${username}`)
            const d = await res.json()
            setData(d)
        }
        getData()
    }, [])
    return data
}