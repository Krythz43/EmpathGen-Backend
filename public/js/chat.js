const socket = io()

// socket.on('countUpdated',(count) => {
//     console.log(`The count has been updated as ${count}`)
// })

// document.querySelector("#incre").addEventListener('click',() => {
//     console.log('Clicked!')
//     socket.emit('increment')
// })

socket.on('welcomeMessage',(message) => {
    console.log(message);
})

document.querySelector("#message-form").addEventListener('submit',(e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    socket.emit('sendMessage',message)
})