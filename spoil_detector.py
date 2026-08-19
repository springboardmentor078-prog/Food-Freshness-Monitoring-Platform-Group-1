"""
Spoil Detector Module - YOLOv8 Spoiled Region Highlighting
"""
import os
import sys

# Ensure root directory and backend directory are in path
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Import the core implementation from backend/services/spoil_detector.py
from backend.services.spoil_detector import SpoilDetector, detect_spoilage, get_spoil_detector

__all__ = ["SpoilDetector", "detect_spoilage", "get_spoil_detector"]

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Run YOLOv8 Spoiled Food Detection and Highlighting")
    parser.add_argument("--image", type=str, help="Path to input food image")
    parser.add_argument("--weights", type=str, default=None, help="Path to custom .pt weights file")
    parser.add_argument("--conf", type=float, default=0.4, help="Confidence threshold")
    parser.add_argument("--output", type=str, default="spoilage_highlight.jpg", help="Output highlighted image path")

    args = parser.parse_args()

    if args.image:
        print(f"🔍 Analyzing food image: {args.image}")
        result = detect_spoilage(args.image, conf_threshold=args.conf, model_path=args.weights, output_path=args.output)
        print(f"📌 Status: {result['status']}")
        print(f"📌 Model Type: {result['model_type']}")
        print(f"📌 Spoiled Regions Detected: {result['spoilage_count']}")
        for idx, det in enumerate(result['detections'], 1):
            print(f"   [{idx}] {det['class_name']} - Conf: {det['confidence']*100:.1f}% - Box2D: {det['box_2d']}")
        if result.get('saved_path'):
            print(f"✅ Saved highlighted image to: {result['saved_path']}")
    else:
        print("Usage: python spoil_detector.py --image path/to/image.jpg [--weights best.pt] [--conf 0.4]")
