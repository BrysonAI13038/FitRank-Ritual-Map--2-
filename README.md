# FitRank

FitRank is a fitness progress tracker that lets users log workouts, earn ELO, climb ranks, and track their progress over time.

## Core Loop

Log workout → FitRank processes the workout → saves the workout → awards ELO → shows updated rank progress.

## Back-End Architecture

### Input

Users select exercises and enter weight, reps, and sets.

### Logic

FitRank saves workout history and compares new workouts with previous performance. A prototype ELO system rewards completing workouts, improvement, and personal bests. ELO never decreases.

### Output

After submitting a workout, FitRank shows the user's updated rank and animates the ELO progress bar toward the next rank.

### Data & Memory

Workout history and ELO are stored using localStorage. The data persists between sessions in the same browser.

### AI & APIs

The current mechanics prototype does not require AI or external API calls.

### Failure

The core workout loop does not depend on an external API, so API failure is not currently an issue. If browser storage is cleared, locally saved workout history and ELO will also be cleared.
