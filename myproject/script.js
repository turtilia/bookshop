// URL вашего веб-приложения Google Apps Script
const scriptURL = 'https://script.google.com/macros/s/AKfycbzUjZ6NJ1f9IpXBDON0qpbH3-jq0f87p58KLE3RYDDiGh43PyKcos-Yqm7BLPTGrGlgjw/exec';

// Обработчик отправки формы поиска
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Предотвращаем отправку формы по умолчанию

    const query = document.getElementById('search-input').value.trim(); // Получаем значение из поля поиска
    if (!query) return; // Если поле пустое, ничего не делаем

    // Скрываем элементы начальной страницы
    document.querySelector('.initial-view').classList.add('hidden');
    document.getElementById('back-btn').style.display = 'block'; // Показываем кнопку возврата

    // URL для поиска книг в Google Books API
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`;

    // Выполняем запрос к API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const booksContainer = document.getElementById('book-results');
            booksContainer.innerHTML = ''; // Очищаем предыдущие результаты
            booksContainer.style.display = 'block'; // Показываем список книг

            // Проверяем, есть ли книги в результате поиска
            if (data.totalItems === 0) {
                booksContainer.innerHTML = '<p>Книги не найдены.</p>';
                return;
            }

            // Отображаем книги
            data.items.forEach(item => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book-item');

                // Получаем данные о книге
                const title = item.volumeInfo.title || 'Название недоступно';
                const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Автор не указан';
                const description = item.volumeInfo.description || 'Описание недоступно';
                const thumbnail = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : '';

                // Создаем HTML для одной книги
                bookItem.innerHTML = `
                    <h3>${title}</h3>
                    <p><strong>Автор:</strong> ${authors}</p>
                    <p><strong>Описание:</strong> ${description}</p>
                    ${thumbnail ? `<img src="${thumbnail}" alt="${title}" />` : ''}
                    <button class="buy-btn" data-title="${title}" data-author="${authors}">Купить</button>
                `;
                booksContainer.appendChild(bookItem);
            });

            // Обработчик для кнопок "Купить"
            document.querySelectorAll('.buy-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const bookTitle = this.getAttribute('data-title');
                    const bookAuthor = this.getAttribute('data-author');
                    showBuyForm(bookTitle, bookAuthor);
                });
            });
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
});

// Функция для отображения формы покупки
function showBuyForm(bookTitle, bookAuthor) {
    const buyFormContainer = document.getElementById('buy-form-container');
    document.getElementById('form-title').textContent = `Покупка книги: ${bookTitle}`;
    document.getElementById('form-author').textContent = `Автор: ${bookAuthor}`;
    document.getElementById('book-title').value = bookTitle; // Заполняем скрытое поле названием книги
    document.getElementById('book-author').value = bookAuthor; // Заполняем скрытое поле автором книги
    buyFormContainer.classList.remove('hidden'); // Показываем форму
    buyFormContainer.scrollIntoView({ behavior: 'smooth' });

    // Кнопка закрытия формы
    document.querySelector('.close-btn').addEventListener('click', () => {
        buyFormContainer.classList.add('hidden');
    });
}

// Обработчик для кнопки возврата

