from diffusers import StableDiffusionPipeline
import torch
import os

def generateImage(prompt):
    model_id = "sd-legacy/stable-diffusion-v1-5"
    pipe = StableDiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
    pipe = pipe.to("cpu")

    formatted_prompt = f"""
    Generate an image according to the prompt given.
    The image should describe the effect on the climate due to the prompt.
    
    Prompt: {prompt}
    """

    image = pipe(formatted_prompt).images[0]

    # Ensure the 'images' directory exists
    os.makedirs("images", exist_ok=True)

    # Safe filename (removes spaces and special characters)
    safe_filename = "_".join(prompt.strip().split())[:100]

    image_path = os.path.join("images", f"{safe_filename}.png")
    image.save(image_path)
    print(f"Image saved at: {image_path}")
