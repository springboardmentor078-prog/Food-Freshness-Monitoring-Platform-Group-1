import os
import shutil
from ultralytics import YOLO

def setup_micro_dataset():
    base_path = r"d:\teju\AI_Food Freshness Monitoring Platform\datasets\seg"
    micro_path = r"d:\teju\AI_Food Freshness Monitoring Platform\datasets\micro_seg"
    
    if os.path.exists(micro_path):
        shutil.rmtree(micro_path)
        
    os.makedirs(os.path.join(micro_path, 'train', 'images'))
    os.makedirs(os.path.join(micro_path, 'train', 'labels'))
    os.makedirs(os.path.join(micro_path, 'val', 'images'))
    os.makedirs(os.path.join(micro_path, 'val', 'labels'))
    
    # Copy first 50 images and labels for train
    train_images_dir = os.path.join(base_path, 'train', 'images')
    train_labels_dir = os.path.join(base_path, 'train', 'labels')
    
    images = [f for f in os.listdir(train_images_dir) if f.endswith('.jpg') or f.endswith('.png') or f.endswith('.jpeg')]
    
    print(f"Found {len(images)} images in original dataset. Copying 50 to micro dataset...")
    
    for i, img_name in enumerate(images[:50]):
        # Copy image
        shutil.copy(os.path.join(train_images_dir, img_name), os.path.join(micro_path, 'train', 'images', img_name))
        
        # Copy label
        label_name = img_name.rsplit('.', 1)[0] + '.txt'
        if os.path.exists(os.path.join(train_labels_dir, label_name)):
            shutil.copy(os.path.join(train_labels_dir, label_name), os.path.join(micro_path, 'train', 'labels', label_name))
            
    # Copy 10 for val
    for i, img_name in enumerate(images[50:60]):
        shutil.copy(os.path.join(train_images_dir, img_name), os.path.join(micro_path, 'val', 'images', img_name))
        label_name = img_name.rsplit('.', 1)[0] + '.txt'
        if os.path.exists(os.path.join(train_labels_dir, label_name)):
            shutil.copy(os.path.join(train_labels_dir, label_name), os.path.join(micro_path, 'val', 'labels', label_name))
            
    # Create micro_data.yaml
    yaml_content = f"""path: {micro_path}
train: train/images
val: val/images
names:
  0: Apple
  1: Banana
  2: Bellpepper
  3: Carrot
  4: Cucumber
  5: Grape
  6: Guava
  7: Kaki
  8: Lemon
  9: Lime
  10: Mango
  11: Orange
  12: Papaya
  13: Peach
  14: Pear
  15: Pomegranate
  16: Potato
  17: Strawberry
  18: Tomato
  19: Watermelon
  20: Bitter_Gourd
  21: Jujube
"""
    with open(os.path.join(micro_path, 'micro_data.yaml'), 'w') as f:
        f.write(yaml_content)
        
    return os.path.join(micro_path, 'micro_data.yaml')

if __name__ == '__main__':
    print("Setting up Micro-Dataset (50 images)...")
    yaml_path = setup_micro_dataset()
    
    print("Initializing YOLOv8 Segmentation Model...")
    model = YOLO("yolov8n-seg.pt")  # load a pretrained segmentation model
    
    print("Starting 1-Epoch Micro-Training on Local CPU...")
    # Train the model for just 1 epoch to generate the best.pt file
    results = model.train(
        data=yaml_path,
        epochs=1,
        imgsz=320,
        device='cpu', # Force CPU since we are on local Windows laptop
        project="runs/segment",
        name="fruit_seg_micro"
    )
    
    print("Micro-Training Complete! Model saved to: runs/segment/fruit_seg_micro/weights/best.pt")
