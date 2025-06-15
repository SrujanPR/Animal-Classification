import torch
import albumentations as A
from albumentations.pytorch import ToTensorV2
import numpy as np
import cv2

# Device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load TorchScript model
model = torch.jit.load("efficientnetv2_model2_inference.pt", map_location=device)
model.eval()

# Class labels
class_names = ['cheetah', 'leopard', 'tiger']

# Inference transformation
transform = A.Compose([
    A.Resize(224, 224),
    A.Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225)),
    ToTensorV2()
])

def predict(image_path):
    # Read image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    augmented = transform(image=image)['image']
    input_tensor = augmented.unsqueeze(0).to(device)

    # Inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.nn.functional.softmax(outputs[0], dim=0)
        confidence, pred_idx = torch.max(probs, 0)

    predicted_label = class_names[pred_idx.item()]
    confidence_score = confidence.item() * 100

    return predicted_label, confidence_score
