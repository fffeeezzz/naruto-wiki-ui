const {pathname} = document.location;

const ulElements = document.querySelectorAll('.dropdown');

ulElements.forEach(ul => {
    const {href} = ul.dataset;
    if (pathname.includes(href)) {
        ul.classList.add('ul-link');
    }
})