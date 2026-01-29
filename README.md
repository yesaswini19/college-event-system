# 🎓 College Event Management System
A professional, full-stack web application designed to streamline the process of planning, organizing, and registering for college events. This project moves away from manual record-keeping to a centralized, real-time digital platform.

## 🚀 Live Project Links
- **Frontend (Live Site):** [View Demo](https://college-event-system-jade.vercel.app/)
- **Backend API:** [Railway API Endpoint](https://college-event-system-h9i6.vercel.app)
- 
## 🛠️ Tech Stack
### Frontend
- **HTML5 & CSS3**: Responsive UI design.
- **JavaScript (Vanilla)**: For dynamic DOM manipulation and asynchronous API calls.
- **Deployment**: Hosted on **Vercel** for high-speed content delivery (CDN).

### Backend
- **Node.js**: Asynchronous runtime environment.
- **Express.js**: Web framework for building the RESTful API.
- **MySQL**: Relational database for persistent data storage.
- **Deployment**: Hosted on **Railway** with a dedicated cloud server.

## ✨ Key Features
- **Real-time Event Browsing**: Students can view upcoming events directly from the live database.
- **Student Registration**: Securely add student details and event participation records.
- **Cloud Database Persistence**: Data is stored in a remote MySQL instance, ensuring it is never lost when the app restarts.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

## 🌐 Architecture Overview
The application follows a **Decoupled Architecture**:
1. The **Frontend** is deployed on Vercel and communicates with the server via the Fetch API.
2. The **Backend API** (Node.js/Express) resides on Railway and handles the business logic.
3. The **Database** (MySQL) is a managed cloud service on Railway, linked to the backend via secure environment variables.



1. **Clone the repo:**
   ```bash
   git clone [https://github.com/](https://github.com/)[YOUR-USERNAME]/[YOUR-REPO-NAME].git
