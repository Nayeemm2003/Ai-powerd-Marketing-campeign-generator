# Training_GPT2.py
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from torch.utils.data import Dataset
import json
import os

class MarketingDataset(Dataset):
    def __init__(self, texts, tokenizer, max_length=256):
        self.texts = texts
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        # Tokenize the text
        encoding = self.tokenizer(
            text,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': encoding['input_ids'].flatten()
        }

def fine_tune_gpt2():
    print("=== Step 1: Loading GPT-2 Model ===")
    # Load pre-trained GPT-2 model and tokenizer
    model_name = "gpt2"
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    model = GPT2LMHeadModel.from_pretrained(model_name)
    
    # Add padding token if it doesn't exist
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    print("✓ GPT-2 model loaded successfully")

    print("\n=== Step 2: Loading Marketing Data ===")
    # Load your marketing data
    DATA_PATH = "marketing_campaign_500.jsonl"
    texts = []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        for line in f:
            try:
                rec = json.loads(line)
                txt = rec.get("text", "").strip()
            except:
                txt = line.strip()
            if txt:
                texts.append(txt)

    print(f"✓ Loaded {len(texts)} marketing samples")

    # Create dataset
    dataset = MarketingDataset(texts, tokenizer)

    print("\n=== Step 3: Setting Up Training ===")
    # Training arguments
    training_args = TrainingArguments(
        output_dir="./gpt2-marketing",
        overwrite_output_dir=True,
        num_train_epochs=3,  # Fewer epochs needed for fine-tuning
        per_device_train_batch_size=2,  # Smaller batch size to avoid memory issues
        save_steps=500,
        save_total_limit=2,
        prediction_loss_only=True,
        remove_unused_columns=False,
        warmup_steps=100,
        learning_rate=5e-5,  # Small learning rate for fine-tuning
        logging_steps=50,
        logging_dir="./logs",
    )

    # Data collator
    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=False,  # We're doing causal LM, not masked LM
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=dataset,
    )

    print("\n=== Step 4: Starting Fine-Tuning ===")
    print("This will take 10-30 minutes depending on your computer...")
    
    # Fine-tune the model
    trainer.train()
    
    print("\n=== Step 5: Saving Model ===")
    # Save the fine-tuned model
    trainer.save_model()
    tokenizer.save_pretrained("./gpt2-marketing")
    print("✓ Fine-tuning complete!")
    print("✓ Model saved to: ./gpt2-marketing/")

if __name__ == "__main__":
    fine_tune_gpt2()