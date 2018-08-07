# Database documentation

This automated created document shows how the database is currently structured for a better overview.

Content:
- [Tables](#tables)
   - [account](#account)
   - [artist](#artist)
   - [song_content_type](#song_content_type)
   - [song_content_language](#song_content_language)
   - [song](#song)
   - [song_tag_artist](#song_tag_artist)
   - [playlist_entry](#playlist_entry)
   - [playlist_entry_singer](#playlist_entry_singer)
   - [image_album](#image_album)
   - [image](#image)
   - [image_tag_song](#image_tag_song)
   - [image_tag_account](#image_tag_account)
   - [artist_comment](#artist_comment)
   - [song_comment](#song_comment)
   - [account_comment](#account_comment)
   - [playlist_entry_comment](#playlist_entry_comment)
   - [image_comment](#image_comment)
   - [image_album_comment](#image_album_comment)


## Tables

### account
in here all accounts are saved

- id (`text`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id (account name)*
- password_hash (`text`) [*NOT NULL*]<br>*hash of the password of the account*
- password_salt (`text`) [*NOT NULL*, *UNIQUE*]<br>*salt for hashing the password of the account*
- is_admin (`boolean/integer`) [*NOT NULL*] >> **Default:** false (`0`)<br>*indicates if account has elevated admin rights*
- is_private (`boolean/integer`) [*NOT NULL*] >> **Default:** true (`1`)<br>*indicates if account should be hidden on public page*
- is_banned (`boolean/integer`) [*NOT NULL*] >> **Default:** false (`0`)<br>*indicates if account is banned*
- is_banned_comments (`boolean/integer`) [*NOT NULL*] >> **Default:** false (`0`)<br>*indicates if account is banned in writing comments*
- is_banned_entries (`boolean/integer`) [*NOT NULL*] >> **Default:** false (`0`)<br>*indicates if account is banned in creating new (playlist) entries*
- name (`text`)<br>*real name of account*
- server_file_path_profile_picture (`text`)<br>*server file path to profile picture of account*
- status (`text`)<br>*account status text*

### artist
in here all artist are saved

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- name (`text`) [*NOT NULL*]<br>*name of the artist*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when artist was added*
- author (`text`) [*NOT NULL*]<br>*account that added the artist*
   - reference to [`account.id`](#account)
- description (`text`)<br>*more information about the artist*
- server_file_path_artist_picture (`text`)<br>*server file path to a 'profile' picture of the artist*
- link_spotify (`text`)<br>*link to the Spotify account of the artist*
- link_youtube (`text`)<br>*link to the YouTube account of the artist*

### song_content_type
the type of content in the song file (lyric video, music video, audio file, ...)

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- name (`text`) [*NOT NULL*]<br>*name of the type of content in the song file*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when song content type was added*
- author (`text`) [*NOT NULL*]<br>*account that added the song content type*
   - reference to [`account.id`](#account)
- description (`text`)<br>*more information about the song content type*

### song_content_language
the language of the song

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- name (`text`) [*NOT NULL*]<br>*name of the song language*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when song language was added*
- author (`text`) [*NOT NULL*]<br>*account that added the song language*
   - reference to [`account.id`](#account)

### song
in here all songs are saved

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- name (`text`) [*NOT NULL*]<br>*name of the song*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when artist was added*
- author (`text`) [*NOT NULL*]<br>*account that added the artist*
   - reference to [`account.id`](#account)
- server_file_path (`text`) [*NOT NULL*]<br>*server file path to song file*
- release_date (`date/DATETIME`)<br>*date of the release of the song*
- description (`text`)<br>*more information about the song*
- lyrics (`text`)<br>*lyrics of the song*
- local_file_path (`text`)<br>*local file path to song file*
- song_content_type (`integer`)<br>*song content type (Music video, audio file, ...)*
   - reference to [`song_content_type.id`](#song_content_type)
- song_content_language (`integer`)<br>*language of the song*
   - reference to [`song_content_language.id`](#song_content_language)
- link_spotify (`text`)<br>*link to song on Spotify*
- link_youtube (`text`)<br>*link to song on YouTube*

### song_tag_artist
in here artists are connected to songs they sing

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- song (`integer`) [*NOT NULL*]<br>*song which the connected artist is in*
   - reference to [`song.id`](#song)
- artist (`integer`) [*NOT NULL*]<br>*artist which sings the connected song*
   - reference to [`artist.id`](#artist)
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when tag was created*
- author (`text`) [*NOT NULL*]<br>*account that made this tag*
   - reference to [`account.id`](#account)

### playlist_entry
playlist entry of song where accounts can join as singer

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when playlist_entry was added*
- author (`text`) [*NOT NULL*]<br>*account that created the playlist entry*
   - reference to [`account.id`](#account)
- song (`integer`) [*NOT NULL*]<br>*song that was added to the playlist entry*
   - reference to [`song.id`](#song)

### playlist_entry_singer
account that wants to join a song in the connected playlist entry

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when join to playlist_entry was added*
- playlist_entry (`integer`) [*NOT NULL*]<br>*playlist entry that the author account wants to join*
   - reference to [`playlist_entry.id`](#playlist_entry)
- author (`text`) [*NOT NULL*]<br>*account that created the playlist entry join*
   - reference to [`account.id`](#account)

### image_album
in here image collections are saved

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- name (`text`) [*NOT NULL*]<br>*name of the album*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when album was created*
- author (`text`) [*NOT NULL*]<br>*account that created the album*
   - reference to [`account.id`](#account)

### image
in here are all images

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when image was added*
- author (`text`) [*NOT NULL*]<br>*account that added the image*
   - reference to [`account.id`](#account)
- server_file_path (`text`) [*NOT NULL*]<br>*server file path of image*
- is_private (`boolean/integer`) [*NOT NULL*] >> **Default:** false (`1`)<br>*indicates if image is private*
- name (`text`)<br>*name of the image*
- description (`date/DATETIME`) >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*description of the image*

### image_tag_song
indicates that a song was played while an image was taken

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when image was added*
- image (`integer`) [*NOT NULL*]<br>*image that was taken during a song*
   - reference to [`image.id`](#image)
- song (`integer`) [*NOT NULL*]<br>*song that was played while taking this image*
   - reference to [`song.id`](#song)
- author (`text`) [*NOT NULL*]<br>*account that tagged this image*
   - reference to [`account.id`](#account)

### image_tag_account
indicates that an account is in the image

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when image was added*
- image (`integer`) [*NOT NULL*]<br>*image that was taken during a song*
   - reference to [`image.id`](#image)
- account (`integer`) [*NOT NULL*]<br>*account that is in the picture*
   - reference to [`account.text`](#account)
- author (`text`) [*NOT NULL*]<br>*account that added tagged this image*
   - reference to [`account.id`](#account)

### artist_comment
a comment on the page of an artist

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when comment was made*
- artist (`integer`) [*NOT NULL*]<br>*artist page on which the comment was made*
   - reference to [`artist.id`](#artist)
- author (`text`) [*NOT NULL*]<br>*account that created this comment*
   - reference to [`account.id`](#account)
- message (`text`) [*NOT NULL*]<br>*comment text*
- reply (`integer`)<br>*this comment was an answer to another comment*
   - reference to [`artist_comment.id`](#artist_comment)

### song_comment
a comment on the page of a song

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when comment was made*
- song (`integer`) [*NOT NULL*]<br>*song page on which the comment was made*
   - reference to [`song.id`](#song)
- author (`text`) [*NOT NULL*]<br>*account that created this comment*
   - reference to [`account.id`](#account)
- message (`text`) [*NOT NULL*]<br>*comment text*
- reply (`integer`)<br>*this comment was an answer to another comment*
   - reference to [`song_comment.id`](#song_comment)

### account_comment
a comment on the page of an account

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when comment was made*
- account (`text`) [*NOT NULL*]<br>*account page on which the comment was made*
   - reference to [`account.id`](#account)
- author (`text`) [*NOT NULL*]<br>*account that created this comment*
   - reference to [`account.id`](#account)
- message (`text`) [*NOT NULL*]<br>*comment text*
- reply (`integer`)<br>*this comment was an answer to another comment*
   - reference to [`account_comment.id`](#account_comment)

### playlist_entry_comment
a comment on a playlist entry

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when comment was made*
- playlist_entry (`integer`) [*NOT NULL*]<br>*playlist_entry on which the comment was made*
   - reference to [`playlist_entry.id`](#playlist_entry)
- author (`text`) [*NOT NULL*]<br>*account that created this comment*
   - reference to [`account.id`](#account)
- message (`text`) [*NOT NULL*]<br>*comment text*
- reply (`integer`)<br>*this comment was an answer to another comment*
   - reference to [`playlist_entry_comment.id`](#playlist_entry_comment)

### image_comment
a comment on an image

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when comment was made*
- image (`integer`) [*NOT NULL*]<br>*image on which the comment was made*
   - reference to [`image.id`](#image)
- author (`text`) [*NOT NULL*]<br>*account that created this comment*
   - reference to [`account.id`](#account)
- message (`text`) [*NOT NULL*]<br>*comment text*
- reply (`integer`)<br>*this comment was an answer to another comment*
   - reference to [`image_comment.id`](#image_comment)

### image_album_comment
a comment on an album

- id (`integer`) [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]<br>*unique id*
- date (`date/DATETIME`) [*NOT NULL*] >> **Default:** now (`datetime(CURRENT_TIMESTAMP, 'localtime')`)<br>*date when comment was made*
- album (`integer`) [*NOT NULL*]<br>*album on which the comment was made*
   - reference to [`album.id`](#album)
- author (`text`) [*NOT NULL*]<br>*account that created this comment*
   - reference to [`account.id`](#account)
- message (`text`) [*NOT NULL*]<br>*comment text*
- reply (`integer`)<br>*this comment was an answer to another comment*
   - reference to [`image_album_comment.id`](#image_album_comment)
