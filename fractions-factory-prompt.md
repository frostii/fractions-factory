# Claude Code Prompt: "The Fractions Factory"

## Overview

Build an educational fractions game called **"The Fractions Factory"** as a single React JSX artifact. The game teaches 8–10 year olds about fractions through an Overcooked-inspired top-down factory game where the player picks up food, cuts it into fractional pieces at cutting tables, and boxes the correct number of pieces to fulfil orders.

The entire game must be a single `.jsx` file using only libraries available in Claude artifacts: React (with hooks), Tailwind CSS utility classes, and optionally lucide-react for icons. No external images — all graphics are drawn with SVG/CSS. No localStorage or sessionStorage.

---

## Visual Style & Aesthetic

**Cartoon factory style** — bright, bold, cheerful, suitable for 8–10 year olds:

- **Colour palette**: Vibrant primary colours with warm accents. Factory floor in a warm beige/light wood tone. Walls in a cheerful teal or blue. Machines in bold reds, yellows, greens. Use CSS variables for theming.
- **Character**: A simple top-down cartoon chef/worker — a circle for the head, a coloured body, small limbs. Should have a visible "carrying" state (item shown above their head). Animate a small bobbing motion when walking.
- **Food items**: Drawn as SVG. Round items (pie, pizza, apple, orange, cake) are circles with simple decorative details (e.g., pie has a lattice pattern, pizza has pepperoni dots). Rectangular items (bread, cucumber, chocolate bar, butter block, flapjack) are rounded rectangles with simple textures. Use cheerful, appetising colours.
- **Factory elements**: Conveyor belt with animated chevrons/stripes. Cutting tables as rectangles with a knife icon and a large bold number showing the denominator. Boxing area with a box icon. Bin with a rubbish bin icon. All drawn with thick outlines (2–3px), slightly rounded corners, cartoon style.
- **Typography**: Use a rounded, friendly font — import "Fredoka One" or "Baloo 2" from Google Fonts for headings/numbers, and a clean sans-serif for body text. Numbers on cutting tables should be large and very readable.
- **UI feel**: Popups should have rounded corners, drop shadows, and a slight scale-in animation. Buttons should be large, colourful pill shapes with hover effects. Stars should be gold with a sparkle animation when awarded.

---

## Factory Floor Layout

The entire factory is visible on one screen (no scrolling). Design for a landscape viewport of roughly 900×600px game area.

Top-down layout (approximate):

```
┌──────────────────────────────────────────────────┐
│                    FACTORY FLOOR                  │
│                                                   │
│  ┌─────────┐                        ┌──────────┐ │
│  │CONVEYOR │  ┌────┐  ┌────┐       │  BOXING  │ │
│  │  BELT   │  │ T1 │  │ T2 │       │   AREA   │ │
│  │ >>>     │  │    │  │    │       │          │ │
│  │ >>>     │  └────┘  └────┘       └──────────┘ │
│  │ >>>     │                                     │
│  └─────────┘  ┌────┐  ┌────┐       ┌──────────┐ │
│               │ T3 │  │ T4 │       │   BIN    │ │
│               │    │  │    │       │          │ │
│               └────┘  └────┘       └──────────┘ │
│                                                   │
│                    [PLAYER]                       │
│                                                   │
└──────────────────────────────────────────────────┘
```

- T1–T4 are the four cutting tables. Each displays a large number (the denominator it cuts into).
- The conveyor belt is on the left side, with animated stripes moving right to indicate direction.
- The boxing area and bin are on the right side.
- The player character can move freely around the open floor space between these stations.

---

## Game States & Flow

The game has these major states:

### 1. Title Screen
- Game title "The Fractions Factory" in large cartoon letters.
- A fun factory illustration or the factory floor in the background.
- "Start Game" button.
- Level select (Levels 1–5, locked until previous level completed, except Level 1).

### 2. Level Start
- Brief popup: "Level X — [level name]" with the cutting table denominators shown.
- Each level has 5 orders to complete.
- Show current order number (e.g., "Order 1 of 5").

### 3. Active Gameplay (factory floor)
- The player sees the factory floor and can move their character with arrow keys.
- An order panel is always visible at the top of the screen showing the current order (e.g., "The manager needs: 5/3 of a pie" with a small illustration).
- The player interacts with stations by standing adjacent to them for 1 second (show a circular progress indicator around the character while waiting).

### 4. Cutting Screen (popup overlay)
- Triggered when the player stands next to a cutting table while carrying food.
- Full overlay showing a large version of the food item with guide lines.
- See detailed cutting mechanics below.

### 5. Order Result
- Popup showing whether the order was correct or incorrect.
- If correct: congratulations message, stars awarded, confetti animation, "Next Order" button.
- If incorrect: kind explanation of what went wrong (e.g., "You delivered 4 pieces cut into thirds — that's 4/3. But the order was for 5/3. You needed one more piece! Try again."), "Try Again" button (same order restarts).

### 6. Level Complete
- Shown after all 5 orders in a level are completed.
- Total stars earned (out of 15 max).
- "Next Level" / "Replay" / "Menu" buttons.

---

## Player Movement & Interaction

- **Arrow keys** move the player character in 4 directions on the factory floor.
- The player moves on a continuous coordinate system (not tile-based snapping), but collision detection prevents walking through stations/walls.
- Movement speed: moderate — the factory is small so the player shouldn't need to rush.
- **Interaction trigger**: When the player is adjacent to (within ~10px of) a station and remains still for 1 second, the interaction fires. Show a circular progress ring around the player during this wait. If the player moves before 1 second, the progress resets.

### Station interactions:

**Conveyor belt** (requires: player not carrying anything):
- Picks up the food item specified by the current order.
- The item appears above the player's head (carrying state).
- If the player is already carrying something, nothing happens (show a small tooltip: "Hands full!").

**Cutting table** (requires: player carrying uncut food):
- Opens the cutting screen overlay.
- If the player is carrying already-cut pieces (not a whole item), nothing happens (tooltip: "Already cut!").

**Boxing area** (requires: player carrying cut pieces):
- Deposits carried pieces into the box.
- Shows a popup with the box contents so far (visual of all deposited pieces) and two buttons: "Commit Order" and "Keep Working".
- "Keep Working" closes the popup — the player can go get more food.
- "Commit Order" triggers the order check.

**Bin** (requires: player carrying something):
- Discards whatever the player is carrying.
- Brief animation of items going into the bin.
- Player is now empty-handed and can collect a new item from the conveyor.

---

## Cutting Screen Mechanics (CRITICAL — core learning mechanic)

When the cutting screen overlay opens:

### Display
- Show the food item large and centred.
- **Round food**: Draw as a large circle (diameter ~300px). Show radial lines from centre to edge. The CORRECT lines divide the circle into equal sectors matching the table's number. Also show DECOY lines at incorrect positions.
- **Rectangular food**: Draw as a large rounded rectangle (~400×150px). Show vertical parallel lines. The CORRECT lines divide the rectangle into equal horizontal strips matching the table's number. Also show DECOY lines at incorrect positions.

### Lines
- All lines (correct + decoys) are shown in the SAME style initially — thin dashed grey lines.
- The number of CORRECT cut lines = table number − 1 (e.g., table "3" has 2 correct lines creating 3 equal pieces).
- The number of DECOY lines: 1–2 at easy levels, 2–4 at harder levels. Decoy lines should be plausible but wrong (e.g., for thirds, a decoy might be at the halfway point or quarter point).
- The player can only make exactly (table number − 1) cuts. This means they must choose wisely. Show a counter: "Cuts remaining: X".

### Cutting interaction
- The player clicks on a line to "cut" along it. When clicked, the line turns bold and coloured (e.g., red) and "Cuts remaining" decreases by 1.
- Clicking a cut line again un-cuts it (toggles), restoring a cut.
- When all cuts are used, a "Done Cutting" button becomes active.

### Piece selection
- After clicking "Done Cutting", the food visually splits into pieces along the cut lines.
- The pieces separate slightly with a small animation so each piece is distinct.
- The instruction changes to: "Click the pieces you want to take" (and shows count: "Selected: 0").
- Clicking a piece toggles it selected (highlighted with a green glow) or deselected.
- Two buttons: "Take Selected" and "Cancel" (puts everything in bin, go back to floor).
- If they select 0 pieces and click "Take Selected", warn: "You haven't selected any pieces! Everything will go to the bin."

### What the player carries after cutting
- The player now carries N cut pieces (visually shown as small piece icons above their head).
- The remaining (unselected) pieces are conceptually discarded (bin).

---

## Order Checking Logic

When the player clicks "Commit Order" at the boxing area:

1. Check all deposited pieces: they must all be from the same denominator (same size cuts) and the total count must match the numerator of the ordered fraction.
2. **Correct**: e.g., order is 5/3, player deposited 5 pieces each cut into thirds → correct.
3. **Incorrect cases** (provide specific feedback):
   - Wrong denominator: "You cut the food into [X] pieces, but the order needed [Y]ths."
   - Wrong numerator: "You delivered [X] pieces of [Y]ths — that's [X]/[Y]. But the order asked for [A]/[B]."
   - Mixed denominators: "The pieces aren't all the same size! Make sure you cut everything at the same table."

---

## Levels & Difficulty

### Level 1: "Getting Started" ⭐
- Cutting tables: **2, 3, 4, 5**
- Orders: unit fractions only, proper fractions (e.g., 1/2, 2/3, 3/4)
- Decoy lines on cutting screen: 1
- Food: simple items (pie, bread)

### Level 2: "Warming Up" ⭐
- Cutting tables: **2, 4, 5, 8**
- Orders: proper fractions, non-unit (e.g., 3/4, 5/8, 3/5)
- Decoy lines: 1–2
- Food: more variety

### Level 3: "Getting Busy" ⭐⭐
- Cutting tables: **3, 4, 6, 8**
- Orders: mix of proper fractions and simple improper fractions (e.g., 5/3 — requiring 2 items)
- Decoy lines: 2
- Food: full variety

### Level 4: "Expert Baker" ⭐⭐⭐
- Cutting tables: **3, 5, 7, 10**
- Orders: improper fractions (e.g., 8/5, 11/7)
- Decoy lines: 2–3
- Food: full variety

### Level 5: "Master Chef" ⭐⭐⭐
- Cutting tables: **4, 7, 11, 12**
- Orders: improper fractions with larger numerators (e.g., 15/7, 9/4)
- Decoy lines: 3–4
- Food: full variety

### Star system
- Stars per order are based on the level's inherent difficulty (the ⭐ rating shown above): Level 1–2 orders award 1 star each, Level 3 orders award 2 stars each, Level 4–5 orders award 3 stars each.
- Stars are only awarded on first successful attempt (retries still let you complete the order but award 0 stars for that order).
- Display total stars prominently on the level complete screen.

---

## Order Generation Rules

For each level, generate 5 orders procedurally:
- The denominator must match one of the level's cutting table numbers.
- For proper fractions: numerator < denominator, numerator ≥ 1.
- For improper fractions: numerator > denominator, but keep it reasonable — the player should need at most 3 whole food items (so numerator ≤ 3 × denominator).
- Never generate fractions that simplify to a whole number (e.g., no 4/2 or 6/3).
- Randomly select a food item for each order from the food pool, alternating between round and rectangular.

---

## Food Items

### Round food (rendered as circles with radial cutting):
1. **Pie** — golden brown fill, lattice pattern on top, crimped edge
2. **Pizza** — yellow/orange fill, small red pepperoni circles, green herb flecks
3. **Apple** — red circle with a small brown stem and green leaf at top
4. **Orange** — orange fill with small dimple texture dots
5. **Cake** — pink/cream fill with decorative swirl lines, cherry on top

### Rectangular food (rendered as rounded rectangles with parallel cutting):
1. **Bread loaf** — golden brown fill with score lines on top
2. **Cucumber** — green fill with lighter green inner area and small seed dots
3. **Chocolate bar** — dark brown fill with grid-line squares pattern
4. **Butter block** — pale yellow fill with foil wrapper lines on the ends
5. **Flapjack** — golden/oat-coloured fill with a slightly rough texture pattern

Each food item should be recognisable at both small size (carried by player, ~20×20px) and large size (cutting screen, ~300px).

---

## UI Elements

### HUD (always visible during gameplay):
- Top-left: Current order ("Order 2 of 5")
- Top-centre: The order request in a speech-bubble style box ("The manager needs: 5/3 of a pie" with a small pie icon and the fraction written large)
- Top-right: Level name and star count so far
- Bottom: Subtle hint text that changes contextually (e.g., "Go to the conveyor belt to pick up food", "Stand next to a cutting table to cut", "Take your pieces to the boxing area")

### Popups:
- All popups are modal overlays with a semi-transparent dark backdrop.
- Popup boxes have thick rounded borders, a white/cream background, large text, and big colourful buttons.
- Animate in with a slight scale-up + fade.

### Contextual hints:
- Show subtle arrow indicators or pulsing highlights on the station the player should go to next (especially in Level 1).
- These hints should be helpful, not intrusive.

---

## Technical Implementation Notes

- Use `requestAnimationFrame` for the game loop (player movement, conveyor belt animation).
- Handle arrow key input with `keydown`/`keyup` event listeners. Track which keys are currently pressed for smooth diagonal movement (though the factory is small enough that diagonal isn't essential — just ensure holding a key produces continuous smooth movement).
- Use React state for game state management (current screen, player position, carrying state, box contents, current order, etc.).
- Draw the game world using absolutely-positioned `div`s or inline SVGs within a relatively-positioned game container.
- Popups/overlays are React components rendered conditionally on top of the game area.
- All food SVGs should be React components that accept a `size` prop.
- The cutting screen should use SVG for precise line positioning and click detection.

### Key state shape (suggestion):
```
gameState: 'title' | 'levelSelect' | 'playing' | 'cutting' | 'boxing' | 'result' | 'levelComplete'
currentLevel: number
currentOrderIndex: number
orders: Array<{ fraction: {num, den}, food: {name, type, shape} }>
player: { x, y, carrying: null | { food, pieces?, cutDenominator? } }
box: Array<{ food, cutDenominator }>  // pieces deposited so far
starsEarned: { [level]: number }
firstAttempt: boolean  // resets per order, false after first failure
```

---

## Important Constraints

1. **Single file**: Everything must be in one `.jsx` file with a default export.
2. **No localStorage / sessionStorage**: Store all state in React state. Game progress is lost on refresh (this is fine).
3. **No external images**: All graphics are SVG/CSS drawn in code.
4. **Available libraries only**: React, Tailwind utility classes, lucide-react. No other imports.
5. **No `<form>` tags**: Use `onClick` handlers for all interactions.
6. **Google Fonts**: Can import fonts via a `<style>` tag with `@import url(...)` at the top of the component.
7. **Responsive within reason**: Design for ~900×600px minimum. It's fine if it doesn't work on mobile.

---

## Summary of Player Journey (one order)

1. Popup: "The manager needs 5/3 of a pie!"
2. Pie appears on the conveyor belt.
3. Player walks to conveyor → stands still 1 sec → picks up pie.
4. Player walks to cutting table "3" → stands still 1 sec → cutting screen opens.
5. Cutting screen shows pie with 2 correct radial lines (for thirds) + 1 decoy line. Player clicks the 2 correct lines, clicks "Done Cutting". Pie splits into 3 pieces. Player selects 3 pieces (all of them), clicks "Take Selected".
6. Player walks to boxing area → stands still 1 sec → deposits 3 pieces. Popup shows 3/3 in the box. Player clicks "Keep Working" (needs 5/3 total).
7. Player walks back to conveyor → picks up another pie → cuts into thirds → selects 2 pieces.
8. Player walks to boxing area → deposits. Popup shows 5/3 (3 from before + 2 new). Player clicks "Commit Order".
9. Correct! Congratulations popup with stars and confetti. "Next Order" button.

Build this game with care and polish. The target audience is children — every interaction should feel clear, responsive, and encouraging. When in doubt, prioritise clarity and fun over complexity.
