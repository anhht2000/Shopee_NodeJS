var imageMain = document.querySelector('.detail__left-img')
var imageSub = document.querySelectorAll('.detail__left-img-sub-img')
// console.log(imageSub[0].getAttribute('name'))
// imageMain.style.background = 'url("https://cf.shopee.vn/file/e4a7ce285cad39da68daae84de428c21") center center/cover no-repeat'
for (var image of imageSub){
    image.onmouseover = function(e){
        var imageActive = document.querySelector('.detail__left-img-sub-img.detail__left-img-sub-img--active')
        imageActive.classList.remove('detail__left-img-sub-img--active')
        // console.log(e.target.getAttribute('name'))
        e.target.classList.add('detail__left-img-sub-img--active')
        imageMain.style.background = `url('${e.target.getAttribute('name')}') center center/cover no-repeat`;
        
    }
}