from ultralytics import YOLO
import os
import shutil

if __name__ == '__main__':
    print("🚀 Starting local YOLOv8 training on your PC...")
    # Load a pretrained YOLOv8 classification model
    model = YOLO('yolov8n-cls.pt')
    
    # Path to the reorganized dataset
    dataset_path = os.path.abspath('dataset')
    
    # Train the model (25 epochs is enough for local CPU to keep it fast)
    model.train(
        data=dataset_path,
        epochs=25,
        imgsz=224,
        project='runs/classify',
        name='food_freshness',
        exist_ok=True
    )
    
    print("\n🔄 Exporting model to ONNX format...")
    best_pt_path = 'runs/classify/food_freshness/weights/best.pt'
    
    # Export to ONNX
    export_model = YOLO(best_pt_path)
    export_model.export(format='onnx')
    
    print("\n📦 Moving new models to the main folder...")
    best_onnx_path = 'runs/classify/food_freshness/weights/best.onnx'
    
    # Move them to the root directory where the backend can find them
    shutil.copy(best_pt_path, 'best.pt')
    if os.path.exists(best_onnx_path):
        shutil.copy(best_onnx_path, 'best.onnx')
    
    print("✅ Local training and export complete! You can now restart your backend.")
