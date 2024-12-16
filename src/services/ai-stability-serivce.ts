import axios from "axios";

const FormData = require("form-data");

class AiStabilityService {
  textToImage({
    prompt,
    outputFormat,
  }: {
    prompt: string;
    outputFormat: string;
  }) {
    const fs = require("fs");
    const axios = require("axios");
    const FormData = require("form-data");

    const url = process.env.AI_STABILITY_URL;
    const key = process.env.AI_STABILITY_KEY;

    const payload = {
      prompt: prompt,
      output_format: outputFormat,
    };

    const response = async () => {
      try {
        const response = await axios.postForm(
          `${url}/stable-image/generate/ultra`,
          axios.toFormData(payload, new FormData()),
          {
            validateStatus: undefined,
            responseType: "arraybuffer",
            headers: {
              Authorization: `Bearer ${key}`,
              Accept: "image/*",
            },
          }
        );

        if (response.status === 200) {
          return response;
        } else {
          throw new Error(`${response.status}: ${response.data.toString()}`);
        }
      } catch (error) {
        console.error("Error generating image:", error);
      }
    };
    return response();
  }
}

export default AiStabilityService;
