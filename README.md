# VicBot
A bot designed specifically for the Engineering and Computer Science (ECS) Discord server at Victoria University of Wellington.

Runs on discord.js master branch (v12).

Primary capabilities include:
- Creating channels and corresponding ranks with appropriate information from the course specified by the user.
    - Sorting new channels into their correct alphabetical location, currently divided by categories such as `100-level`, `200-level`, etc.
- Assigning and removing ranks.
- Parsing exam data from the university website and relaying it in channels.

## Setup
Requires two variables to be set - these can be environment variables or included in a `botConfig.json` file.

`PREFIX`: The prefix for your bot, e.g. `!`.

`TOKEN`: The token for your bot, can be retrieved from [here](https://discordapp.com/developers/applications/).

### Example `botConfig.json`
```json
{
  "PREFIX": "!",
  "TOKEN": "blahblahblah"
}
```

### Dev
This project prefers [yarn](https://yarnpkg.com/) over npm, please use this instead to avoid package manager issues.

Simply running `yarn start` will get the bot running. It uses a forever script, meaning if something causes the bot to crash, it will automatically start-up again.

If you are trying to develop this locally, you'll need to create your own bot from the link above, then simply supply the credentials in the `botConfig.json` file as specified above.

You can then invite the bot to your actual or development server via this link: https://discordapp.com/oauth2/authorize?client_id=YOUR_ID_HERE&scope=bot