# ☕ Seoul Sip Café — Virtual Korean Café  

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel&logoColor=white)](https://seoul-sip-cafe.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Backend%20on-Render-46E3B7?logo=render&logoColor=white)]  
![Made with Flask](https://img.shields.io/badge/Backend-Flask-000?logo=flask&logoColor=white)
![Made with Python](https://img.shields.io/badge/Language-Python-3776AB?logo=python&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-HTML%2C%20CSS%2C%20JS-orange)

---

## **Live Website**
- **Frontend (Vercel):** [https://seoul-sip-cafe.vercel.app/](https://seoul-sip-cafe.vercel.app/)  

---

## **Preview**
> Add screenshots or GIFs of your café interface here.  
Example:
![Seoul Sip Café Screenshot](images/preview.png)

---

## **About the Project**
**Seoul Sip Café** brings the **vibe of a cozy Korean café** right into your browser.  
Key highlights:
- Customizable **ambient sounds** (rain, chatter, cups, music).
- **English ↔ Korean translation** (powered by Deep Translator API).
- **Spotify playlist integration** for personal music.
- **Focus Mode** and **To-Do list** to enhance productivity.

---

## **Tech Stack**
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Python (Flask) with [Deep Translator](https://pypi.org/project/deep-translator/)  
- **Hosting:**  
  - Frontend on [Vercel](https://vercel.com/)  
  - Backend on [Render](https://render.com/)  

---

## **Features**
- **Ambient Sound System:**  
  Adjust volume & stereo panning for rain, café, and music.
- **Light/Dark Mode:**  
  Toggle themes to match your mood.
- **To-Do List:**  
  Save tasks in **localStorage**.
- **Translator:**  
  Translate text between **English and Korean** seamlessly.

---

## **Project Setup**
### **Frontend**
1. Clone this repository:
   ```bash
   git clone https://github.com/sarabiji/virtual-korean-cafe.git
   cd virtual-korean-cafe
   ```
2. Open `index.html` in your browser.

### **Backend (Flask)**
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the backend server:
   ```bash
   python google_proxy.py
   ```
3. Ensure your **`script.js`** points to the backend endpoint:
   ```javascript
   const TRANSLATE_API = "https://your-backend-link.onrender.com/translate";
   ```

---

## 📜 **License**
This project is open-source. Feel free to **fork and customize**.

---

**Developed by Sara**  
> Inspired by Korean café culture ✨
