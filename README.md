# MangaDex Reader

This is a repository for a manga reading application using the MangaDex API. The application allows you to search, view details, and read manga chapters from MangaDex through a simple and user-friendly interface.

---

## 🚀 Features

- **Manga Search**: Easily search for your favorite manga from MangaDex.
- **Read Manga Chapters**: Display manga chapters with images from MangaDex.
- **View Detailed Information**: Includes descriptions, authors, genres, statuses, and more.
- **Multi-language Support**: Filter manga by your preferred language (e.g., English, Vietnamese, etc.).
- **Responsive Design**: Fully compatible with both desktop and mobile devices.

---

## 🛠️ System Requirements

- **Node.js** (version >= 14)
- **npm** or **yarn**
- Internet connection to access the MangaDex API

---

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mng721/Mangadex-reactjs
   cd Mangadex-reacjs
   ```

2. **Install dependencies** Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Config your enviroment**

- Create new .env file in the root directory and add nextAuth endpoint
- Example .env file:

  ```env
   AUTH_SECRET="YOUR_NEXT_AUTH_SECRET"

   # Next Auth Discord Provider
   AUTH_DISCORD_ID="YOUR_DISCORD_AUTH_ID"
   AUTH_DISCORD_SECRET="YOUR_DISCORD_AUTH_SECRET"

   # Drizzle
   DATABASE_URL="YOUR_DATABASE_URL"

  ```

4. **Run the application** Using npm:

   ```bash
   npm run dev
   ```

   Using yarn

   ```bash
   yarn run dev
   ```

   Open your browser and navigate to: http://localhost:3000
