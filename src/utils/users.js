const users= []

const Adduser = ({id , username , room}) => {
    //clean Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate Data
    if(!username || !room){
        return {
            error: 'Username And Room Are Required'
        }
    }
    //Check for Existing User
    const existing_user =  users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validate USername

    if(existing_user){
        return {
            error: 'Username Already Taken'
        }
    }

    //Store USer

    const user = { id, username , room}
    users.push(user) 
    return { user }
}
const Removeuser = (id) => {
    const index = users.findIndex((user)=>user.id === id)

    if(index != -1){
        return users.splice(index , 1)[0]
    }
}

const Getuser = (id) => {
    const user_id = users.find((user)=> user.id === id )
    return user_id
    // if(!user_id){
    //     return {
    //         error: 'Undefined'
    //     }
    // }
    // return users.find((user)=>{
    //     return user.id === id
    // })
}

const Allusers = (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>{ 
        return user.room === room
    })
}
module.exports = {
    Adduser,
    Getuser,
    Allusers,
    Removeuser
}
// adduser({
//     id: 22,
//     username: 'Rahul',
//     room: 'hello'
// })
// adduser({
//     id: 23,
//     username: 'sumit',
//     room: 'hello'
// })
// adduser({
//     id: 12,
//     username: 'Rahul',
//     room: 'kk'
// })
// // console.log(users)

// // const remov = removeuser(22)
// // console.log(remov)
// // console.log(users)

// // const user_ided = get_user(22)
// // console.log(user_ided)

// const ain = all_users('kk')
// console.log(ain)

