A bot designed specifically for the Engineering and Computer Science (ECS) Discord server at Victoria University of Wellington.

Runs on discord.js master branch (v12).

Primary capabilities include:
- Creating channels and corresponding ranks with appropriate information from the course specified by the user.
- Bare minimum integration of playing music (currently disabled).
- Assigning and removing ranks.
- Sorting a category's channels alphabetically (currently focused on a category named `papers`, could easily be adjusted).

Upcoming capabilities include:
- Playing music with pause, stop, and queueing capabilities.

Requires a `botConfig.json` file your bot token and desired prefix. E.g.
```json
{
    "prefix": "!",
    "token": "YOUR_TOKEN_HERE"
}
```