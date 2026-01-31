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

export async function transactionObj (paid, participants, division) {
    const data = []
    for (let i = 0; i < participants.length; i++) {
        const obj = {
            "lend" : paid,
            "owe" : participants[i],
            "amount" : division
        }
        data.push(obj)
    }
    
    const url = 'http://localhost:8080/transaction'
    const res = await fetch(url, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    }).then( res => res.json())

    return res    
}

