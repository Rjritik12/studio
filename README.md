# Firebase Studio Next.js Starter

This is a NextJS starter project for Firebase Studio.

## Getting Started

To get started, take a look at `src/app/page.tsx`.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode using Next.js with Turbopack.
Open [http://localhost:9002](http://localhost:9002) (or your configured port) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `.next` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`

Starts the production server after a build. This requires `npm run build` to be run first.

### `npm run lint`

Runs the Next.js linter to check for code quality and potential errors.

### `npm run typecheck`

Runs the TypeScript compiler to check for type errors in the project.

## Capacitor (for Mobile App Deployment)

This project is configured to use Capacitor for building native mobile applications.

### `npm run build:cap`
Builds the Next.js app for static export, required for Capacitor (`next build && next export`). The output will be in the `out/` directory.

### `npm run cap:add:android`
Adds the Android platform to your Capacitor project. Creates an `android/` directory.

### `npm run cap:sync:android`
Copies your web app assets from the `out/` directory into the native Android project. Run this after `npm run build:cap` and whenever you make changes to your web code.

### `npm run cap:open:android`
Opens your Android project in Android Studio.

### `npm run cap:run:android`
Builds and runs your app on a connected Android device or emulator (requires Android development environment setup).
