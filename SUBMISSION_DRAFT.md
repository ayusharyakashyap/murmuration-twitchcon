# Codex × TwitchCon Hackathon submission draft

## Project name

**Murmuration — One chat. One living thing.**

## Description

Murmuration turns Twitch chat into a living, shared organism on stream. Every viewer message releases a trail of light into an animated flock, and the room’s collective energy changes how that flock moves. Streamers choose a biome and add the transparent canvas to OBS as a browser source.

Viewers can awaken three rituals: `!gather` pulls the flock into orbit, `!bloom` releases a burst of color, and `!ripple` sends a wave across the field. A ritual only fires when three different chatters join within 45 seconds, making the moment belong to the room instead of the fastest typer. Murmuration also reads the room’s recent vocabulary into a live pulse. If a streamer opts in with an OpenAI API key, GPT turns a burst of chat into a short collective memory, without quoting individual messages.

The project uses Twitch OAuth and EventSub WebSockets to read live chat, the Helix API to identify the channel, and a lightweight local relay to carry events into OBS without putting the Twitch access token in the browser source. It is built with Node.js, vanilla JavaScript, and Canvas 2D. A fictional sandbox lets people explore the experience before they connect a channel.

We used OpenAI Codex to shape the experience, build its interface and animated canvas, and connect Twitch EventSub, the OBS relay, and optional AI narration into a runnable project.

## Demo video outline (about 2 minutes)

1. **0:00–0:15 — The idea.** Show the dashboard and describe the premise: chat is the current; viewers make one world together.
2. **0:15–0:40 — The canvas.** Show messages arriving from a connected Twitch channel and watch each spark enter the OBS overlay. Briefly switch biomes.
3. **0:40–1:10 — The chorus.** Have three distinct accounts send `!gather` (or `!bloom`) in the same Twitch chat. Show the count building, then the shared ritual awakening in the overlay.
4. **1:10–1:30 — The collective memory.** With narration enabled, let a few messages accumulate and show the short line that summarizes the room’s mood.
5. **1:30–1:50 — Codex.** Show this Codex thread and briefly point out the code areas Codex helped build: the Canvas flock, EventSub connection, local OBS relay, and AI route.
6. **1:50–2:00 — Close.** Show the transparent overlay over a game or stream scene and repeat the one-line pitch.

Before recording, replace the sandbox with a real Twitch channel and confirm the account used for authorization has permission to read that chat. Keep the Codex window visible for the short build walkthrough.

## YouTube upload metadata

**Title:** Murmuration — One Twitch Chat, One Living World | Codex × TwitchCon Hackathon

**Description:**

Murmuration turns Twitch chat into a shared, living flock. Three distinct chatters can awaken a ritual together, and optional OpenAI narration turns a burst of chat into a collective memory.

Built with OpenAI Codex for the Codex × TwitchCon Hackathon.

Code: https://github.com/ayusharyakashyap/murmuration-twitchcon

#Twitch #TwitchCon #OpenAI #Codex #Hackathon

## Submission checklist

- Public code repository URL: https://github.com/ayusharyakashyap/murmuration-twitchcon (or invite `testing@devpost.com` to a private GitHub or GitLab repository).
- Public YouTube demo video, maximum three minutes.
- This project description, adjusted if the final demo changes any features.
- Codex session ID for the thread where most of the project was built: `01a18d88-10dc-75f0-9293-d0e56111f9d3`.
