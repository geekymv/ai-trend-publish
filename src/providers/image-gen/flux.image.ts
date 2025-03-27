import axios from "npm:axios";
import { BaseImageGenerator } from "@src/providers/image-gen/base.image-generator.ts";
import { ConfigManager } from "@src/utils/config/config-manager.ts";
import Together from "npm:together-ai";

export interface FluxOptions {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  n?: number;
}

interface FluxResponse {
  id: string;
  model: string;
  object: string;
  data: Array<{
    index: number;
    url: string;
    timings: {
      inference: number;
    }
  }>;
}

export class FluxImageGenerator extends BaseImageGenerator {
  private apiKey: string | undefined;
  private readonly baseUrl = "https://api.together.xyz/v1/images/generations";
  private readonly model = "black-forest-labs/FLUX.1-schnell-Free";

  private together = new Together();

  async refresh(): Promise<void> {
    await this.validateConfig();
    this.apiKey = await ConfigManager.getInstance().get("TOGETHER_API_KEY");
  }

  async validateConfig(): Promise<void> {
    if (!(await ConfigManager.getInstance().get("TOGETHER_API_KEY"))) {
      throw new Error("TOGETHER_API_KEY 环境变量未设置");
    }
  }

  async generate(options: FluxOptions): Promise<string> {
    const {
      prompt,
      width = 1024,
      height = 1024,
      steps = 4,
      n = 1,
    } = options;

    const response = await this.together.images.create({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: "Daily AI Express about cutting-edge technology and artificial intelligence news",
        width: 1024,
        height: 1024,
        steps: 4,
        n: 1,
        response_format: "url",
        update_at: "2025-03-20T06:11:18.715Z"});

        return response.data[0].url;

    /*
    try {
        console.log('base url', this.baseUrl);
      const response = await axios.post<FluxResponse>(
        this.baseUrl,
        {
          model: this.model,
          prompt,
          width: Number(width),
          height: Number(height),
          steps: Number(steps),
          n: Number(n),
          response_format: "url",
          update_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 设置为一年后
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Flux API Response:", JSON.stringify(response.data, null, 2)); // 添加调试日志

      if (!response.data?.data?.[0]?.url) {
        throw new Error(`未获取到有效的图片URL: ${JSON.stringify(response.data)}`);
      }

      return response.data.data[0].url;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Flux API Error:", error.response?.data); // 添加调试日志
        throw new Error(
          `图片生成失败: ${error.response?.data?.error?.message || error.response?.data?.message || error.message}`
        );
      }
      throw error;
    }
      */
  }
}