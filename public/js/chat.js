socket = io()

// Elements
$messageForm = document.querySelector('form')
$messageFormInput = $messageForm.querySelector('input')
$messageFormButton = $messageForm.querySelector('button')
$sendLocationButton = document.querySelector('#send-location')
$messages = document.querySelector('#messages')
//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll=()=>{
    // New message element
    const $newMessage=$messages.lastElementChild

    // Height of new message
    const newMessageStyle=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

    //Visible height
    const visibleHeight=$messages.offsetHeight

    //Height of message container
    const  containerHeight=$messages.scrollHeight

    //How far i have scrolled
    const scrollOffset=$messages.scrollTop+visibleHeight

    if(containerHeight-newMessageHeight<= scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }
}
// Listening for message event 
socket.on('message', ({ message,createdAT,username }) => {
    createdAT = moment(createdAT).format('h:mm:a')
    const html = Mustache.render(messageTemplate, {
        username,
        message,
        createdAT
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

// Listening for locationMessage event
socket.on('locationMessage', ({ url, createdAT,username }) => {
    createdAT = moment(createdAT).format('h:mm:a')
    const html = Mustache.render(locationTemplate, {
        username,username,
        url,
        createdAT
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

//Listening for roomData event
socket.on('roomData',({room,users})=>{
   const html=Mustache.render(sidebarTemplate,{
       room,
       users
   })
   document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', true)
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log("Message delivered!")
    })
})
$sendLocationButton
    .addEventListener('click', () => {
        if (!navigator.geolocation) {
            return alert("Geolocation is not supported by your browser")
        }
        // $sendLocationButton.setAttribute('disabled', true)
        navigator.geolocation.getCurrentPosition((position) => {
            const { longitude, latitude } = position.coords
            socket.emit('sendLocation', { longitude, latitude}, (message) => {
                $sendLocationButton.removeAttribute('disabled')
                console.log(message)
            })
        })
    })
    socket.emit('join',{username,room},(error)=>{
        if(error){
            alert(error)
            location.href='/'
        }
    })