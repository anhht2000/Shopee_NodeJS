// var btons =document.querySelectorAll('.bton__js')
// for(var bton of btons){
//     bton.onclick = function(e){
        
//     }
// }
var clock = document.querySelector('.main__content-filter')
clock.onclick = handleEvent
function handleEvent(e){
    console.log(e)
    var bton = e.target.closest('.bton__js')
    var btonActive = clock.querySelector('.bton.bton--primary')
    if(bton){
        btonActive.classList.remove('bton--primary')
        bton.classList.add('bton--primary')
        bton.classList.remove('main__content-filter__button--white')
    }
}