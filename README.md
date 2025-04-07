# 🧠 Interactive Mental Health Assessment Tool

A web-based application for self-screening anxiety and depression using validated psychological questionnaires — GAD-7 and PHQ-9. Designed with a clean, calming interface to foster a safe user experience.

## 🌟 Features

- ✅ Interactive GAD-7 (Anxiety) and PHQ-9 (Depression) quizzes
- 📊 Real-time scoring with severity interpretation
- 💾 LocalStorage support for saving past assessments
- 📝 Optional journaling after each quiz
- 📂 View individual quiz history (with optional deletion)
- 📈 Summary dashboard with chart comparisons, filters, and insights
- 🌓 Light/Dark mode toggle with soft gradients and wave animations
- ♿ Accessibility features: ARIA labels, skip links, and keyboard navigation


## 🛠️ Tech Stack

- React (JavaScript)
- HTML/CSS (with animations and gradients)
- Recharts (for visualizing score history)
- LocalStorage (for persistence)

## 📁 Folder Structure

```
interactive-mental-health-tool/
├── public/
│   └── index.html
├── src/
│   ├── assets/                # Wave SVGs for both themes
│   ├── components/            # Theme toggle
│   ├── data/                  # gad7.json and phq9.json
│   ├── pages/                 # Individual page views
│   │   ├── GAD7Quiz.js
│   │   ├── PHQ9Quiz.js
│   │   ├── Summary.js
│   │   ├── Results.js
│   │   └── Landing.js
│   ├── App.js
│   ├── App.css
│   ├── Summary.css
│   ├── animations.css
│   └── index.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```



## 🚀 Getting Started

Clone and install dependencies:

```
git clone https://github.com/jorgemar723/interactive-mental-health-tool.git
cd interactive-mental-health-tool
npm install
npm start
```


The app will run at: http://localhost:3000

## 📦 To Build for Production
```
npm run build
```

## 🔒 Privacy Notice
This app uses localStorage to store data. All quiz results and journal entries remain on your device and are not shared externally.
## 📄 License
MIT — feel free to use, fork, or modify with credit!
