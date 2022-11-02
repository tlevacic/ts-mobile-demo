# Quickstart

Run `npm install`

To start backend server, run `npx nx run server:serve`. This will run the server in watch mode.
To start react native app, run `npx run splash:run-ios`. This will run the app in simulator.

## Links

Repo is set up as a monorepo, and managed by https://nx.dev/getting-started/intro . Check the docs for more info (especially on how to add new tasks / commands - for instance for migrations). `apps/server` is exposing the API from the `libs/domain` which is setup with tRPC (https://trpc.io/docs/v10/react). Both the client (`apps/splash`) consume code from `libs/schemas` where all shared Zod schemas should live. If you need to add validation on server side (checking uniqueness on DB level or something similar), use https://github.com/colinhacks/zod#refine . tRPC is used on the client side for queries and mutations (https://trpc.io/docs/v10/react). Forms are implemented with https://react-hook-form.com/ which can consume Zod schemas for validations.

## Initial codebase

Initial codebase includes queries and mutations on the server side, which are consumed by the React Native app through tRPC. Check docs for tRPC(https://trpc.io/docs/v10/react), react-hook-form (https://react-hook-form.com/), Zod (https://github.com/colinhacks/zod) and react-query (https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)
