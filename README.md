# 🧠 Brainly - Second Brain App

Brainly is a **Second Brain** app that helps users collect and organize content from various sources like **Twitter, YouTube, Google Docs**, and more—all in one centralized place.  
This project is part of **100xDevs Cohort 3**, built under the guidance of **Harkirat Singh**.

🚀 **Live Demo**: [Brainly App](https://brainlybybeast.vercel.app)  
💪 **GitHub Repository**: [Brainly on GitHub](https://github.com/BeastxD7/brainly)  

---

## 🚀 Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT (JSON Web Token)  

---

## 📌 Features

✅ User Authentication (JWT-based)  
✅ Add content from Twitter & YouTube  
✅ MongoDB for data storage  
✅ Secure backend with Node.js & Express  
✅ Responsive UI built with React & Tailwind  
✅ Share feature implemented  

🔠 **Production Ready!**  

---

## 📂 Folder Structure
```
Brainly/
├── backend/                # Express.js backend
│   ├── routes/             # API routes (auth, content, share)
│   ├── middleware/         # JWT authentication middleware
│   ├── models/             # Mongoose models
│   ├── index.ts            # Express server entry point
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/          # Dashboard, Landing, Auth Pages
│   │   ├── components/     # Reusable UI components
│   │   ├── utils/          # API requests & validation
│   │   ├── App.tsx         # Main app component
│
├── .env                    # Environment variables
├── package.json            # Dependencies & scripts
├── README.md               # Project documentation
```

---

## 🛠️ Installation & Setup

1️⃣ **Clone the repository**  
```sh
git clone https://github.com/BeastxD7/brainly.git
cd brainly
```

2️⃣ **Set up the backend**  
```sh
cd backend
npm install
```
- Configure `.env` with your MongoDB URL & JWT secret.  
- Start the backend server:  
```sh
npm run dev
```

3️⃣ **Set up the frontend**  
```sh
cd ../frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables
Create a `.env` file in the backend folder with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
VITE_API_URL="http://localhost:3000/api"
```

---

## 📜 API Endpoints
### **Authentication**
| Method | Endpoint      | Description        |
|--------|-------------|--------------------|
| POST   | /api/signup  | Register new user |
| POST   | /api/signin  | Authenticate user |

### **Content**
| Method | Endpoint        | Description       |
|--------|----------------|-------------------|
| GET    | /api/content    | Get all content  |
| POST   | /api/content    | Add new content  |
| DELETE | /api/content/:id | Delete content  |

### **Sharing**
| Method | Endpoint       | Description         |
|--------|---------------|---------------------|
| POST   | /api/share     | Share content      |
| GET    | /api/share/:id | Get shared content |

---

## 🎯 Future Enhancements
🔹 AI-powered search through saved content  
🔹 More social media integrations (Google Docs, Medium, etc.)  
🔹 Improved UI & user experience  

---

## 🙌 Contributing
Feel free to contribute! Open an issue or submit a PR.

---

## 📄 License
This project is licensed under the MIT License.

---

Made with ❤️ by Beast

# Brainly
