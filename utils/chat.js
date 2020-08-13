const moment = require('moment');
const userPanel = [];

const userJoin = (user,id)=>{
    const userP = {
        username : user.username,
        room : user.room,
        id : id
    }
    userPanel.push(userP);
    console.log(userPanel)
}

const userLeft = (id)=>{
    const index = userPanel.findIndex(user => user.id === id);

    if (index !== -1) {
      return userPanel.splice(index, 1)[0];
    }
}

const getRoomUsers = (room) => {
    return userPanel.filter(user => user.room === room)
}

const getRoom = (id) =>{
    return userPanel.find(user => user.id === id);
}

const formatMessage = (msg, username)=>{
    return {
        msg,
        username,
        time : moment().format('h:mm a')
    }
}

module.exports = {
                    userJoin,
                    userLeft,
                    getRoomUsers,
                    getRoom,
                    formatMessage
                    };