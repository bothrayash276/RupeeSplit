export default async function serverData_User (email) {
    // Fetches Data from User
    const res = await fetch(`http://localhost:8080/find/${email}`)
    const file = await res.json()
    // Returns that data
    return file
}