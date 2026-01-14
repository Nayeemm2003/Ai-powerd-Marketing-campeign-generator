from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load your fine-tuned model and tokenizer
MODEL_PATH = "../gpt2-marketing"

try:
    logger.info("Loading GPT-2 model and tokenizer...")
    tokenizer = GPT2Tokenizer.from_pretrained(MODEL_PATH)
    model = GPT2LMHeadModel.from_pretrained(MODEL_PATH)
    
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    logger.info("Model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise e

def generate_campaign(product_name, description, audience, tone, goal, platforms):
    """Generate marketing campaign using fine-tuned GPT-2"""
    
    #  USE THE EXACT SAME PROMPT AS Generation_GPT2.py
    platform = platforms[0] if platforms else "Instagram"
    prompt = f"Platform: {platform}\nProduct: {product_name}\nAudience: {audience}\nGoal: {goal}\nTone: {tone}\n\nPost:"
    
    logger.info(f"Using prompt: {prompt}")
    
    try:
        # Tokenize input (same as Generation_GPT2.py)
        inputs = tokenizer.encode(prompt, return_tensors='pt')
        
        # Generate campaign (same parameters as Generation_GPT2.py)
        with torch.no_grad():
            outputs = model.generate(
                inputs,
                max_length=200,
                min_length=80,
                temperature=0.3,
                top_k=50,
                top_p=0.92,
                repetition_penalty=1.2,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                num_return_sequences=1,
                no_repeat_ngram_size=2
            )
        
        # Decode generated text
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract only the generated part (same logic as Generation_GPT2.py)
        if generated_text.startswith(prompt):
            campaign_content = generated_text[len(prompt):].strip()
        else:
            campaign_content = generated_text.strip()
        
        logger.info(f"Generated content: {campaign_content}")
        
        #  Return the raw generated content (not truncated)
        response = {}
        for platform in platforms:
            response[platform] = campaign_content  # Return full content
        
        return response
        
    except Exception as e:
        logger.error(f"Error generating campaign: {e}")
        return {"error": str(e)}

@app.route('/')
def home():
    return jsonify({"message": "Marketing Campaign Generator API", "status": "running"})

@app.route('/generate', methods=['POST'])
def generate_campaign_endpoint():
    """Endpoint to generate marketing campaigns"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['product_name', 'product_description', 'target_audience', 'brand_tone', 'platforms', 'goal']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Extract data
        product_name = data['product_name']
        description = data['product_description']  # Not used in prompt but kept for compatibility
        audience = data['target_audience']
        tone = data['brand_tone']
        goal = data['goal']
        platforms = data['platforms']
        
        logger.info(f"Generating campaign for: {product_name}")
        
        # Generate campaign
        campaign_result = generate_campaign(
            product_name, description, audience, tone, goal, platforms
        )
        
        return jsonify(campaign_result)
        
    except Exception as e:
        logger.error(f"API error: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)