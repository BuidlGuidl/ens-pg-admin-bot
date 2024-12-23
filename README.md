## ENS PG Telegram Bot

A Telegram bot that sends notifications when new grants are created or new stages are submitted, triggered via webhooks.

## Setup

1. Copy `.env.example` to `.env` and fill in your values:

   - Get a Telegram bot token from [@BotFather](https://t.me/botfather)
   - Create a channel and add the bot as an admin
   - Get your channel ID (checkout this [instructions](https://github.com/GabrielRF/telegram-id?tab=readme-ov-file#app-group-id))
   - Set a secure webhook secret
   - Choose your port (default: 8080)

2. Install dependencies:

```bash
yarn install
```

3. start dev server:

```bash
yarn dev
```

4. Use [ngrok](https://ngrok.com/docs/getting-started/) to expose your local server to the internet:

```bash
ngrok http http://localhost:8080
```

## API Endpoints

### POST /webhook/grant

Notify about a new grant creation.

Headers:

```
Content-Type: application/json
X-Webhook-Secret: your_secret_here
```

Body example:

```json
{
  "id": 1,
  "grantNumber": 1,
  "title": "My Grant",
  "description": "Description...",
  "milestones": "Milestones...",
  "requestedFunds": "1000000000000000000",
  "github": "https://github.com/...",
  "email": "example@example.com",
  "builderAddress": "0x..."
}
```

### POST /webhook/stage

Notify about a new stage creation.

Headers:

```
Content-Type: application/json
X-Webhook-Secret: your_secret_here
```

Body example:

```json
{
  "id": 1,
  "stageNumber": 1,
  "milestone": "First milestone",
  "grantId": 1,
  "status": "proposed",
  "grant": {
    "id": 1,
    "title": "My Grant",
    ...
  }
}
```
