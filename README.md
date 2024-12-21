## ENS PG Telegram Bot

A Telegram bot that sends notifications when new grants are created or new stages are submitted, triggered via webhooks.

## Setup

1. Copy `.env.example` to `.env` and fill in your values:

   - Get a Telegram bot token from [@BotFather](https://t.me/botfather)
   - Create a channel and add the bot as an admin
   - Get your channel ID (you can use [@username_to_id_bot](https://t.me/username_to_id_bot))
   - Set a secure webhook secret
   - Choose your port (default: 8080)

2. Install dependencies:

```bash
yarn install
```

3. Build and run:

```bash
yarn build
yarn start
```

For development:

```bash
yarn dev
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

````json
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
````
