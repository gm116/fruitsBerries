def point_in_polygon(x, y, polygon):
    inside = False
    n = len(polygon)
    p1x, p1y = polygon[0]
    for i in range(n + 1):
        p2x, p2y = polygon[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y + 1e-9) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside


import requests
from django.conf import settings


def is_valid_plant_image(image_path):
    token = settings.HF_API_TOKEN

    with open(image_path, "rb") as f:
        image_data = f.read()

    response = requests.post(
        "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
        headers={"Authorization": f"Bearer {token}"},
        data=image_data,
    )

    if response.status_code != 200:
        print("HF error:", response.text)
        return False

    caption = response.json()[0].get("generated_text", "").lower()
    print("Caption:", caption)

    plant_keywords = ["tree", "bush", "fruit", "plant", "leaf", "berries", "flowers"]
    return any(word in caption for word in plant_keywords)