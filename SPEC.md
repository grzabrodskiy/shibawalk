# Shiba Walk Spec

## Product Direction

- Game type: side-scrolling web game.
- Level in scope: Level 1, from home to park.
- Camera model: the character and shiba stay anchored near the start side of the screen while the world scrolls toward them.
- Visual direction: colorful environment, polished presentation, and the most realistic-looking character art practical without external paid assets.
- Layout rule: the playable area should take the vast majority of the screen.
- Layout rule: the scene should stay as unobscured as possible, so only compact stats sit inside the stage while status, buttons, and instructions sit directly beneath it.

## Technical Stack

- Frontend: React + TypeScript.
- Tooling: Vite.
- Package manager: pnpm.
- Default local dev server: `pnpm dev` on port `3003`.
- UI approach: custom CSS and SVG art for the game surface; no component library is required for this first playable because the scene is highly bespoke.

## Code Structure Rules

- `App.tsx` should stay small and act mainly as composition plus top-level state wiring.
- As a working rule, individual code files should usually stay under roughly 400 to 500 lines.
- Game logic lives under `src/game`, interaction helpers under `src/hooks`, and view pieces under `src/components`.
- Styles are split by concern instead of keeping one giant stylesheet.

## Implemented In This Pass

### Core Scene

- Full-screen leaning side-scroller stage with a fixed player anchor and moving world.
- Home-to-park route with scenery props including house, lamps, benches, trees, flowers, treat bags, and a park gate.
- The first route is intentionally much longer than the initial prototype and now stretches across a fuller neighborhood walk.
- Parallax-style background layers, moving road markings, and weather overlays.

### Characters

- Custom SVG walker art.
- Custom SVG shiba art with more realistic proportions and shading than placeholder shapes.
- The shiba side profile keeps four visible legs rather than collapsing to a three-leg silhouette.
- Custom event actor art for cats and passing dogs with more anatomical detail than the initial pass.
- Passing dogs are rendered as regular neighborhood dogs with a clearer side profile.
- Characters face the direction they are currently traveling.
- Cat art uses a full four-leg run silhouette instead of a simplified two-leg pass.
- Cat tails are carried upright in the silhouette.
- The shiba tail uses a single clean fur silhouette without an extra inner highlight stroke.
- Character and animal placement is tuned so the paws sit on the road rather than floating above it.
- Walker and shiba placement is tuned slightly deeper into the road so they read as standing nearer the middle of the lane.
- Walker hip and upper-leg overlap is tuned so the legs stay visually attached to the body during the gait cycle.
- Both walker hands are explicitly rendered in the silhouette.
- The leash is anchored to a visible walker hand and the shiba collar/neck rather than approximate free points.
- The leash anchor uses fixed mirrored hand and collar landmarks so it stays attached across both facing directions.
- Cats and passing dogs travel on a slightly higher back lane and render behind the walker and shiba.
- Basic motion loops for walking, tail movement, and running event actors.

### Level 1 Mechanics

- Shiba default mood system with weighted tendencies.
- Default behavior usually favors moving toward the park.
- Mood outcomes include moving right fast, moving right slowly, stopping, moving left slowly, and moving left fast.
- Random stubborn streak event that overrides normal mood and changes direction unpredictably.
- Cat event that can run either direction and pulls shiba toward the cat's current position on screen, so she still chases it while it is in front of her.
- Cats call out with a `MEOW!` bubble while still at a short distance on approach, and then again once they are moving away and slightly clear of the shiba.
- Whenever the cat or dog callout appears, the shiba automatically yips back with an on-screen reaction bubble.
- Rain event that biases shiba toward home.
- Passing dog event that makes shiba want to stop, turns nose-to-nose on the visible front side of the shiba, waits there anchored to the ground for about two seconds, and then continues its own journey.
- Passing dogs call out with a `BARK!` bubble while still approaching, and then bark again once they are departing and slightly away from the shiba.
- Continuous pull mechanic where the player can apply leash force in either horizontal direction.
- Pull force decays quickly while held and recovers while resting.
- Treat mechanic with 5 starting treats.
- Special action: `Shiba Scream`, which is visual-only and just shows an on-screen yip bubble without changing movement, events, or overall game state.
- Treat pickups along the level that replenish treats.
- Using a treat shows a visible treat toss from the walker toward the shiba.
- Distance and progress tracking from home to park.
- Win state at the park gate.

### Controls

- Keyboard left pull: `A` or `Left Arrow`.
- Keyboard right pull: `D`, `Right Arrow`, or `Space`.
- Keyboard brace: `S` or `Down Arrow`.
- Keyboard treat: `W`, `E`, or `Up Arrow`.
- Keyboard scream: `Q`.
- Keyboard restart: `R`.
- On-screen pull controls are shown as left and right arrow buttons, with accessible labels for home and park direction.
- The control copy explains that left points toward home and right points toward the park.

## Current Tuning

- Pulling is strong enough to overcome normal resistance for short stretches.
- Pull strength deteriorates as the force meter drains.
- Treats temporarily increase willingness to move toward the park.
- Random events spawn during the walk and can temporarily override or dampen normal movement.
- Leg animation timing is intentionally slowed down so walking reads more natural and less frantic.
- Walker and shiba gait timing uses a capped visual-speed mapping so sudden velocity spikes do not cause unnaturally fast leg motion.
- Cat events stay on screen long enough to fully run from one side of the play area to the other.
- The old event legend chips were removed because they read as unclear debug-style labels instead of useful player-facing information.

## Layout Requirements Implemented

- The playfield is the main visual focus.
- A compact level tag and the full stat strip are rendered together in one top row inside the stage, offset away from the home marker so it stays visible.
- Stats are rendered at the top inside the stage as compact overlays in that shared row.
- In-stage overlay backgrounds are fully transparent so labels and stats do not block the scenery.
- In-stage overlays are borderless so the labels float over the scene without visible framing.
- All status and end-of-level messaging is shown in the lower message panel instead of inside the stage.
- The lower status readout is rendered as minimal text with no background card, while action buttons and control instructions stay beneath the play area.
- Action buttons are compact round icon buttons with hover text labels for mouse users.
- Mobile layout keeps the same split: stats inside the stage, controls and messaging below it.

## Deployment Requirements Implemented

- The project is linked to a Vercel project named `miwa-walk`.
- The public production URL is `https://miwa-walk.vercel.app`.
- GitHub repository secrets store the Vercel project ID, org ID, and CI deploy token.
- GitHub Actions deploys every push to Vercel automatically.
- Pushes to `main` deploy to production.
- Pushes to other branches deploy preview builds.
- Release keyword: whenever the user says `PUBLISH`, it means to commit the current work if needed, push the current branch to the GitHub remote, let the Vercel deployment run, verify the result, and report the live URL back.
- For production release requests, `PUBLISH` should push the latest work to `main` so `https://miwa-walk.vercel.app` updates.
- A `PUBLISH` request is not complete until the remote push succeeds and the Vercel deployment status has been checked.

## Near-Term Next Steps

- Improve realism further with richer character illustration passes or frame-based sprite sheets.
- Add destination intro and outro states for home and park.
- Add collectible feedback, sound, and stronger level-specific storytelling.
- Add more nuanced leash physics and directional animation blending.
