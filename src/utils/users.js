const users=[]

//Adding a user
const addUser=({id,username,room})=>{
    //clean the data
    // console.log(id,username,room)
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return{
            error:"Username and room are required"
        }
    }
    const existingUser=users.find((user)=>user.username===username && user.room===room)
    if(existingUser){
        return {error:"Username is in use"}
    }
    const user={id,username,room}
    // console.log(user)
    users.push(user)
    return {user}
}


// Removing a user
const removeUser=id=>{
    const index=users.findIndex(user=>user.id===id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

//get a user
const getUser=id=>users.find(user=>user.id===id)

//get users in a room
const getUsersInRoom=room=>users.filter(user=>user.room===room)

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
