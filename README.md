# Murmuration

**One chat. One living thing.** Murmuration is a Twitch chat experience for OBS: each live message releases sparks into a shared, flocking field. When three different chatters use the same ritual within 45 seconds, the whole room creates a collective event.

## What makes it different

- **A visual organism, not a chat box.** Chat becomes motion, color and shared energy in a transparent browser-source overlay.
- **Rituals need a chorus.** `!gather`, `!bloom`, and `!ripple` only awaken when three distinct people join in within 45 seconds. One loud chatter can’t take over the room.
- **Chat creates a collective memory.** A live pulse is inferred from the room’s recent messages. Add an OpenAI API key to let GPT turn that burst into a single short, original line. AI narration is optional; the local pulse works without a key.
- **One click to try it.** The fictional sandbox chat is available on first launch, with no Twitch app or credentials required.

## Run it

Requires Node.js 18 or newer. No package install is needed.

```sh
node server.js
```

Open [http://localhost:4173](http://localhost:4173), then select **Play demo** to keep the sandbox chat moving. The first few demo messages are added automatically so a fresh screen is alive immediately.

## Connect a Twitch channel

1. Create a Twitch application at [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps).
2. Add `http://localhost:4173/` as an OAuth redirect URL. The app must be configured for the redirect URI you use.
3. In Murmuration, choose **Connect Twitch**, enter the app’s Client ID and the channel login, then continue with Twitch.
4. Authorize the **User Access Token** scope `user:read:chat`.

Murmuration uses the authenticated user’s ID and the selected channel’s ID to create a `channel.chat.message` EventSub subscription over Twitch’s WebSocket transport. For the simplest setup, connect as the owner of the channel you want to listen to. Twitch’s authorization and channel role requirements still apply. The token remains in memory in the dashboard page and is sent only to Twitch’s Helix API and EventSub service. This app does not store it.

For a deployed build, replace the localhost OAuth redirect URI with the app’s HTTPS URL and register that URL in the Twitch developer console. Keep the app served from one origin so its small AI proxy route works.

## Add AI narration (optional)

Open **Connect Twitch** and expand **Add an OpenAI key for AI narration**. Add an API key and connect or keep using the demo. Once enough messages arrive, Murmuration sends the latest 16 chat lines through the local `/api/interpret` route to OpenAI’s Responses API (`gpt-4.1-mini`) and displays one short collective-memory sentence. The key is held only for the browser session; chat lines and the key are not saved persistently by Murmuration. This feature sends the selected chat lines to OpenAI. Remove the key or close the page to stop using it.

## Add it to OBS

1. Keep Murmuration running on the computer that runs OBS and leave its connected dashboard open. The tiny local server relays live messages, biome changes, and completed rituals to the overlay in memory.
2. Copy the **OBS overlay link** in the app.
3. In OBS, add a **Browser** source and paste the link. Set the dimensions to your canvas (1920 × 1080 is a good starting point).
4. The overlay URL uses `?overlay=1`; it shows the transparent flock and a small corner label. Chat reaches it through the dashboard’s local relay, so the Twitch token stays out of the OBS browser source.

## Rituals

| Chat command | Shared effect |
|---|---|
| `!gather` | Pulls the flock into a bright center orbit |
| `!bloom` | Releases a burst of color |
| `!ripple` | Sends a wave across the whole field |

Each ritual counts unique chatters over a rolling 45-second window, and has a short cooldown after it awakens.

## Built with

Vanilla JavaScript, Canvas 2D, Twitch EventSub WebSockets, Twitch Helix, Node.js, and the OpenAI Responses API (optional).

## Privacy and demo notes

Demo names and messages are fictional. Live chat appears only in the current server session; the small relay queue is held in memory and cleared when Murmuration stops. Murmuration keeps no database and has no analytics. The OpenAI key and recent messages are passed to OpenAI only when narration is enabled. Twitch login and EventSub require a registered Client ID and network access.
