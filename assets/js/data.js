/* ============================================================
   ANDREWS TX PICKLEBALL — TOURNAMENT DATA
   ============================================================
   This is the ONLY file you should need to edit to add a new
   tournament, open/close sign-ups, or post results.

   Full instructions (with copy/paste steps) are in
   HOW-TO-UPDATE.md in the main folder.

   QUICK RULES:
   - Every tournament is one { ... } block inside the
     TOURNAMENTS array below.
   - Separate each block with a comma.
   - Keep the quote marks " " around any text.
   - "status" controls where it shows up on the site:
       "upcoming"  -> shows on Home + Tournaments page, sign-up button active
       "closed"    -> shows on Tournaments page, sign-up button disabled
                      (the pop-up will automatically say registration is
                      closed and that all "teamsLimit" spots are filled)
       "completed" -> shows on Results page
   - Dates use YYYY-MM-DD format (e.g. 2026-09-12).
   - Clicking a tournament card (or a result) opens a pop-up window
     right on the page. "details" below is free text for that
     pop-up — put whatever you want there: rules for that specific
     event, what to bring, parking info, refund policy, etc. Leave
     a blank line between paragraphs and it'll format nicely.
   - If you don't have something yet (like results), leave it
     as null or an empty [] list — the site will handle it.
   - "teamsRegistered" is how many teams have signed up so far.
     Update this number by hand whenever someone signs up (Google
     Forms doesn't tell the site automatically). The site shows
     "X/Y teams · Z spots left" everywhere this tournament shows
     up — homepage, tournaments page, and its pop-up. Set it to
     null if you don't want to show a count for that tournament.
   ============================================================ */

/* ============================================================
   HOMEPAGE PHOTO CAROUSEL
   ============================================================
   These photos rotate one at a time in the big photo box near
   the top of the Home page. Add, remove, or reorder freely —
   just keep each line in quotes and separated by a comma.

   To add a new photo:
   1. Drop the image file into assets/img/hero/
   2. Add a new line below with its filename, e.g.
      "assets/img/hero/my-new-photo.jpg",
   ============================================================ */

const HERO_PHOTOS = [
  "assets/img/hero/hero-01.jpg",
  "assets/img/hero/hero-02.jpg",
  "assets/img/hero/hero-03.jpg",
  "assets/img/hero/hero-04.jpg",
  "assets/img/hero/hero-05.jpg",
  "assets/img/hero/hero-06.jpg",
  "assets/img/hero/hero-07.jpg",
  "assets/img/hero/hero-08.jpg",
  "assets/img/hero/hero-09.jpg",
  "assets/img/hero/hero-10.jpg",
  "assets/img/hero/hero-11.jpg",
  "assets/img/hero/hero-12.jpg",
  "assets/img/hero/hero-13.jpg",
  "assets/img/hero/hero-14.jpg",
  "assets/img/hero/hero-15.jpg",
  "assets/img/hero/hero-16.jpg",
  "assets/img/hero/hero-17.jpg",
];

const TOURNAMENTS = [

  {
    id: "golden-pickle-2026",
    name: "The Golden Pickle",
    status: "completed",              // this one already happened
    date: "2026-07-11",
    dateDisplay: "July 11, 2026",
    location: "Andrews, TX Pickleball Courts",
    format: "Doubles",
    teamsLimit: 36,
    teamsRegistered: 36,              // how many teams signed up, out of teamsLimit — shows as "X/Y teams" wherever this tournament appears
    description:
      "The tournament that started it all. One day, one court, and the first-ever Golden Pickle champions of Andrews, Texas.",
    signupUrl: null,                  // sign-up is closed, tournament is over
    signupEmbed: null,
    details:
      "Our very first tournament! Played as a single-elimination doubles " +
      "bracket, best 2-out-of-3 games to 11, win by 2, right here on the " +
      "Andrews, TX Pickleball Courts.\n\n" +
      "Thanks to everyone who came out and played — see the full results " +
      "and podium below, or head over to the Results page any time.",
      // Edit this however you like — it shows in this tournament's pop-up
      // on the Tournaments page. Leave a blank line for a new paragraph.

    // ---- RESULTS -------------------------------------------------
    results: {
      summary: "36 teams battled it out on the very first Golden Pickle. Congratulations to our winners!",
      champions: {
        team: "Ball Busters",
        players: ["Hagen Tuck", "Ej Lopez"],
        photo: "assets/img/results/golden-pickle-2026/first_place.jpg"
      },
      runnerUp: {
        team: "Team Kenobi",
        players: ["Kyle Covington", "Jackson Ortiz"],
        photo: "assets/img/results/golden-pickle-2026/second_place.jpg"
      },
      thirdPlace: {
        team: "Team Critic",
        players: ["Angel Flores", "Faryah Nasrudin"],
        photo: "assets/img/results/golden-pickle-2026/third_place.jpg"
      },
      standings: [],                  // e.g. [{ place: 4, team: "...", players: ["...", "..."] }]
      bracketImageUrl: null,          // optional link to a photo of the bracket
      photosUrl: null                 // optional link to a photo album
    }
  },
   //Jb Productions Tournament
   {
    id: "jb-tournment",
    name: "JB Productions Tournament",
    status: "completed",
    date: "2026-08-08",
    dateDisplay: "August 8, 2026",
    location: "Andrews, TX Pickleball Courts",
    format: "Doubles",
    teamsLimit: 32,
    teamsRegistered: 23,               // how many teams signed up, out of teamsLimit — shows as "X/Y teams" wherever this tournament appears
    description: "This is a doubles tournament hosted by JB Productions",
    signupUrl: null,   // use this OR signupEmbed, not both
    signupEmbed: "https://docs.google.com/forms/d/e/1FAIpQLSfNFXLJHYspUglWP-Jmmj4C8QFT7SYpGcJzEnk9lx3MsOzJew/viewform?embedded=true",   // e.g. "https://docs.google.com/forms/d/e/xxxxx/viewform?embedded=true" — shows inside the pop-up when someone taps "Sign Up Your Team"
    details:
       "This tournament has a limit of 32 teams.\n\n" +
       "The cost to register is $35 per team.\n\n" +
       "Prizes will be awarded for 1st, 2nd, and 3rd place.\n\n" +
       "All other rules can be found on the Rules page at the top right of the website.\n\n" +
       "Please reach out if you have any questions!",

    results: {
      summary: "",
      champions: {
        team: null,
        players: ["Kayley Jennings", "Aaron Wiederstein"],
        photo: null   // add later, e.g. "assets/img/results/jb-tournment/first.jpg"
      },
      runnerUp: {
        team: "Pickle Ticklers",
        players: ["Brycen Diaz", "Juan Hernandez"],
        photo: null   // add later, e.g. "assets/img/results/jb-tournment/second.jpg"
      },
      thirdPlace: {
        team: "Angel x2",
        players: ["Angel Ramos", "Angel Flores"],
        photo: null   // add later, e.g. "assets/img/results/jb-tournment/third.jpg"
      },
      standings: [],     // extra placements beyond top 3, e.g. [{ place: 4, team: "...", players: ["...", "..."] }]
      bracketImageUrl: null,
      photosUrl: null
    }
  },
     {
    id: "animalshelter",
    name: "Andrews Animal Shelter Pickleball Tournament",
    status: "upcoming",
    date: "2026-09-12",
    dateDisplay: "September 12, 2026",
    location: "Andrews, TX Pickleball Courts",
    format: "Doubles",
    teamsLimit: 32,
    teamsRegistered: 0,                // how many teams signed up, out of teamsLimit — shows as "X/Y teams" wherever this tournament appears
    description: "This is a doubles tournament for charity, hosted by Andrews Animal Shelter",
    signupUrl: null,   // use this OR signupEmbed, not both
    signupEmbed: "https://docs.google.com/forms/d/e/1FAIpQLSd6J0VEAyuHK5rMOVBvWkFqhlYRXp-tmE0a4z-vsdcTX8cdYg/viewform?embedded=true",   // e.g. "https://docs.google.com/forms/d/e/xxxxx/viewform?embedded=true" — shows inside the pop-up when someone taps "Sign Up Your Team"
    details:
      "A doubles tournament for a great cause — every dollar of entry fees goes straight to the Andrews TX Animal Shelter.\n\n" +
      "Entry fee is $40 per team.\n\n" +
      "Prizes will be awarded for 1st, 2nd, and 3rd place.\n\n" +
      "Spots are limited to 32 teams max and will be filled on a first-come, first-served basis, so don't wait to sign up.\n\n" +
      "Please note: your registration isn't considered submitted until payment has been received.\n\n" +
      "All other rules can be found on the Rules page at the top right of the website.",
    results: {
      summary: "",
      champions: null,   // { team: "...", players: ["...", "..."], photo: "assets/img/results/your-id/first.jpg" }
      runnerUp: null,    // { team: "...", players: ["...", "..."], photo: "assets/img/results/your-id/second.jpg" }
      thirdPlace: null,  // { team: "...", players: ["...", "..."], photo: "assets/img/results/your-id/third.jpg" }
      standings: [],     // extra placements beyond top 3, e.g. [{ place: 4, team: "...", players: ["...", "..."] }]
      bracketImageUrl: null,
      photosUrl: null
    }
  },

  /* ------------------------------------------------------------
     TEMPLATE — copy this whole block to add your NEXT tournament.
     Paste it above this comment (inside the [ ] brackets, with a
     comma after the block before it), then fill in the details
     and change status to "upcoming".
  ------------------------------------------------------------

  {
    id: "unique-short-name-2026",
    name: "Tournament Name",
    status: "upcoming",
    date: "2026-01-01",
    dateDisplay: "Month Day, Year",
    location: "Andrews, TX Pickleball Courts",
    format: "Doubles",
    teamsLimit: 28,
    teamsRegistered: 0,                // how many teams signed up so far — the site shows "X/Y teams · Z spots left" automatically wherever this tournament appears. Set to null if you don't want to track/show this.
    description: "One or two sentences about this tournament — shows on the card AND at the top of its pop-up.",
    signupUrl: "https://forms.gle/your-google-form-link",   // use this OR signupEmbed, not both
    signupEmbed: null,   // e.g. "https://docs.google.com/forms/d/e/xxxxx/viewform?embedded=true" — shows inside the pop-up when someone taps "Sign Up Your Team"
    details:
      "Anything else you want players to see in the pop-up. Entry fee, " +
      "what to bring, parking, refund policy — whatever you want.\n\n" +
      "Leave a blank line (like above) to start a new paragraph.",
    results: {
      summary: "",
      champions: null,   // { team: "...", players: ["...", "..."], photo: "assets/img/results/your-id/first.jpg" }
      runnerUp: null,    // { team: "...", players: ["...", "..."], photo: "assets/img/results/your-id/second.jpg" }
      thirdPlace: null,  // { team: "...", players: ["...", "..."], photo: "assets/img/results/your-id/third.jpg" }
      standings: [],     // extra placements beyond top 3, e.g. [{ place: 4, team: "...", players: ["...", "..."] }]
      bracketImageUrl: null,
      photosUrl: null
    }
  },

 //You can use "Upcoming" , "Closed" "Completed" for tournment status.

  ------------------------------------------------------------ */

];
