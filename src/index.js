import './style.css';
// JS

const input = document.querySelector('#search-input');
let timerId;
let controller;
input.addEventListener('input', function(event) {
    clearTimeout(timerId);
    controller?.abort();
    console.log('Поиск:', event.target.value)
    const searchValue = event.target.value;
    if (searchValue === '') {
        console.log('Поле пустое!');
        autoList.innerHTML = '';
        return;
    }
    timerId = setTimeout(() => {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchValue)}`;
    controller = new AbortController();
    fetch(url, {
        signal: controller.signal
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка запроса GitHub');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (!data.items) {
                return;
            };
            const searchResults = data.items.slice(0, 5);
            autoList.innerHTML = '';
            searchResults.forEach((item, index) => {
                console.log(index, item.name);
                const li = document.createElement('li');
                li.textContent = item.name;
                autoList.appendChild(li);
                li.addEventListener('click', function(event) {
                    console.log(item.name);
                    controller?.abort();
                    input.value = '';
                    autoList.innerHTML = '';
                    const repositoryItem = document.createElement('li');
                    repositoryItem.textContent = `Name: ${item.name}\n Author: ${item.owner.login} \nStars: ${item.stargazers_count}`;
                    repositoryList.appendChild(repositoryItem);
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'X';
                    repositoryItem.appendChild(deleteButton);
                        deleteButton.addEventListener ('click', function(event) {
                            repositoryItem.remove();
                            repositories = repositories.filter(repo => repo.id !== item.id);
                            localStorage.setItem('repositories', JSON.stringify(repositories));
                        });
                    repositories.push(item);
                    localStorage.setItem('repositories', JSON.stringify(repositories));
                });
            });
        })
        .catch(error => {
            if (error.name === 'AbortError') {
                return;
            }
            console.error(error);
        })
    }, 500);
});

const autoList = document.querySelector('#autocomplete-list');
const repositoryList = document.querySelector('#repositories-list');
const savedRepositories = localStorage.getItem('repositories');
let repositories = JSON.parse(savedRepositories) || [];
repositories.forEach((item) => {
    const repositoryItem = document.createElement('li');
    repositoryItem.textContent = `Name: ${item.name}\n Author: ${item.owner.login} \nStars: ${item.stargazers_count}`;
    repositoryList.appendChild(repositoryItem);
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'X';
    repositoryItem.appendChild(deleteButton);
    deleteButton.addEventListener('click', function(event) {
        repositoryItem.remove();
        repositories = repositories.filter(repo => repo.id !== item.id);
        localStorage.setItem('repositories', JSON.stringify(repositories));
    });
});