# 📚 Revision Timer - Professional Pomodoro Study App

A modern, feature-rich Pomodoro timer built with React and TypeScript. Break your study sessions into 25-minute sprints with customizable 5-minute or 10-minute breaks, track your progress, and stay focused.

## ✨ Features

### Core Functionality
- **25-minute study sprints** (customizable: 1-60 minutes)
- **Flexible break durations**: 5-minute or 10-minute short breaks
- **15-minute long breaks** after 4 sessions (customizable)
- **Automatic phase transitions** between study → break → study → long break
- **Pause/Resume capability** without losing progress
- **Session counter** with completion tracking

### User Experience
- **Large timer display** in MM:SS format
- **Color-coded phases**: Red/Orange (study), Blue/Cyan (breaks), Green/Emerald (long breaks)
- **Real-time progress bar** visualization
- **Motivational messages** for encouragement
- **Smooth animations** and transitions

### Technical Excellence
- **Drift-corrected timer** - Accurate to ±1 second per hour
- **Background handling** - Continues counting when tab is hidden
- **State persistence** - Resumes where you left off
- **Keyboard shortcuts**: Space (play/pause), R (reset), S (skip), Ctrl+, (settings)

### Notifications & Alerts
- **Sound notifications** with different tones
- **Desktop notifications** with custom messages

### Statistics & Analytics
- **Daily session tracking** with timestamps
- **Weekly progress charts** showing study minutes
- **CSV export** for all session data

## 🚀 Quick Start

### Clone & Install
```bash
git clone https://github.com/AlexIbanescu/revsion-timer.git
cd revsion-timer
npm install
```

### Run
```bash
npm start
```

Opens at `http://localhost:3000` 🎉

## 📖 Usage
- Click **Play** to start a 25-minute study session
- Adjust settings with the ⚙️ button
- View statistics with the 📊 button
- Use keyboard shortcuts for quick access

## 🛠️ Technologies
- React 18 & TypeScript
- Tailwind CSS for styling
- Recharts for statistics
- Lucide React for icons
- localStorage for data persistence

## 📱 Browser Support
Chrome, Firefox, Safari, Edge (latest versions)

## 🔒 Privacy
- 100% offline
- No data collection
- All data stays local
- No tracking or ads

## 📝 License
MIT License - Open source and free to use

---

**Happy studying! 📚**