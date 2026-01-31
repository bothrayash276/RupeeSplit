export async function newGroup(data) {
    // url
    const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/newgrp`;
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
}

export async function updateUser(user) {
    const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/update`
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
    
    const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/transaction`
    const res = await fetch(url, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    }).then( res => res.json())

    return  res  
}

export async function updateGroup(data) {
    const url = `${process.env.NEXT_PUBLIC_MONGO_URI}/updategrp`
    await fetch(url, {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
}

export function due (username, dues) {
    const data = dues[username];
    const portfolio = Object.values(data)
    let money = 0;
    for(let i = 0; i < portfolio.length; i++){
        money += Number(portfolio[i])
    }
    console.log(Object.values(portfolio))
    return money
}

