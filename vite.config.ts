
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [
      react(),
          glsl(), // GLSL / shader support
            ],
              build: {
                  outDir: "dist",      // Vercel will serve from this
                      emptyOutDir: true,
                        },
                          // large assets (models, audio, etc.)
                            assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.mp3", "**/*.ogg", "**/*.wav"],
                            });
