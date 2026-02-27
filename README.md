# Fantasy MLS Draft Calculator

A single-page app to fetch and display points for your MLS fantasy draft team. Users select their roster from the left panel; the app aggregates points for the selected draft week, and provides an easy-to-copy lineup summary.

## How to Use
1. Open the app and sign in with your Kickbase account if prompted
2. MLS player scores will be retrieved from Kickbase for the division and matchday specified at the top
3. In the left panel, select each MLS player in your draft team starting lineup and any substitute players that need to be scored (don't select substitutes if all of your starters played)
4. The right panel updates with selected players and fetched points/minutes for the chosen week
5. If a player is a substitute, check the "Sub?" checkbox beside that player in the right panel
6. Click the `Copy Text` button to copy the formatted lineup to the clipboard for sharing

## Security & Privacy
- Kickbase token is stored locally
- No sensitive credentials are stored

## Tech Stack
- React + TypeScript
- AG Grid for data grids
- Bootstrap for styles
- Hosted via GitHub Pages (deploy script in package.json)