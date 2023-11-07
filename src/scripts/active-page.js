const { pathname } = document.location

const universeUl = document.querySelector('#universe')
const charactersUl = document.querySelector('#characters')

if (pathname.includes('universe.html')) {
    universeUl.style.background = '#f08e09'
    universeUl.style.borderBottom = '1px solid #f08e09'
} else if (pathname.includes('characters.html')) {
    charactersUl.style.background = '#f08e09'
    charactersUl.style.borderBottom = '1px solid #f08e09'
}