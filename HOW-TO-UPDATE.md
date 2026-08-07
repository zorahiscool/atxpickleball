# How to update the site

Everything you'll need to change lives in **one file**:

```
assets/js/data.js
```

You do not need to touch any of the `.html` files to add a tournament, open sign-ups, post results, or change the homepage photos.

You can edit this file two ways:
1. **On GitHub.com** — open `assets/js/data.js` in your repo, click the pencil (✏️) icon, edit, then click "Commit changes." The live site updates within a minute or two.
2. **Ask Claude** — paste this file's contents (or the relevant part) into Claude and describe what you want changed. It's plain text, so this works great.

---

## Change the homepage photo carousel

Near the top of `assets/js/data.js` is a list called `HERO_PHOTOS` — these are the photos that rotate one at a time in the big photo box on the Home page.

To add a photo: drop the image file into `assets/img/hero/`, then add a new line to the list with its filename, e.g. `"assets/img/hero/my-new-photo.jpg",`
To remove a photo: delete its line from the list.
To reorder them: rearrange the lines — they play in the order they're listed.

---

## Add a new upcoming tournament

1. Open `assets/js/data.js`.
2. Scroll down to the block that starts with `/* ------ TEMPLATE ------ */`.
3. Copy the whole `{ ... }` example block underneath it.
4. Paste it **above that comment**, inside the `TOURNAMENTS = [ ... ]` list — right after the closing `}` of the last real tournament, with a comma between them.
5. Fill in the details:

| Field | What it means |
|---|---|
| `id` | A short, unique, no-spaces name, e.g. `"fall-smash-2026"`. Used internally, never shown to visitors. |
| `name` | The tournament's real name, e.g. `"The Fall Smash"`. |
| `status` | `"upcoming"` so it shows up with an active sign-up button. |
| `date` | `"2026-09-12"` format — used for sorting and countdowns. |
| `dateDisplay` | How it should read on the page, e.g. `"September 12, 2026"`. |
| `location` | Where it's happening. |
| `format` | e.g. `"Doubles"`, `"Mixed Doubles"`. |
| `teamsLimit` | Number of teams the field is capped at. |
| `teamsRegistered` | How many teams have signed up so far. Set to `0` to start, and bump it up as teams register. Set to `null` if you don't want a spots-left count shown for this tournament. |
| `description` | One or two sentences shown on the card. |
| `signupUrl` | The link to your Google Form. Put it in quotes: `"https://forms.gle/xxxxxxx"`. |
| `signupEmbed` | Leave as `null` unless you want the Google Form to appear inline on the page instead of opening in a new tab — see below. |

6. Save / commit. Done — it'll now appear on the Home page and the Tournaments page automatically, sorted by date.

---

## Updating how many spots are left

Every tournament has a `teamsRegistered` field, right under `teamsLimit`. Whenever a new team signs up (Google Forms won't update this for you — you have to bump the number by hand), change it to the current count, e.g.:

```js
teamsRegistered: 8,   // 8 teams signed up so far, out of teamsLimit
```

The site automatically shows this as **"8/32 teams · 24 spots left"** everywhere that tournament appears — the homepage's "Next Up" box, its card on the Tournaments page, and its Details pop-up. Once `teamsRegistered` reaches `teamsLimit`, it'll switch to showing **"Full"** with a 🔴 marker instead.

If you don't want to bother tracking/showing a count for a given tournament, set it to `null` and the site will just show the field size (e.g. "32 teams") like before.

### Want the Google Form to show up right on the page instead of a new tab?
In Google Forms, click **Send → the `<>` embed icon**, copy the `src="..."` link from the code it gives you, and paste that link as `signupEmbed` (keep `signupUrl` filled in too, as a backup).

---

## Add a first-round match schedule (courts & times)

If you want players to see who they're playing first, and on which court/at
what time, add a `schedule` block to that tournament in `assets/js/data.js`.
It shows up as a "First-Round Schedule" section inside that tournament's
pop-up, underneath the details. This is just a schedule — it doesn't run a
bracket for you, so it pairs well with an app like Scoreholio for tracking
who advances after round 1.

```js
schedule: {
  note: "First-round matchups only — after that, follow your bracket on Scoreholio for your next match and court.",
  rounds: [
    {
      time: "8:45 AM",
      matches: [
        { court: 1, team1: "Team A", team2: "Team B" },
        { court: 2, team1: "Team C", team2: "Team D" },
        { court: 3, team1: "Team E", team2: "Team F" }
      ]
    },
    {
      time: "9:25 AM",
      matches: [
        { court: 1, team1: "Team G", team2: "Team H" }
      ]
    }
  ]
}
```

- `note` is optional free text shown above the schedule (e.g. pointing people
  to Scoreholio, or explaining pool play). Leave it out (delete the line) if
  you don't want one.
- Each item in `rounds` is one time slot — give it a `time` and a list of
  `matches` happening at that time, one per court.
- To figure out how many rounds you need: (number of teams ÷ 2) ÷ number of
  courts, rounded up. E.g. 20 teams = 10 matches; on 3 courts that's 4 rounds.
- Leave the `schedule` field out entirely (or delete the block) for
  tournaments where you don't want a schedule shown.

---

## Close sign-ups for a tournament

Change that tournament's `status` from `"upcoming"` to `"closed"`. It'll still show on the Tournaments page, but the sign-up button will read "Registration Closed."

---

## Post results after a tournament

1. Find that tournament's block in `assets/js/data.js`.
2. Change `status` to `"completed"`.
3. Fill in the `results` section:

```js
results: {
  summary: "A short recap sentence or two, if you want one.",
  champions: { team: "Kitchen Crashers", players: ["Jane D.", "Sam R."], photo: "assets/img/results/your-tournament-id/first.jpg" },
  runnerUp:  { team: "Dink or Swim",      players: ["Alex P.", "Casey M."], photo: "assets/img/results/your-tournament-id/second.jpg" },
  thirdPlace: { team: "Paddle Pals",      players: ["Sam T.", "Robin K."], photo: "assets/img/results/your-tournament-id/third.jpg" },
  standings: [
    { place: 4, team: "Fourth Team Name", players: ["Name One", "Name Two"] }
  ],
  bracketImageUrl: "https://link-to-a-photo-of-the-bracket.jpg",  // optional, or null
  photosUrl: "https://link-to-a-google-photos-album",              // optional, or null
}
```

**Adding winner photos:** drop the image files into `assets/img/results/<tournament-id>/` (make a new folder named after that tournament's `id`), then point `photo` at that path, e.g. `"assets/img/results/fall-smash-2026/first.jpg"`. Photos are optional — leave `photo` out entirely and the card just won't show one.

You don't have to fill in every field — leave anything you don't have as `null` (for `champions`/`runnerUp`/`thirdPlace`) or `[]` (for `standings`), and the site will just skip it gracefully.

4. Save / commit. It now appears on the Results page, and on the Home page's "Recent Results" preview.

---

## Uploading this whole site to GitHub

1. Unzip the folder you downloaded.
2. Create a new repository on GitHub (or use your existing one).
3. Drag every file and folder **inside** the unzipped folder (not the folder itself) into the GitHub upload page — that means `index.html`, `tournaments.html`, `results.html`, `rules.html`, `assets/`, and this file.
4. Commit.
5. In the repo's **Settings → Pages**, set it to deploy from your main branch, root folder.
6. Point your `andrewstxpickleball.net` domain at it the same way you did for the old site (Settings → Pages → Custom domain).

That's it — the site is fully static, so there's no build step, no server, and nothing to install.
