import axios from "axios";
import { Response } from "express";
import FreepikService from "../services/freepik-service";
import AiStabilityService from "../services/ai-stability-serivce";

export const handleTextToImage = (req: any, res: Response) => {
  const service = new FreepikService();
  const startTime = performance.now();

  service
    .textToImage({
      numImages: req.body.num_images,
      prompt: req.body.prompt,
      guidanceScale: req.body.guidance_scale,
      image: req.body.image,
      negativePrompt: req.body.negative_prompt,
      styling: req.body.styling,
    })
    .then((response) => {
      const endTime = performance.now();
      const elapsed = endTime - startTime;
      res.status(200).json({ elapsed: Math.round(elapsed), ...response.data });
    })
    .catch((e) => {
      res.status(e.status).json({ error: e.response.data.message });
    });
};

export const handleTextToImageAiStability = (req: any, res: Response) => {
  const service = new AiStabilityService();
  const startTime = performance.now();

  service
    .textToImage({
      prompt: req.body.prompt,
      outputFormat: req.body.output_format,
    })
    .then((response) => {
      const endTime = performance.now();
      const elapsed = endTime - startTime;
      res.status(200).json({ elapsed: Math.round(elapsed), ...response.data });
    })
    .catch((e) => {
      res.status(e.status).json({ error: e.response.data.message });
    });
};

export const handleRemoveBackground = (req: any, res: Response) => {
  const service = new FreepikService();
  const startTime = performance.now();

  service
    .removeBackground(req.body.image_url)
    .then((response) => {
      const endTime = performance.now();
      const elapsed = endTime - startTime;
      res.status(200).json({ elapsed: Math.round(elapsed), ...response.data });
    })
    .catch((e) => {
      res.status(e.status).json({ error: e.response.data.message });
    });
};

export const handleUpscale = (req: any, res: Response) => {
  const service = new FreepikService();
  const startTime = performance.now();

  service
    .upscale({
      prompt: req.body.prompt,
      guidanceScale: req.body.guidance_scale,
      image: req.body.image,
      negativePrompt: req.body.negative_prompt,
      numImages: req.body.num_images,
      optimizedFor: req.body.optimizedFor,
    })
    .then(async (r) => {
      const task_id = r.data.data.task_id;

      const poll = {
        refresh: async () => {
          const response = await service.getUpscaleStatus(task_id);

          if (response.data.data.status == "COMPLETED") {
            const endTime = performance.now();
            const elapsed = endTime - startTime;
            res
              .status(200)
              .json({ elapsed: Math.round(elapsed), ...response.data });
          } else {
            setTimeout(poll.refresh, 1000);
          }
        },
      };
      poll.refresh();
    })
    .catch((e) => {
      res.status(e.status).json({ error: e.response.data.message });
    });
};
