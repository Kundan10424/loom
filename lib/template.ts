// /features/templates/paths.ts

import { Templates } from "@prisma/client";

// /features/templates/paths.ts

export const templatePaths: Record<Templates, string> = {
  // Frontend
  [Templates.REACTJS]: "/loom-starters/reactjs",
  [Templates.REACT_VITE]: "/loom-starters/react-vite",
  [Templates.NEXTJS]: "/loom-starters/nextjs",
  [Templates.VUE_VITE]: "/loom-starters/vue-vite",
  [Templates.NUXT]: "/loom-starters/nuxt",
  [Templates.ANGULAR]: "/loom-starters/angular",
  [Templates.SVELTE]: "/loom-starters/svelte",
  [Templates.ASTRO]: "/loom-starters/astro",

  // Backend
  [Templates.NODE_EXPRESS]: "/loom-starters/node-express",
  [Templates.NODE_FASTIFY]: "/loom-starters/node-fastify",
  [Templates.NODE_HONO]: "/loom-starters/hono",
  [Templates.NODE_NEST]: "/loom-starters/nest",

  // FullStack
  [Templates.MERN]: "/loom-starters/mern",
  [Templates.MEAN]: "/loom-starters/mean",
  [Templates.T3_STACK]: "/loom-starters/t3-stack",
  [Templates.NEXT_PRISMA]: "/loom-starters/next-prisma",

  // Languages
  [Templates.PYTHON]: "/loom-starters/python",
  [Templates.JAVA]: "/loom-starters/java",
  [Templates.GO]: "/loom-starters/go",
  [Templates.RUST]: "/loom-starters/rust",
  [Templates.CPP]: "/loom-starters/cpp",
  [Templates.C]: "/loom-starters/c",
  [Templates.CSHARP]: "/loom-starters/csharp",
  [Templates.PHP]: "/loom-starters/php",
  [Templates.RUBY]: "/loom-starters/ruby",

  // Dev / Runtime
  [Templates.DOCKER_NODE]: "#",
  [Templates.DOCKER_PYTHON]: "#",
  [Templates.TYPESCRIPT_NODE]: "#",
  [Templates.BUN_APP]: "#",
  [Templates.DENO_APP]: "#",
};
