const socket = io()
//Elments 
const $messageform = document.querySelector('#message_form')
const $messageforminput = document.querySelector('input')
const $messageformbutton =  document.querySelector('button')
const $sendlocbutton =  document.querySelector('#send_loc')
const $messages = document.querySelector('#messages')
// socket.on('countUpdated',(data)=>{
//     console.log('Count is Updated',data)
// })
//Templates
const loc_message_template = document.querySelector('#loc_message_template').innerHTML
const message_template = document.querySelector('#message_template').innerHTML
const sidebar_template = document.querySelector('#sidebar_template').innerHTML
//options
const auto_scroll = () => {
    //New Mwssage
    const $new_message = $messages.lastElementChild
     
    //height of last message or new  message height incuding margin
    const new_message_styles = getComputedStyle($new_message)
    const new_message_margin = parseInt(new_message_styles.marginBottom)
    const new_message_height = $new_message.offsetHeight + new_message_margin
     
    //visible height

    const visible_height = $messages.offsetHeight

    //container height or content height  or full blank space height

    const container_height = $messages.scrollHeight

    //full height scrolled or how fardown we have scrolled

    const how_far_scrolled = $messages.scrollTop + visible_height

    if (container_height - new_message_height <= how_far_scrolled) {
        $messages.scrollTop = $messages.scrollHeight
    }


}

const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true})
socket.on('message',(data)=>{
    console.log(data)
    const html = Mustache.render(message_template,{
        username: data.username,
        message_data: data.text,
        createdAt: moment(data.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    auto_scroll()
})

socket.on('Locmessage',(data)=>{
    console.log(data)
    const html = Mustache.render(loc_message_template,{
        username: data.username,
        url: data.url,
        createdAt: moment(data.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    auto_scroll()
})
socket.on('Room Data' , ({room , users})=>{
    const html = Mustache.render(sidebar_template,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})
$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    //disabeling buttion here
    $messageformbutton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage',message ,(error)=>{
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value = ''
        $messageforminput.focus()
        if(error){
            return console.log(error)
        }
        console.log('The Message Was Delivered')
    })
})
$sendlocbutton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation Not Supported')
    }
    $sendlocbutton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((postiton)=>{
        console.log(postiton)
        socket.emit('sendLoc',{

            latitude: postiton.coords.latitude,
            longitude: postiton.coords.longitude
        },()=>{
            $sendlocbutton.removeAttribute('disabled')

            console.log('Location Shared Successfully')
        })
    })
})

socket.emit('join',{ username , room},(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('Clicked')
//     socket.emit('increment')
// })