A bot designed specifically for the Engineering and Computer Science (ECS) Discord server at Victoria University of Wellington.

Runs on discord.js master branch (v12).

Primary capabilities include:
- Creating channels and corresponding ranks with appropriate information from the course specified by the user.
    - Sorting new channels into their correct alphabetical location, currently divided by categories such as `100-level`, `200-level`, etc.
- Assigning and removing ranks.
- Playing music from YouTube (search functionality needs refining, links work ok).

Requires three environment variables to be set:

`PREFIX`: The prefix for your bot, e.g. `!`.

`TOKEN`: The token for your bot, can be retrieved from here: https://discordapp.com/developers/applications/

`GOOGLE_API_KEY`: See here: https://developers.google.com/youtube/v3/getting-started
