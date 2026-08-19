import os
import shutil
from pathlib import Path
import random

# Target paths
base_dir = Path(__file__).parent.resolve()
raw_dir = base_dir / "raw_data"
out_dir = base_dir / "dataset"

train_dir = out_dir / "train"
val_dir = out_dir / "val"

train_dir.mkdir(parents=True, exist_ok=True)
val_dir.mkdir(parents=True, exist_ok=True)

def process_category(files, class_name):
    random.seed(42)
    random.shuffle(files)
    split_idx = int(len(files) * 0.85)
    train_files = files[:split_idx]
    val_files = files[split_idx:]
    
    (train_dir / class_name).mkdir(exist_ok=True)
    (val_dir / class_name).mkdir(exist_ok=True)
    
    for f in train_files:
        shutil.copy(f, train_dir / class_name / f.name)
    for f in val_files:
        shutil.copy(f, val_dir / class_name / f.name)
        
    print(f"{class_name}: {len(train_files)} train, {len(val_files)} val")

print("Processing Fruits...")
fruits_base = raw_dir / "fruits" / "dataset"
fruit_files = {}

for split in ["train", "test"]:
    split_dir = fruits_base / split
    if not split_dir.exists(): continue
    for class_folder in split_dir.iterdir():
        if not class_folder.is_dir(): continue
        cls_name = class_folder.name
        # Normalize class name
        if cls_name == "freshapples": c = "fresh_apple"
        elif cls_name == "freshbanana": c = "fresh_banana"
        elif cls_name == "freshoranges": c = "fresh_orange"
        elif cls_name == "rottenapples": c = "rotten_apple"
        elif cls_name == "rottenbanana": c = "rotten_banana"
        elif cls_name == "rottenoranges": c = "rotten_orange"
        else: c = cls_name
        
        if c not in fruit_files: fruit_files[c] = []
        fruit_files[c].extend(list(class_folder.glob("*.jpg")) + list(class_folder.glob("*.png")))

for c, files in fruit_files.items():
    process_category(files, c)

print("Processing Meat...")
meat_base = raw_dir / "meat" / "Meat Freshness.v1-new-dataset.multiclass"
meat_files = {"fresh_meat": [], "half_fresh_meat": [], "spoiled_meat": []}

for split in ["train", "valid"]:
    split_dir = meat_base / split
    if not split_dir.exists(): continue
    for f in split_dir.glob("*.jpg"):
        name_upper = f.name.upper()
        if name_upper.startswith("FRESH"):
            meat_files["fresh_meat"].append(f)
        elif name_upper.startswith("HALF-FRESH") or name_upper.startswith("HALF_FRESH"):
            meat_files["half_fresh_meat"].append(f)
        elif name_upper.startswith("SPOILED"):
            meat_files["spoiled_meat"].append(f)

for c, files in meat_files.items():
    if len(files) > 0:
        process_category(files, c)

print("Processing new Food Freshness Dataset (Kashishrastogi123)...")
new_dataset_base = raw_dir / "food-freshness-dataset"
if new_dataset_base.exists():
    new_dataset_files = {}
    for split in ["train", "test", "valid"]:
        split_dir = new_dataset_base / split
        # Account for possible nested structures in Kaggle zip files
        if not split_dir.exists():
            split_dir = new_dataset_base / "dataset" / split
        if not split_dir.exists():
            split_dir = new_dataset_base / "dataset" / "dataset" / split
            
        if not split_dir.exists(): continue
        for class_folder in split_dir.iterdir():
            if not class_folder.is_dir(): continue
            # Format folder name, e.g., "Fresh Apple" -> "fresh_apple"
            cls_name = class_folder.name.lower().replace(" ", "_")
            if cls_name not in new_dataset_files:
                new_dataset_files[cls_name] = []
            
            new_dataset_files[cls_name].extend(
                list(class_folder.glob("*.jpg")) + 
                list(class_folder.glob("*.png")) + 
                list(class_folder.glob("*.jpeg"))
            )

    for c, files in new_dataset_files.items():
        if len(files) > 0:
            process_category(files, c)

print("Data preparation complete.")
