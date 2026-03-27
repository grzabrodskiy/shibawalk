# Shiba Art Handover

## Restart Note

- `imagegen` and `figma` were installed into Codex skills and require a Codex restart before they can be used.

## First Prompt To Use After Restart

Use this exact prompt:

```text
Use the imagegen and figma skills for this project. Redesign the shiba for the side-scrolling game so she is cartoonish, polished, and clearly appealing at gameplay scale, not realistic-photo style. Keep the current human for now. First generate or source 3-5 strong side-view cartoon shiba concepts, choose the best one, then turn it into a layered game-ready SVG with separate body/head, tail, front leg, and rear leg parts so the motion can look natural. Replace the current shiba with that new asset, keep the leash attached to the neck/collar, remove any fake duplicate legs, update SPEC.md, run pnpm build, and keep the local server on port 3003 if possible.
```

## What The User Wants

- The current shiba is not acceptable.
- The user is fine with a cartoonish shiba if it looks good.
- The current motion does not look natural.
- The extra fake legs should stay removed.
- The shiba should keep:
  - connected ears
  - a cinnamon-roll tail
  - a leash connection at the neck/collar

## Recommended Execution Plan

1. Use `imagegen` to create a few strong side-view cartoon shiba references for a side-scrolling game.
2. Pick the best concept for readability at small size and in motion.
3. Use `figma` or direct SVG cleanup to build a layered asset from that concept.
4. Replace the current shiba implementation with the new layered asset.
5. Animate only the layers that should move:
   - front leg
   - rear leg
   - subtle tail sway
   - slight body bob
6. Keep the motion restrained and readable.

## Current Technical Context

- Package manager: `pnpm`
- Dev server target: `http://localhost:3003/`
- The project currently uses React 19 + TypeScript + Vite.
- The stage is rendered with PixiJS, but the visible human and shiba are currently in the DOM layer.
- The current visible shiba is wired through:
  - `src/art.tsx`
  - `src/components/GamePanel.tsx`
  - `src/styles/characters.css`
- The current imported template asset is:
  - `src/assets/shiba-openclipart.svg`
- It is acceptable to replace or remove that asset if a better cartoon shiba is created.

## Important Project Rules

- Always update `SPEC.md` for implemented behavior.
- Keep `App.tsx` small.
- Prefer files under roughly 400-500 LOC.
- When the user says `PUBLISH`, commit if needed, push to GitHub, verify Vercel, and report the live URL.

## Acceptance Criteria

- The new shiba reads clearly and attractively at gameplay size.
- The style is cartoonish but polished.
- The walk cycle feels natural.
- No fake duplicate legs remain.
- The leash still connects cleanly to the collar/neck.
- `pnpm build` passes.

