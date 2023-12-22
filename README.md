# Веб-приложение на ReactJs + Node.js (Express.js) + MongoDB

## Описание
Это веб-приложение представляет собой систему с регистрацией, авторизацией, редактированием профиля и просмотром профилей других пользователей.

## Установка и запуск

### Серверная часть

1. Клонируйте репозиторий:
git clone [https://github.com/gremwiz1/partners.git]

2. Перейдите в папку сервера:
cd server

3. Установите зависимости:
npm install

4. Запустите сервер:
npm run start
Сервер запустится на порту 4000.

### Клиентская часть

1. Вернитесь в корневую папку проекта и перейдите в папку клиента:
cd ../client

2. Установите зависимости:
npm install

3. Запустите приложение:
npm run start
Приложение будет доступно на порту 3000.

## Маршруты приложения

### Главная страница (`/`)
- **Форма регистрации:** Поля – имя, email, пароль, дата рождения, пол, фото профиля.
- **Форма авторизации.**

### Профиль (`/account`)
- **Форма редактирования профиля:** Поля – имя, пароль, фото профиля, дата рождения, пол.

### Аккаунты (`/people`)
- **Отображение карточек пользователей:** Показывает список всех пользователей, кроме текущего. Карточка пользователя содержит: фото профиля, имя, возраст.
