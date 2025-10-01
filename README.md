# Aztech
3D Modeling Application
Turn 360° videos into realistic, 3D-printable models in minutes.


## Overview
Aztech 3D Model Generator simplifies the process of creating 3D models from real-world objects using just a video. No more tedious photogrammetry setups or expensive 3D scanners. Simply upload a 360° video, and our backend will process it into a usable, downloadable 3D model.


## Tech Stack

### Frontend
- **React** — JavaScript library for building UI
- **Vite** — Lightning-fast build tool for modern web apps
- **Tailwind CSS** — Utility-first CSS framework
- **JavaScript** — Core frontend scripting language
  
### Backend
- **Flask** — Lightweight Python web framework
  
### Cloud / Database
- **Firebase** — Authentication, storage, and hosting

## Features
- Upload 360° video of an object
- Automatically extract frames and generate 3D models via photogrammetry
- Preview and download 3D models (.obj/.stl)
- User accounts and model gallery (via Firebase)
- (Optional) Share models with other users


## Project Structure
```
project-root/
├── client/ # React + Vite frontend
│ ├── components/ # Reusable UI components
│ └── pages/ # Landing, upload, preview
├── server/ # Flask backend API
│ └── routes/ # API endpoints
└── firebase/ # Firebase functions and config
```


## Getting Started


### Prerequisites
- Node.js + npm
- Python 3.10+
- Firebase CLI (optional for hosting)


### 1. Install Frontend
```bash
cd client
npm install
npm run dev
```


### 2. Run Backend
```bash
cd server
pip install -r requirements.txt
flask run
```


### 3. Firebase Setup (Optional)
```bash
firebase login
firebase init
firebase deploy
```


## Team Aztech
- Jahnavi Panchal — jpanchal7872@sdsu.edu
- Matthew Tran — mtran4477@sdsu.edu
- Santiago Verdugo — sverdugo3119@sdsu.edu


## Future Plans
- Add measurement tools to scale models for 3D printing
- Improve model accuracy with AI-based filters
- Support additional file formats (e.g., GLB)


## 📜 License
MIT License — Free to use and modify.
