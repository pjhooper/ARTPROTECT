# ArtProtect

## Description
ArtProtect is a web application designed to protect and showcase art. The backend is built using Node.js and Express, and it interacts with a MongoDB database.

## Project Structure
```
Setup _ Resource_ Files/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── Routes/
│   │   └── auth.js
│   ├── app.js
│   └── .env
├── public/
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── gallery.html
│   ├── blog.html
│   ├── contact.html
│   ├── ArtProtect.html
│   ├── 2.style.css
│   └── Images/
│       ├── FALLING.png
│       ├── dfu.PNG
│       ├── PJ Hooper - LiveRightRe.png
│       ├── contact-img.jpg
│       └── hero-bg.jpg
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/ArtProtect.git
   cd ArtProtect
   ```

2. Navigate to the project directory:
   ```sh
   cd "Setup _ Resource_ Files"
   ```

3. Install the dependencies:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```dotenv
MONGODB_URI=mongodb+srv://ARTPROTECT:zGT3PleX70KbQvvL@artprotect.n7wrafp.mongodb.net/my_database?retryWrites=true&w=majority&appName=ARTPROTECT
JWT_SECRET=af29cb23d6c89979de254aa8aa95d5eed6f0259bc8c76f85d60a4499f516617d779ce0e1148130bf4b533202043fada1cf5e22f99e19656107c89e4e5a44da5bdbf0120b54cfdd5acc13c3481c9957644c82dff759c3521736c3c6cda247ce1a1036ad2327f2a8df8133ffbb048144b19eec448c3d7a74af3bb083f047b74f942d385f4fa937511c9ad11f31bf801d493d4fea33994d21ad4e3d9ac60f3919de04502419e2a83fdae47ff90a962c6c228ad483aa1698dbcf8ebe7be6ba0b345bc751b4690bf81e7daf01f214bfc15b2b07638467118f72445df8f18f2036cc56d62e24036f99cd87f148caf7d1d7eabd55c6d10114417af3d35d0eeb0090320b
PORT=3000
```

## Running the Application

1. Start the application:
   ```sh
   npm start
   ```

2. Open your browser and navigate to:
   ```sh
   http://localhost:3000
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login an existing user

## License

This project is licensed under the MIT License.