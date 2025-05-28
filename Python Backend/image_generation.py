import torch
from diffusers import FluxPipeline
import os
import google.generativeai as genai




def generateImage(prompt):


    pipe = FluxPipeline.from_pretrained("black-forest-labs/FLUX.1-schnell", torch_dtype=torch.bfloat16)
    pipe.enable_model_cpu_offload() #save some VRAM by offloading the model to CPU. Remove this if you have enough GPU power

    
    image = pipe(
        prompt,
        guidance_scale=0.0,
        num_inference_steps=4,
        max_sequence_length=256,
        generator=torch.Generator("cpu").manual_seed(0)
    ).images[0]
    image.save("flux-schnell.png")

prompt = "A cat holding a sign that says hello world"
generateImage(prompt)