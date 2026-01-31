export default async function serverData_User (email) {
    // Fetches Data from User
    const res = await fetch(`${process.env.NEXT_PUBLIC_MONGO_URI}/find/${email}`)
    const file = await res.json()
    // Returns that data
    return file
}