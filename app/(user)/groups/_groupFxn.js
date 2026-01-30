export async function newGroup(data) {
    // url
    const url = 'http://localhost:8080/newgrp';
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export async function updateUser(user) {
    const url = 'http://localhost:8080/update'
    fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(user)
        })
}

