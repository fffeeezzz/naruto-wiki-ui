window.addEventListener('load', () => {
    const imgElem = document.querySelector('#header-logo');
    const headerNavLogo = document.querySelector('.header-nav__logo');
    const link = document.createElement('a');
    headerNavLogo.removeChild(imgElem);
    link.href = 'index.html';
    link.append(imgElem);
    headerNavLogo.append(link);
    const prevSrc = imgElem.getAttribute('src');
    const newSrc = 'https://i.gifer.com/C7Lq.gif';
    imgElem.setAttribute('src', newSrc);
    setTimeout(() => {
        imgElem.setAttribute('src', prevSrc);
    }, 2000)
})


const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
window.addEventListener('load', () => {
    if (getRandomInt(0, 10) % 2 === 0) {
        const headerAuth = document.querySelector('.header-auth')
        const signIn = document.querySelector('#sign-in')
        const register = document.querySelector('#register')
        headerAuth.removeChild(signIn)
        headerAuth.removeChild(register)

        const img = document.createElement('img');
        img.src = 'src/assets/icons/auth-icon.png';
        headerAuth.append(img)
    }
})