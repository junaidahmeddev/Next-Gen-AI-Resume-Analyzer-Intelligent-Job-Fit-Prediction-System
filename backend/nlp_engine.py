import nltk
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# --- Setup (Fixed for Render Deployment) ---
try:
    # Render par punkt_tab ka hona zaroori hai naye NLTK versions ke liye
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('punkt_tab')
    nltk.download('stopwords')
    nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()

# --- Core Knowledge Base ---
TECHNICAL_SKILLS_DB = {
    'python', 'java', 'c++', 'c#', 'javascript', 'sql', 'react', 'node.js', 
    'web design', 'design thinking', 'wireframe creation', 'front end coding', 'backend tech',
    'ad-serving platform', 'classroom management', 'database administration',
    'problem-solving', 'computer literacy', 'project management tools', 'communication'
}

# Words to ignore from Gaps
IGNORE_WORDS = {
    'professional', 'experience', 'senior', 'lead', 'manager', 'year', 'work', 
    'excellent', 'strong', 'mandatory', 'seeking', 'qualified', 'plus'
}

def clean_text(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\+\#\s]', ' ', text)
    tokens = word_tokenize(text)
    stop = set(stopwords.words('english'))
    return [lemmatizer.lemmatize(t) for t in tokens if t not in stop]

def extract_skills(text):
    text_lower = text.lower()
    return {skill for skill in TECHNICAL_SKILLS_DB if skill in text_lower}

def calculate_match_score(resume_text, jd_text):
    if not resume_text or not jd_text: return 0.0

    # 1. Cleaning
    r_cleaned = " ".join(clean_text(resume_text))
    j_cleaned = " ".join(clean_text(jd_text))
    
    # 2. Cosine Similarity (30% weight)
    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    try:
        matrix = vectorizer.fit_transform([r_cleaned, j_cleaned])
        cosine_sim = cosine_similarity(matrix[0:1], matrix[1:2])[0][0] * 100
        
        # 3. Key Skill Overlap (70% weight)
        r_skills = extract_skills(resume_text)
        j_skills = extract_skills(jd_text)
        
        skill_score = 0
        if j_skills:
            match_count = len(r_skills.intersection(j_skills))
            skill_score = (match_count / len(j_skills)) * 100
        
        final_score = (cosine_sim * 0.3) + (skill_score * 0.7)
        return round(min(final_score, 100.0), 2)
    except Exception as e:
        print(f"Error in calculation: {e}")
        return 0.0

def identify_missing_skills(resume_text, jd_text):
    r_skills = extract_skills(resume_text)
    j_skills = extract_skills(jd_text)
    
    missing = j_skills - r_skills - IGNORE_WORDS
    present = j_skills.intersection(r_skills)
    
    return list(missing), list(present)