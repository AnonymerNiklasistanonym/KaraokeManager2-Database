/**
 * Type definition for an Account object
 * @typedef {{id: string, name: string, isAdmin: boolean, isBanned: boolean, isPrivate: boolean, picture: string, status: string}} Account
 */

/**
 * Type definition for an Artist object
 * @typedef {{name: string, picture: string, links: {spotify: string, youTube: string}}} Artist
 */

/**
 * Type definition for a Playlist object
 * @typedef {[PlaylistEntry]} Playlist
 */

/**
 * Type definition for a PlaylistEntry object
 * @typedef {{id: number, author: Account, song: Song}} PlaylistEntry
 */

/**
 * Type definition for a Song object
 * @typedef {{id: number, name: string, date: number, author: Account, song: Song}} Song
 */

/**
 * Type definition for an ImageAlbum object
 * @typedef {{id: number, name: string, date: number, author: Account}} ImageAlbum
 */

/**
 * Type definition for a Comment object
 * @typedef {{id: number, name: string, date: number, author: Account, answers: [Comment]}} Comment
 */

/**
 * Type definition for a AccountCommentThread object
 * @typedef {{account: Account, comment: Comment}} AccountCommentThread
 */

/**
 * Type definition for a AccountCommentThreads object
 * @typedef {{account: Account, comments: [Comment]}} AccountCommentThreads
 */

/**
 * Type definition for a ArtistCommentThread object
 * @typedef {{artist: Artist, comment: Comment}} ArtistCommentThread
 */

/**
 * Type definition for a ArtistCommentThreads object
 * @typedef {{artist: Artist, comments: [Comment]}} ArtistCommentThreads
 */

/**
 * Type definition for a SongCommentThread object
 * @typedef {{song: Song, comment: Comment}} SongCommentThread
 */

/**
 * Type definition for a SongCommentThreads object
 * @typedef {{song: Song, comments: [Comment]}} SongCommentThreads
 */

/**
 * Type definition for a PlaylistEntryCommentThread object
 * @typedef {{playlistEntry: PlaylistEntry, comment: Comment}} PlaylistEntryCommentThread
 */

/**
 * Type definition for a PlaylistEntryCommentThreads object
 * @typedef {{playlistEntry: PlaylistEntry, comment: [Comment]}} PlaylistEntryCommentThreads
 */

/**
 * Type definition for a ImageAlbumCommentThread object
 * @typedef {{imageAlbum: ImageAlbum, comment: Comment}} ImageAlbumCommentThread
 */

/**
 * Type definition for a ImageAlbumCommentThreads object
 * @typedef {{imageAlbum: ImageAlbum, comment: [Comment]}} ImageAlbumCommentThreads
 */

module.exports = {}
