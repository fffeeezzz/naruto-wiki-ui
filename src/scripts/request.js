import toastr from 'https://cdn.jsdelivr.net/npm/toastr@2.1.4/+esm';

const URL = 'https://naruto-wiki.onrender.com';

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

const handleSuccessStats = () => {
    toastr.success('Количество шиноби в кланах изменилось');
}

const handleErrorStats = () => {
    toastr.error('Иди смотри логи, все сломалось')
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

const socket = io('https://naruto-wiki.onrender.com');
socket.on('connect', function() {
    console.log('Connected');

    socket.emit('events', { test: 'test' });
    socket.emit('identity', 0, response =>
        console.log('Identity:', response),
    );
});
socket.on('events', function(data) {
    console.log('event', data);
});
socket.on('shinobi_stats_event', function(data) {
    let randPostId = getRandomInt(POSTS_MIN_ID, POSTS_MAX_ID);
    if (randPostId % 2 === 0) {
        handleSuccessStats()
        return
    }

    handleErrorStats()
});
socket.on('disconnect', function() {
    console.log('Disconnected');
});

const requestButton = document.querySelector('.request-button');
const commentsContainer = document.querySelector('.comments');
requestButton.addEventListener('click', () => {
    socket.emit('shinobi_changed_event', "hello from client");

    const img = requestButton.querySelector('img');
    img.src = SPINNER_SRC;

    const randPostId = getRandomInt(POSTS_MIN_ID, POSTS_MAX_ID);
    let responseTime = 0
    fetch(`${URL}/api/comments?postId=${randPostId}`).then(
        response => {
            if (response.status >= 300) {
                throw new Error()
            }

            responseTime = response.headers.get('X-Response-Time');
            return response.json();
        }
    ).then(
        data => {
            handleSuccess()
            const startTime = Date.now();
            data.map(renderCommentCard)
            img.src = REQUEST_SRC
            const renderTime = Date.now() - startTime

            const timeElement = document.getElementById("page-load-time")
            timeElement.innerText = `Render time - ${renderTime} ms, Response time- ${responseTime} ms`;
            timeElement.style.color = '#FFFFFF';
            document.getElementById("load-time").style.textAlign = 'center';
        }
    ).catch(
        () => {
            handleError();
            img.src = REQUEST_SRC
        }
    );
})