import axios from "axios";

interface ImageRequest {
  prompt: any;
  negativePrompt?: any;
  styling?: any;
  guidanceScale?: any;
  image?: any;
  numImages?: any;
}

interface UpscaleRequest {
  prompt: any;
  negativePrompt?: any;
  styling?: any;
  guidanceScale?: any;
  image?: any;
  numImages?: any;
  seed?: any;
  scaleFactor?: any;
  optimizedFor?: any;
}

class FreepikService {
  textToImage(req: ImageRequest): Promise<any> {
    const url = process.env.FREEPIK_URL;
    const key = process.env.FREEPIK_API_KEY;

    const headers: any = {
      "Content-Type": "application/json",
      "x-freepik-api-key": key,
    };

    return axios({
      method: "post",
      url: `${url}/text-to-image`,
      data: {
        prompt: req.prompt,
        negative_prompt: req.negativePrompt,
        styling: req.styling,
        guidance_scale: req.guidanceScale,
        image: req.image,
        num_images: req.numImages,
      },
      headers: headers,
    });
  }

  removeBackground(image_url: string) {
    const url = process.env.FREEPIK_URL;
    const key = process.env.FREEPIK_API_KEY;

    const headers: any = {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-freepik-api-key": key,
    };

    return axios({
      method: "post",
      url: `${url}/beta/remove-background`,
      data: {
        image_url: image_url,
      },
      headers: headers,
    });
  }

  upscale(req: UpscaleRequest) {
    const url = process.env.FREEPIK_URL;
    const key = process.env.FREEPIK_API_KEY;

    const headers: any = {
      "x-freepik-api-key": key,
    };

    return axios({
      method: "post",
      url: `${url}/image-upscaler`,
      data: {
        image: req.image,
        scale_factor: req.scaleFactor,
        optimized_for: req.optimizedFor,
        prompt: req.prompt,
        creativity: 2,
        hdr: 1,
      },
      headers: headers,
    });
  }

  async getUpscaleStatus(task_id: string) {
    const url = process.env.FREEPIK_URL;
    const key = process.env.FREEPIK_API_KEY;

    const headers: any = {
      "x-freepik-api-key": key,
    };

    const response = await axios({
      method: "get",
      url: `${url}/image-upscaler/${task_id}`,
      headers: headers,
    });

    return response;
  }
}

export default FreepikService;
