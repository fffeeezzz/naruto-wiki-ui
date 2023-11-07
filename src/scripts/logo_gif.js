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