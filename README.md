# Anonymous Chat Application

A real-time chat application that allows users to communicate anonymously or with their identity. Built with modern web technologies for a seamless chatting experience.

https://github.com/user-attachments/assets/7cea0ba7-9537-4b82-87d1-97cd79b0e5a6

## Features

- **Real-time messaging** - Instant message delivery using WebSocket connections
- **Anonymous mode** - Toggle between anonymous and identified messaging
- **Group chat** - Chat with multiple users in a shared room
- **Responsive design** - Works perfectly on desktop and mobile devices
- **User authentication** - Secure login and registration system
- **Modern UI** - Clean and intuitive interface inspired by popular messaging apps

## Screenshots

The app features a modern chat interface with:
- Group profile picture with online status
- Anonymous toggle button in the header
- Clean message bubbles without avatars
- Real-time message notifications
- Mobile-responsive design

## Tech Stack

### Frontend
- **React.js** - User interface framework
- **Vite** - Build tool and development server
- **CSS3** - Styling with modern flexbox layouts
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## Project Structure

```
Anonymous Chat/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AnonymousToggle.jsx
│   │   ├── assets/         # Images and icons
│   │   │   ├── Group Picture.jpg
│   │   │   ├── anonyme icon.png
│   │   │   └── Arrow.png
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/                # Node.js backend server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── server.js          # Main server file
│   └── package.json
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Join Chat**: Enter the "Fun Friday Group" chat room
3. **Send Messages**: Type your message and click the send button
4. **Toggle Anonymous**: Click the anonymous icon to switch between anonymous and identified messaging
5. **Real-time Chat**: Messages appear instantly for all connected users

## Key Features Explained

### Anonymous Mode
- Click the anonymous icon in the header to toggle anonymous mode
- When active, the icon turns maroon and your messages appear as "Anonymous"
- A notification appears when toggling anonymous mode

### Message System
- Clean bubble-style messages without avatars
- Different colors for sent and received messages
- Timestamps for all messages
- Word wrapping for long messages

### Responsive Design
- Optimized for mobile devices
- Touch-friendly interface
- Adaptive layouts for different screen sizes

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Messages
- `GET /api/messages/:roomId` - Get chat history
- `POST /api/messages` - Send a message (via WebSocket)

### WebSocket Events
- `join-room` - Join a chat room
- `send-message` - Send a message
- `message` - Receive a message
- `user-joined` - User joined notification
- `user-left` - User left notification

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Development Notes

- The app uses Socket.io for real-time communication
- JWT tokens are used for user authentication
- Anonymous messages are handled client-side
- The UI is designed to be mobile-first responsive

## Future Enhancements

- [ ] File sharing capabilities
- [ ] Emoji reactions
- [ ] Voice messages
- [ ] Multiple chat rooms
- [ ] User profiles
- [ ] Message encryption
- [ ] Push notifications

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for anonymous communication**
