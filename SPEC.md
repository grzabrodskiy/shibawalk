# Shiba Walk Spec

## Product Direction

- Game type: side-scrolling web game.
- Levels in scope: a five-level continuous walk where Level 1 is always Home to Park, and the later destinations are randomized each run from Cafe, Post Office, Restaurant, and Pet Store.
- Camera model: the character and shiba stay anchored near the start side of the screen while the world scrolls toward them.
- Visual direction: colorful environment, polished presentation, and the most realistic-looking character art practical without external paid assets.
- Graphics-upgrade direction: use a layered PixiJS stage first, then replace character SVGs with richer animated assets in later passes if the direction feels right.
- Layout rule: the playable area should take the vast majority of the screen.
- Layout rule: the scene should stay as unobscured as possible, so only compact stats sit inside the stage while status, buttons, and instructions sit directly beneath it.

## Technical Stack

- Frontend: React 19 + TypeScript.
- Tooling: Vite.
- Package manager: pnpm.
- Default local dev server: `pnpm dev` on port `3003`.
- UI approach: React for HUD and controls, with PixiJS rendering the stage and main in-world actors.
- Build cache strategy: Vite emits hashed assets, the app exposes a build ID marker, and Vercel serves the HTML entry point with no-store cache headers to reduce stale deploys.

## Code Structure Rules

- `App.tsx` should stay small and act mainly as composition plus top-level state wiring.
- As a working rule, individual code files should usually stay under roughly 400 to 500 lines.
- Game logic lives under `src/game`, interaction helpers under `src/hooks`, and view pieces under `src/components`.
- Styles are split by concern instead of keeping one giant stylesheet.

## Implemented In This Pass

### Core Scene

- Full-screen leaning side-scroller stage with a fixed player anchor and moving world.
- Current graphics-upgrade prototype: the stage background, road, lighting, world props, and leash render through PixiJS while the walker, shiba, animated encounter animals, HUD, and status controls remain in React DOM.
- A continuous route that starts at home, passes through the park gate, and then continues through a randomized order of neighborhood destinations.
- Route scenery includes the house, lamps, benches, trees, flowers, treat bags, park gates, park fountains, the cafe endpoint, the post office endpoint, the restaurant endpoint, and the pet store endpoint.
- The first route is intentionally much longer than the initial prototype and now stretches across a fuller neighborhood walk.
- Parallax-style background layers, moving road markings, and weather overlays.
- The stage now adds stronger depth cues through softer ground shadows, richer atmospheric light, and slight camera-motion-style drift in the Pixi background layers.
- Each destination level now swaps to its own broader background treatment so the route visibly changes between a greener park approach, a more urban cafe stretch, a Zurich-like old-town waterfront, a lakefront restaurant segment, and a neighborhood market/pet-store segment.
- Stroked Pixi arc details now start from explicit local points so landmark arches and the coffee-cup handle do not throw stray diagonal lines from the scene origin.

### Characters

- The walker currently uses the stronger legacy SVG silhouette in the DOM layer while the rest of the upgraded stage remains in PixiJS.
- The walker hair is tuned to a dark orange tone.
- The walker hair silhouette is slightly extended so it cleanly covers the full top of the head without changing the overall hairstyle.
- The walker remains clearly female-presenting, with the current haircut and dark orange hair color preserved while the face and coat silhouette are tuned a bit cleaner.
- Walker arm pivots and sleeve overlap are tuned so the hands stay visually attached to the body through the walk cycle.
- After completing a destination, the walker now visibly carries a destination-specific item, including flowers after the park, coffee after the cafe, a parcel after the post office, takeout after the restaurant, and a pet-store bag after the pet store.
- The visible shiba now uses a custom cartoon side-profile SVG in the DOM layer, tuned to read clearly and feel appealing at gameplay size instead of relying on the earlier imported clipart profile.
- The visible shiba asset is now built from real layered body, head, tail, front-leg, and rear-leg parts so the motion can animate naturally without crop-based fake slices.
- The shiba presentation adds a visible collar and ring so the leash target reads clearly at the neck.
- The earlier fake extra leg hints were removed so the profile no longer shows duplicated limbs around the visible character art.
- The custom shiba keeps the connected ears and cinnamon-roll tail from the intended silhouette while presenting them in a softer cartoon style.
- Shiba motion is restrained to a slight body bob, gentle tail sway, and one front plus one rear leg swing so the walk reads cleaner at side-scrolling game scale.
- Cats and passing dogs now render as reusable animated SVG encounter layers above the Pixi stage instead of the older Pixi vector animal passes.
- Cat event art uses a longer, cleaner feline silhouette with animated legs and now randomly rotates between the classic coat, an orange tabby palette, and a white palette.
- Passing dog art uses a muted shepherd-like animated profile instead of the earlier simplified cartoon pass.
- The paused passing-dog pose now sits slightly lower while stopped so the nose-to-nose greeting still reads as a brief sniff before it moves on.
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
- The leash-holding arm stays steadier and the leash curve leaves the hand in the current facing direction so the line does not peel away from the visible hand during turns.
- Cats and passing dogs travel on a slightly higher back lane and render behind the walker and shiba.
- Walker and shiba motion use shared stride-phase animation driven by gameplay state, while the animated encounter cat and dog art use restrained DOM/SVG bobbing on top of gameplay-driven positioning.

### Level 1 Mechanics

- Shiba default mood system with weighted tendencies.
- Default behavior usually favors moving toward the current destination.
- Mood outcomes include moving right fast, moving right slowly, stopping, moving left slowly, and moving left fast.
- Random stubborn streak event that overrides normal mood and changes direction unpredictably.
- Cat event that can run either direction and pulls shiba toward the cat's current position on screen, so she still chases it while it is in front of her.
- Cats call out with a `MEOW!` bubble while still at a short distance on approach, and then again once they are moving away and slightly clear of the shiba.
- Whenever the cat or dog callout appears, the shiba automatically yips back with an on-screen reaction bubble.
- Rain event that biases shiba back toward familiar ground.
- Passing dog event that makes shiba want to stop, turns nose-to-nose on the visible front side of the shiba, waits there anchored to the ground for about two seconds, and then continues its own journey.
- Passing dogs call out with a `BARK!` bubble while still approaching, and then bark again once they are departing and slightly away from the shiba.
- Continuous pull mechanic where the player can apply leash force in either horizontal direction.
- Pull force decays quickly while held and recovers while resting.
- Treat mechanic with 5 starting treats.
- Special action: `Shiba Scream`, which is visual-only and just shows an on-screen yip bubble without changing movement, events, or overall game state.
- Treat pickups along the level that replenish treats.
- Using a treat shows a visible treat toss from the walker toward the shiba.
- Distance and progress tracking update to the current destination for the active level.
- The walk continues straight into the next randomized destination instead of resetting or cutting away.
- The next destination after the park is randomized each run by shuffling the remaining destination pool.
- Final win state is at whichever destination ends the current randomized route.
- Completing a level now triggers a transparent in-stage completion overlay for roughly three seconds before fading back to the normal HUD.

### Controls

- Keyboard left pull: `A` or `Left Arrow`.
- Keyboard right pull: `D`, `Right Arrow`, or `Space`.
- Keyboard brace: `S` or `Down Arrow`.
- Keyboard treat: `W`, `E`, or `Up Arrow`.
- Keyboard scream: `Q`.
- Keyboard restart: `R`.
- On-screen pull controls are shown as left and right arrow buttons with generic directional labels.
- Debug-only on-screen `Cat` and `Dog` buttons can manually trigger those encounter events for art and behavior testing.
- The control copy explains the horizontal pull directions without tying them to only one destination.

## Current Tuning

- Pulling is strong enough to overcome normal resistance for short stretches.
- Pull strength deteriorates as the force meter drains.
- Treats temporarily increase willingness to move toward the current destination.
- Random events spawn during the walk and can temporarily override or dampen normal movement.
- Leg animation timing is intentionally slowed down so walking reads more natural and less frantic.
- Walker and shiba gait timing uses a capped visual-speed mapping so sudden velocity spikes do not cause unnaturally fast leg motion.
- Walker and shiba gait timing now snaps to a few slow visual gait bands instead of retiming every frame from raw velocity, which prevents occasional bursts of overly fast leg motion.
- Walker, shiba, and event-animal gait phases are now advanced in game state from ground-relative speed, so limbs freeze cleanly when motion relative to the road stops.
- Walker and shiba only animate when they are actually moving relative to the ground; if ground motion drops below the idle threshold, their legs, body bob, and idle motion all pause together.
- Cat events stay on screen long enough to fully run from one side of the play area to the other.
- The old event legend chips were removed because they read as unclear debug-style labels instead of useful player-facing information.

## Layout Requirements Implemented

- The playfield is the main visual focus.
- A compact level tag and the full stat strip are rendered together in one top row inside the stage, offset away from the near-edge route marker so it stays visible.
- Stats are rendered at the top inside the stage as compact overlays in that shared row.
- The top HUD automatically switches to the current route title for the active randomized level, and the destination stat tracks the active route goal.
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
- The production HTML entry point is served with `Cache-Control: no-store, max-age=0, must-revalidate` through `vercel.json`, while hashed assets continue to be cache-safe.
- Release keyword: whenever the user says `PUBLISH`, it means to commit the current work if needed, push the current branch to the GitHub remote, let the Vercel deployment run, verify the result, and report the live URL back.
- For production release requests, `PUBLISH` should push the latest work to `main` so `https://miwa-walk.vercel.app` updates.
- A `PUBLISH` request is not complete until the remote push succeeds and the Vercel deployment status has been checked.

## Near-Term Next Steps

- Improve realism further with richer character illustration passes or frame-based sprite sheets.
- Add destination intro and outro states for home and park.
- Add collectible feedback, sound, and stronger level-specific storytelling.
- Add more nuanced leash physics and directional animation blending.
