const app = document.querySelector('.app');
window.application = {};

function renderButton() {
    const button = document.createElement('button');
    button.className = 'btn';
    button.textContent = 'Войти';

    button.addEventListener('click', () => {
        renderLogin();
    })

    app.appendChild(button);
};

renderButton();

function renderLogin() {
    app.textContent = '';

    const container = document.createElement('div');
    container.className = 'container center';

    const img = document.createElement('img');
    img.className = 'img';
    img.src = './img/Mask group.svg';

    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = 'Камень, ножницы, бумага';

    const nick = document.createElement('h4');
    nick.className = 'nick';
    nick.textContent = 'Никнейм';

    const input = document.createElement('input');
    input.className = 'input';
    input.placeholder = 'Введите никнейм';

    const button = document.createElement('button');
    button.className = 'btn_login';
    button.textContent = 'Войти';
    button.disabled = true;
    
    container.appendChild(title);
    container.appendChild(nick);
    container.appendChild(input);
    container.appendChild(button);
    app.appendChild(img);
    app.appendChild(container);

    input.addEventListener('input', () => {
        if (input.value) {
            button.style.backgroundColor = '#580EA2';
            button.disabled = false;
            
            button.onclick = () => {

                request({
                    method: 'GET',
                    url: `https://skypro-rock-scissors-paper.herokuapp.com/login?login=${input.value}`,
                    onSuccess: (data) => {

                        window.application.token = data.token;
                    
                        request({
                            url: `https://skypro-rock-scissors-paper.herokuapp.com/player-status?token=${window.application.token}`,
                            onSuccess: (data) => {
                                console.log(data["player-status"].status);

                                if (data["player-status"].status === 'lobby') {
                                    renderLobby()
                                }else{
                                    console.log('lobby error');
                                };
                                
                            },
                        });

                    },
                });

            };
        }else{
            button.style.backgroundColor = '#C4C4C4';
            button.disabled = true;
        };
    });
};

function renderLobby() {
    app.textContent = '';

    const container = document.createElement('div');
    container.className = 'container center';

    const upperBox = document.createElement('div');
    upperBox.className = 'upper_box';

    const title = document.createElement('h1');
    title.className = 'title_lobby';
    title.textContent = 'Лобби';

    const button = document.createElement('button');
    button.className = 'btn_lobby';
    button.textContent = 'Играть!';

    const img = document.createElement('img');
    img.className = 'img_lobby';
    img.src = './img/img_without_color.svg';

    const nameContainer = document.createElement('div');
    nameContainer.className = 'name_container';

    container.appendChild(title);

    request({
        method: 'GET',
        url: `https://skypro-rock-scissors-paper.herokuapp.com/player-list?token=${window.application.token}`,
        onSuccess: (data) => {
            
            console.log(data);
            console.log(data.list.length);

            window.application.listName = data.list[0].login;

            for (let i = 0; i < data.list.length; i++) {
                console.log(data.list[i].login);

                const listName = document.createElement('div');
                listName.className = 'list_name';
                listName.textContent = data.list[i].login;

                nameContainer.appendChild(listName);
                
            };
            container.appendChild(nameContainer);
            container.appendChild(button);
            container.appendChild(img);
        },
    });
    
    app.appendChild(upperBox);
    app.appendChild(container);

    button.addEventListener('click', () => {

        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/start?token=${window.application.token}`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["player-status"].game.id,'- id');
                window.application.id = data["player-status"].game.id;

                renderWaiting() 
            },
        });
    }); 
};

function renderWaiting() {
    app.textContent = '';
    
    request({
        method: 'GET',
        url: `https://skypro-rock-scissors-paper.herokuapp.com/game-status?token=${window.application.token}&id=${window.application.id}`,
        onSuccess: (data) => {
            console.log(data);
            console.log(data["game-status"].status);

            app.textContent = '';

            const container = document.createElement('div');
            container.className = 'container center';

            const upperBox = document.createElement('div');
            upperBox.className = 'upper_box';

            const title = document.createElement('h1');
            title.className = 'title_game';
            title.textContent = 'Игра';

            const subtitle = document.createElement('p');
            subtitle.className = 'subtitle';
            subtitle.textContent = `Вы против ${window.application.listName}`;

            const img = document.createElement('img');
            img.className = 'img_waiting';
            img.src = './img/waiting_timer.svg';

            const waitingFooter = document.createElement('p');
            waitingFooter.className = 'waiting_footer';
            waitingFooter.textContent = 'Ожидаем подключение соперника...';

            container.appendChild(title);
            container.appendChild(subtitle);
            container.appendChild(img);
            container.appendChild(waitingFooter);

            app.appendChild(upperBox);
            app.appendChild(container);

        },
    });

    const interval = setInterval(() => {

        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/game-status?token=${window.application.token}&id=${window.application.id}`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["game-status"].status);

                if (data["game-status"].status === 'waiting-for-your-move') {
                    renderGame();
                    clearInterval(interval);   
                };        
            },
        });
    },500)
};

function renderGame() {
    app.textContent = '';

    const container = document.createElement('div');
    container.className = 'container center';

    const upperBox = document.createElement('div');
    upperBox.className = 'upper_box';

    const title = document.createElement('h1');
    title.className = 'title_game';
    title.textContent = 'Игра';

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = `Вы против ${window.application.listName}`;

    const boxRock = document.createElement('div');
    boxRock.className = 'answer_box';

    const imgRock = document.createElement('img');
    imgRock.className = 'img_rock';
    imgRock.src = './img/rock.svg';

    const buttonRock = document.createElement('button');
    buttonRock.className = 'play_button';
    buttonRock.textContent = 'Камень'; 
    
    const boxScissors = document.createElement('div');
    boxScissors.className = 'answer_box';

    const imgScissors = document.createElement('img');
    imgScissors.className = 'img_scissors';
    imgScissors.src = './img/scissors.svg';

    const buttonScissors = document.createElement('button');
    buttonScissors.className = 'play_button';
    buttonScissors.textContent = 'Ножницы';

    const boxPaper = document.createElement('div');
    boxPaper.className = 'answer_box';

    const imgPaper = document.createElement('img');
    imgPaper.className = 'img_paper';
    imgPaper.src = './img/paper.svg';

    const buttonPaper = document.createElement('button');
    buttonPaper.className = 'play_button';
    buttonPaper.textContent = 'Бумага';

    boxRock.appendChild(imgRock);
    boxRock.appendChild(buttonRock);
    boxScissors.appendChild(imgScissors);
    boxScissors.appendChild(buttonScissors);
    boxPaper.appendChild(imgPaper);
    boxPaper.appendChild(buttonPaper);

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(boxRock);
    container.appendChild(boxScissors);
    container.appendChild(boxPaper);

    app.appendChild(upperBox);
    app.appendChild(container);

    buttonRock.onclick = () => {
        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/play?token=${window.application.token}&id=${window.application.id}&move=rock`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["game-status"].status);
                renderWaitingMove();
            },
        });
    };

    buttonScissors.onclick = () => {
        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/play?token=${window.application.token}&id=${window.application.id}&move=scissors`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["game-status"].status);
                renderWaitingMove();
            },
        });
    };

    buttonPaper.onclick = () => {
        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/play?token=${window.application.token}&id=${window.application.id}&move=paper`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["game-status"].status);
                renderWaitingMove();
            },
        });
    };
    
};

function renderWaitingMove() {
    app.textContent = '';

    const container = document.createElement('div');
    container.className = 'container center';

    const upperBox = document.createElement('div');
    upperBox.className = 'upper_box';

    const title = document.createElement('h1');
    title.className = 'title_game';
    title.textContent = 'Игра';

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = `Вы против ${window.application.listName}`;

    const img = document.createElement('img');
    img.className = 'img_waiting';
    img.src = './img/waiting_timer.svg';

    const waitingFooter = document.createElement('p');
    waitingFooter.className = 'waiting_move_footer';
    waitingFooter.textContent = 'Ожидаем ход соперника...';

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(img);
    container.appendChild(waitingFooter);

    app.appendChild(upperBox);
    app.appendChild(container);

    let i = 0;

    const statusInterval = setInterval(() => {
        i++
        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/game-status?token=${window.application.token}&id=${window.application.id}`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["game-status"].status);
                if (data["game-status"].status === 'win') {
                    renderWin();
                    clearInterval(statusInterval);
                };
            
                if (data["game-status"].status === 'lose') {
                    renderLose();
                    clearInterval(statusInterval);
                };

                if (i === 10) {
                    alert('Ничья, сыграйте еще раз для закрепления победителя');
                    renderGame();
                };
            },
        })

    },1000);
};

function renderWin() {
    app.textContent = '';

    const container = document.createElement('div');
    container.className = 'container center';

    const upperBox = document.createElement('div');
    upperBox.className = 'upper_box';

    const title = document.createElement('h1');
    title.className = 'title_game';
    title.textContent = 'Игра';

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = `Вы против ${window.application.listName}`;

    const resultBox = document.createElement('div');
    resultBox.className = 'result_box';

    const img = document.createElement('img');
    img.className = 'lasts_img';
    img.src = './img/win.svg';

    const buttonNextPlay = document.createElement('button');
    buttonNextPlay.className = 'result_button mb';
    buttonNextPlay.textContent = 'Играть еще';

    const buttonLobby = document.createElement('button');
    buttonLobby.className = 'result_button';
    buttonLobby.textContent = 'В лобби';

    resultBox.appendChild(img);
    resultBox.appendChild(buttonNextPlay);
    resultBox.appendChild(buttonLobby);

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(resultBox);

    app.appendChild(upperBox);
    app.appendChild(container);

    buttonNextPlay.onclick = () => {
        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/start?token=${window.application.token}`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["player-status"].game.id,'- id');

                window.application.id = data["player-status"].game.id;

                renderWaiting() 

            },
        });
    };

    buttonLobby.onclick = () => {
        renderLobby();
    };
};

function renderLose() {
    app.textContent = '';

    const container = document.createElement('div');
    container.className = 'container center';

    const upperBox = document.createElement('div');
    upperBox.className = 'upper_box';

    const title = document.createElement('h1');
    title.className = 'title_game';
    title.textContent = 'Игра';

    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = `Вы против ${window.application.listName}`;

    const resultBox = document.createElement('div');
    resultBox.className = 'result_box';

    const img = document.createElement('img');
    img.className = 'lasts_img';
    img.src = './img/lose.svg';

    const buttonNextPlay = document.createElement('button');
    buttonNextPlay.className = 'result_button mb';
    buttonNextPlay.textContent = 'Играть еще';

    const buttonLobby = document.createElement('button');
    buttonLobby.className = 'result_button';
    buttonLobby.textContent = 'В лобби';

    resultBox.appendChild(img);
    resultBox.appendChild(buttonNextPlay);
    resultBox.appendChild(buttonLobby);

    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(resultBox);

    app.appendChild(upperBox);
    app.appendChild(container);

    buttonNextPlay.onclick = () => {
        request({
            method: 'GET',
            url: `https://skypro-rock-scissors-paper.herokuapp.com/start?token=${window.application.token}`,
            onSuccess: (data) => {
                console.log(data);
                console.log(data["player-status"].game.id,'- id');

                window.application.id = data["player-status"].game.id;

                renderWaiting() 

            },
        });
    };

    buttonLobby.onclick = () => {
        renderLobby();
    };
};




