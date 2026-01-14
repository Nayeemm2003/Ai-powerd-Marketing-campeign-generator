# Generation_GPT2.py
import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer

def generate_marketing_campaign():
    print("=== GPT-2 Marketing Campaign Generator ===")
    
    print("Step 1: Loading fine-tuned model...")
    try:
        # Load the fine-tuned model
        model_path = "./gpt2-marketing"
        tokenizer = GPT2Tokenizer.from_pretrained(model_path)
        model = GPT2LMHeadModel.from_pretrained(model_path)
        
        # Set to evaluation mode
        model.eval()
        print("✓ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("Please run Training_GPT2.py first to fine-tune the model.")
        return
    
    print("\nStep 2: Enter campaign details:")
    print("-" * 40)
    
    # Get user input
    platform = input("Platform (Instagram/Facebook/Email): ").strip() or "Instagram"
    product = input("Product Name: ").strip() or "Smart Fitness Watch"
    audience = input("Target Audience: ").strip() or "Eco-Conscious Families"
    goal = input("Goal (Awareness/Sales/Leads): ").strip() or "Awareness"
    tone = input("Tone (Friendly/Professional/Bold): ").strip() or "Professional"
    
    # Create prompt
    prompt = f"Platform: {platform}\nProduct: {product}\nAudience: {audience}\nGoal: {goal}\nTone: {tone}\n\nPost:"
    
    print(f"\nStep 3: Generating campaign for {product}...")
    print("This should take 10-30 seconds...")
    
    # Tokenize the prompt
    inputs = tokenizer.encode(prompt, return_tensors='pt')
    
    # Generate text
    with torch.no_grad():
        outputs = model.generate(
            inputs,
            max_length=200,  # Maximum total length
            min_length=80,   # Minimum generated length
            temperature=0.3, # Controls randomness (0.1-1.0) 0.8
            top_k=50,        # Top-k sampling
            top_p=0.92,      # Nucleus sampling
            repetition_penalty=1.2,  # Penalize repetition
            do_sample=True,  # Use sampling (not greedy)
            pad_token_id=tokenizer.eos_token_id,
            num_return_sequences=1,
            no_repeat_ngram_size=2  # Avoid repeating 2-grams
        )
    
    # Decode the generated text
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Extract only the generated part (after the prompt)
    if generated_text.startswith(prompt):
        generated_content = generated_text[len(prompt):].strip()
    else:
        generated_content = generated_text.strip()
    
    # Display results
    print("\n" + "=" * 60)
    print("🎯 GENERATED MARKETING CAMPAIGN")
    print("=" * 60)
    print(f"📱 Platform: {platform}")
    print(f"🎯 Goal: {goal}")
    print(f"🗣 Tone: {tone}")
    print(f"🎁 Product: {product}")
    print(f"👥 Audience: {audience}")
    print("\n💡 GENERATED CONTENT:")
    print("-" * 40)
    print(generated_content)
    print("-" * 40)
    print(f"✓ Generated {len(generated_content)} characters")
    print("=" * 60)

if __name__ == "__main__":
    generate_marketing_campaign()