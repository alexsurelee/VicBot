# Cassette
[![Build Status](https://travis-ci.org/appellation/cassette.svg?branch=master)](https://travis-ci.org/appellation/cassette)

An extensible playlist module designed to make playlist management easy and powerful.

## How to use

Assume `cassette` is imported like so:

```js
const cassette = require('cassette');
```

1. Create a playlist.  That's what we're here for, after all.

```js
const playlist = new cassette.Playlist();
```

2. Create some services. Cassette ships with several, but you can always make your own by implementing `IService`.

```js
const ytService = new cassette.YouTubeService('your api key');
```

3. Add some stuff to this new playlist.

```js
playlist.add('some awesome song', [ytService]);
```

4. Profit.

## Reference

### Playlist *extends `Array`*

- **`constructor(client: Client)`**

- **loop**: `boolean` whether to loop the playlist at extremeties
- **autoplay**: `boolean` whether to use the last song to find the next song when at the end of the playlist
- **pos**: `number` *(readonly)* the current 0-based position of the playlist
- **current**: `Song?` *(readonly)* the current

- **reset()**: `void` reset the playlist's songs and position
- **hasPrev()**: `boolean` whether the playlist is not at the first position
- **prev()**: `boolean` advance the playlist backwards and return whether it was successful
- **hasNext()**: `boolean` whether the playlist is not at the last position
- **next()**: `Promise<boolean>` advance the playlist and return whether it was successful
- **shuffle()**: `void` shuffle the playlist
- **add(content: string, services: IService[], options: { position?: number, searchType?: 'song' | 'playlist' })**: `Promise<Song[]>` add content to the playlist

### Song
- **`constructor(service: IService)`**

- **service**: `IService` *(readonly)* the service that loaded this song
- **type**: `string` *(abstract, readonly)* the type of the song, based on the service
- **title**: `string` *(abstract, readonly)* the title of the song
- **trackID**: `string | number` *(abstract, readonly)* the ID of the song, relative to the service
- **playlistID?**: `string | number` *(abstract, readonly)* the ID of the playlist this song came from, if any, relative to the service
- **streamURL**: `string` *(abstract, readonly)* the URL to stream audio from
