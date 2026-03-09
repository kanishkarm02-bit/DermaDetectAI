# DermaDetect AI - Hackathon Project Guide

## 1. Project Concept
**DermaDetect AI** is a web application that democratizes access to preliminary skin health analysis. Users upload a photo of a skin concern (mole, rash, acne), and the AI analyzes visual patterns to suggest potential conditions, assess urgency (Risk Level), and provide actionable next steps.

**How it works:**
1. User opens the app and accepts a medical disclaimer.
2. User uploads a photo or takes a selfie of the skin condition.
3. The image is processed by a multimodal AI model (Gemini 2.5 Flash).
4. The app displays a structured analysis: Likely Condition, Risk Level, Visual Evidence, and Recommendation.
5. (Optional Hackathon Feature) A "Find a Doctor" button links to local dermatologists.

## 2. Best AI Approach (Hackathon Strategy)
For a 24-36 hour hackathon, **do not train a model from scratch**. It takes too long to find clean data, train, and tune.
**Winner Strategy:** Use a **Pre-trained Multimodal LLM** (like Google Gemini 2.5 Flash or GPT-4o).
*   **Why?** These models have already "seen" millions of medical images during training. They can explain *why* they think it's a certain condition (Explainable AI), which judges love.
*   **Fallback:** If you must train, use **Transfer Learning** with a ResNet50 or EfficientNet model pre-trained on ImageNet, and fine-tune it on the HAM10000 dataset.

## 3. System Architecture
```mermaid
graph LR
    A[User Frontend (React/Vite)] -- Upload Image --> B[AI Service (Gemini API)]
    B -- JSON Response --> A
    A -- Display Results --> C[User Screen]
```
*   **Client-Side Logic:** Handles image compression and API calls.
*   **No Backend (MVP):** Call the AI API directly from the client (securely via proxy in this environment) to save time.

## 4. Recommended Tech Stack
*   **Frontend:** React + TypeScript + Tailwind CSS (Fast development, looks professional).
*   **AI Model:** Google Gemini 2.5 Flash Image (Fast, accurate, free tier available).
*   **Hosting:** Vercel or Netlify (Zero-config deployment).
*   **Libraries:** `react-dropzone` (uploads), `framer-motion` (animations), `lucide-react` (icons).

## 5. Example Datasets (If training custom model)
*   **HAM10000:** Large collection of multi-source dermatoscopic images of common pigmented skin lesions.
*   **ISIC Archive:** International Skin Imaging Collaboration (The gold standard).
*   **Dermnet NZ:** High-quality clinical images (requires scraping/permission for commercial use, usually okay for hackathons).

## 6. Step-by-Step Build Instructions
1.  **Setup:** `npm create vite@latest` (React/TS). Install Tailwind.
2.  **UI Shell:** Build a clean, medical-themed layout (Teal/White).
3.  **Camera/Upload:** Implement `react-dropzone` to handle image input.
4.  **AI Integration:** Use `@google/genai` SDK. Create a prompt that enforces JSON output.
5.  **Display:** Create a card component to show the result with color-coded risk levels (Green/Yellow/Red).
6.  **Polish:** Add a loading skeleton and error handling.

## 7. Example Python Code (For Custom Model Approach)
If you choose the "Hard Mode" (Training a custom model), here is a PyTorch snippet:

```python
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image

# 1. Load a pre-trained ResNet50
model = models.resnet50(pretrained=True)
# Replace the last layer for our number of classes (e.g., 7 skin types)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 7) 

# 2. Preprocess the image
def predict_skin_condition(image_path):
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    
    img = Image.open(image_path)
    img_t = transform(img)
    batch_t = torch.unsqueeze(img_t, 0)
    
    model.eval()
    out = model(batch_t)
    
    # Get top prediction
    _, index = torch.max(out, 1)
    return index.item() # Returns class ID
```

## 8. Ideas to Stand Out
*   **Explainability:** Don't just say "Melanoma". Say "Detected irregular borders and color variation, which are signs of Melanoma." (Gemini does this natively).
*   **History Tracking:** "Save" the result to local storage so the user can see if the mole changes over time.
*   **Disclaimer Modal:** Shows you care about ethics. "This is not a medical diagnosis."

## 9. Demo Suggestions
*   **Live Demo:** Take a picture of a volunteer's arm (or a printed photo of a rash) live on stage.
*   **The "Hook":** Start with a story. "1 in 5 Americans will develop skin cancer. Early detection saves lives."
*   **Visuals:** Show the AI "scanning" the image (fake a scanning animation while waiting for the API).
