import toastr from 'https://cdn.jsdelivr.net/npm/toastr@2.1.4/+esm';

const URL = 'https://jsonplaceholder.typicode.com';

const POSTS_MAX_ID = 100;
const POSTS_MIN_ID = 1;

const SPINNER_SRC = 'src/assets/icons/spinner.svg';
const REQUEST_SRC = 'src/assets/icons/request.svg';

const AVATAR_MIN = 1;
const AVATAR_MAX = 26;

toastr.options = {
    "closeButton": true, // есть кнопка для закрытия уведомления
    "newestOnTop": true, // новые уведомления появляются выше
    "progressBar": true, // внизу уведомления есть прогрессбар
    "positionClass": "toast-bottom-left", // позиция уведомления на экране
    "timeOut": "3000", // время жизни уведомления
    "extendedTimeOut": "0", // время жизни уведомления после клика на него
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const handleSuccess = () => {
    toastr.success('Комментарии успешно загружены!');
}

const handleError = () => {
    toastr.error('Во время выполнения запроса произошла ошибка. Попробуйте еще раз...')
}

const renderCommentCard = (comment) => {
    const template = document.querySelector('#comment-template');
    const commentClone = template.content.cloneNode(true);

    const randAvatarInd = getRandomInt(AVATAR_MIN, AVATAR_MAX);

    commentClone.querySelector('img').src = `src/assets/icons/avatars/vibrent_${randAvatarInd}.png`;
    const [commentName, authorEmail] = commentClone.querySelector('.comment-info').querySelectorAll('span');
    commentName.innerText = comment.name;
    authorEmail.innerText = comment.email;

    commentClone.querySelector('#comment-body').innerText = comment.body;
    commentClone.querySelector('#post-id').innerText = `Post ID: ${comment.postId}`;

    commentsContainer.appendChild(commentClone)

}

const requestButton = document.querySelector('.request-button');
const commentsContainer = document.querySelector('.comments');
requestButton.addEventListener('click', () => {
    const img = requestButton.querySelector('img');
    img.src = SPINNER_SRC;

    const randPostId = getRandomInt(POSTS_MIN_ID, POSTS_MAX_ID);
    fetch(`${URL}/comments?postId=${randPostId}`).then(
        value => value.json()
            .then(data => {
                handleSuccess();
                data.map(renderCommentCard);
                img.src = REQUEST_SRC;
            }),
        () => {
            handleError();
            img.src = REQUEST_SRC;
        }
    )
})