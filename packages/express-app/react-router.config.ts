import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  appDirectory: './frontend/app',
  basename: '/app',
} satisfies Config;
