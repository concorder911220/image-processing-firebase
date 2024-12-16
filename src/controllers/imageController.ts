import axios from "axios";
import { Response } from "express";

export const handleTextToImage = (req: any, res: Response) => {
  const url = process.env.FREEPIK_URL;
  const key = process.env.FREEPIK_API_KEY;

  const headers: any = {
    "Content-Type": "application/json",
    "x-freepik-api-key": key,
  };

  const startTime = performance.now();
  axios({
    method: "post",
    url: `${url}/text-to-image`,
    data: {
      prompt: req.body.prompt,
      negative_prompt: req.body.negative_prompt,
      styling: req.body.styling,
      guidance_scale: req.body.guidance_scale,
      image: req.body.image,
      num_images: req.body.num_images,
      seed: req.body.seed,
    },
    headers: headers,
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
  const url = process.env.FREEPIK_URL;
  const key = process.env.FREEPIK_API_KEY;

  const headers: any = {
    "Content-Type": "application/x-www-form-urlencoded",
    "x-freepik-api-key": key,
  };

  const startTime = performance.now();
  axios({
    method: "post",
    url: `${url}/beta/remove-background`,
    data: {
      image_url: req.body.image_url,
    },
    headers: headers,
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

export const handleUpscale = (req: any, res: Response) => {
  const url = process.env.FREEPIK_URL;
  const key = process.env.FREEPIK_API_KEY;

  const headers: any = {
    "x-freepik-api-key": key,
  };

  const startTime = performance.now();

  axios({
    method: "post",
    url: `${url}/image-upscaler`,
    data: {
      image: req.body.image,
      scale_factor: req.body.scale_factor,
      optimized_for: req.body.optimized_for,
      prompt: req.body.prompt,
      creativity: 2,
      hdr: 1,
    },
    headers: headers,
  })
    .then(async (r) => {
      const task_id = r.data.data.task_id;

      const poll = {
        refresh: async () => {
          const response = await _getStatus(task_id);

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

async function _getStatus(task_id: string): Promise<any> {
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
