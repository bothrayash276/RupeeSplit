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

export async function transactionObj (data) {
        
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
    if(!data){
        return 0
    }
    const portfolio = Object.values(data)
    let money = 0;
    for(let i = 0; i < portfolio.length; i++){
        money += Number(portfolio[i])
    }
    return money
}

export function arrToStr (arr) {
    let s = ``;
    for( let i = 0; i < arr.length; i++ ){
        s += `${arr[i]} `
    }
    return s;
}

