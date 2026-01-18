# 🚀 AI Resume Analyzer & Intelligent Job-Fit Predictor

An NLP-powered recruitment tool built with **React** and **Flask**. This system streamlines the hiring process by calculating match scores between PDF/DOCX resumes and job descriptions using advanced machine learning techniques.



## 🌟 Key Features
- **Automated Text Extraction:** Seamlessly extracts content from PDF and DOCX formats.
- **Smart Matching:** Uses **TF-IDF Vectorization** and **Cosine Similarity** to provide an accurate match percentage.
- **Skill Gap Analysis:** Identifies missing keywords and suggests improvements.
- **Real-time Verdict:** Generates instant hiring recommendations based on industry standards.
- **Mobile Responsive:** Fully optimized UI built with React and custom CSS.

## 🛠️ Tech Stack
- **Frontend:** React.js (Hooks, Modern UI/UX)
- **Backend:** Flask (Python)
- **AI/ML:** NLTK, Scikit-learn (TF-IDF, Cosine Similarity)
- **Deployment:** Vercel / Render

## 📊 How it Works
1. **Preprocessing:** The system cleans the text (removes stop words, punctuation).
2. **Vectorization:** Text is converted into numerical vectors using TF-IDF.
3. **Similarity Calculation:** The "distance" between the Resume and Job Description vectors is measured.
4. **Analysis:** The tool highlights which skills are missing compared to the JD.

## 🚀 Getting Started
1. Clone the repo: `git clone https://github.com/junaidahmeddev/Next-Gen-AI-Resume-Analyzer.git`
2. Install backend dependencies: `pip install -r requirements.txt`
3. Install frontend dependencies: `npm install`
4. Run the app: `npm start` & `python app.py`

---
⭐ **Star this repository if you find it useful!**
Developed by [Junaid Ahmed](https://github.com/junaidahmeddev)
