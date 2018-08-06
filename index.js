const sqlite3 = require('sqlite3')

// create/open connection to database
let db = new sqlite3.Database('./karaokemanager2_database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    err => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the database.');
    });


console.time("create all tables in database...")
// create tables (if not existing)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS account (
                id integer PRIMARY KEY NOT NULL,
                name text NOT NULL,
                password_hash text NOT NULL,
                password_salt text NOT NULL,
                is_admin integer NOT NULL,
                file_path_picture text,
                status_text text,
                is_online integer,
                private integer NOT NULL,
                banned_comments integer,
                banned_new_entries integer
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> account"));
    db.run(`CREATE TABLE IF NOT EXISTS artist (
                id integer PRIMARY KEY NOT NULL,
                name text NOT NULL,
                description text,
                file_path_picture text,
                link_spotify text,
                link_youtube text,
                date DATETIME NOT NULL DEFAULT ()
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> artist"));
    db.run(`CREATE TABLE IF NOT EXISTS content_type (
                id integer PRIMARY KEY NOT NULL,
                name text NOT NULL,
                description text,
                author integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                FOREIGN KEY(author) REFERENCES account(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> content_type "));
    db.run(`CREATE TABLE IF NOT EXISTS content_language (
                id integer PRIMARY KEY NOT NULL,
                name text NOT NULL,
                author integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                FOREIGN KEY(author) REFERENCES account(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> content_language "));
    db.run(`CREATE TABLE IF NOT EXISTS song (
                id integer PRIMARY KEY NOT NULL,
                name text NOT NULL,
                description text,
                date_release integer,
                artist integer,
                author integer,
                lyrics text,
                file_path_local text,
                file_path_server text NOT NULL,
                content_type integer,
                content_language integer,
                link_spotify text,
                link_youtube text,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                FOREIGN KEY(artist) REFERENCES artist(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(content_type) REFERENCES content_type(id),
                FOREIGN KEY(content_language) REFERENCES content_language(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> song"));
    db.run(`CREATE TABLE IF NOT EXISTS playlist_entry (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                song integer NOT NULL,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(song) REFERENCES song(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> playlist_entry"));
    db.run(`CREATE TABLE IF NOT EXISTS playlist_entry_singer (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                profile integer NOT NULL,
                playlist_entry integer NOT NULL,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(playlist_entry) REFERENCES playlist_entry(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> playlist_entry_singer"));
    db.run(`CREATE TABLE IF NOT EXISTS album (
                id integer PRIMARY KEY NOT NULL,
                name text NOT NULL,
                author integer NOT NULL,
                description text,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                FOREIGN KEY(author) REFERENCES account(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> album"));
    db.run(`CREATE TABLE IF NOT EXISTS image (
                id integer PRIMARY KEY NOT NULL,
                name text,
                description text,
                author integer NOT NULL,
                file_path_picture text,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                private integer,
                FOREIGN KEY(author) REFERENCES account(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> image"));
    db.run(`CREATE TABLE IF NOT EXISTS image_tag_song (
                id integer PRIMARY KEY NOT NULL,
                image integer NOT NULL,
                author integer NOT NULL,
                song integer NOT NULL,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                FOREIGN KEY(image) REFERENCES image(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(song) REFERENCES song(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> image_tag_song"));
    db.run(`CREATE TABLE IF NOT EXISTS image_tag_profile (
            id integer PRIMARY KEY NOT NULL,
            image integer NOT NULL,
            author integer NOT NULL,
            profile integer NOT NULL,
            date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
            FOREIGN KEY(image) REFERENCES image(id),
            FOREIGN KEY(author) REFERENCES account(id),
            FOREIGN KEY(profile) REFERENCES account(id)
        );`,
        err => err ? console.error(err.message) : console.log("Table added >> image_tag_profile"));
    db.run(`CREATE TABLE IF NOT EXISTS artist_comment (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                artist integer NOT NULL,
                reply integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                message text NOT NULL,
                FOREIGN KEY(reply) REFERENCES artist_comment(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(artist) REFERENCES artist(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> artist_comment"));
    db.run(`CREATE TABLE IF NOT EXISTS song_comment (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                song integer NOT NULL,
                reply integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                message text NOT NULL,
                FOREIGN KEY(reply) REFERENCES song_comment(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(song) REFERENCES song(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> song_comment"));
    db.run(`CREATE TABLE IF NOT EXISTS account_comment (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                account integer NOT NULL,
                reply integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                message text NOT NULL,
                FOREIGN KEY(reply) REFERENCES account_comment(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(account) REFERENCES account(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> account_comment"));
    db.run(`CREATE TABLE IF NOT EXISTS playlist_entry_comment (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                playlist_entry integer NOT NULL,
                reply integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                message text NOT NULL,
                FOREIGN KEY(reply) REFERENCES playlist_entry_comment(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(playlist_entry) REFERENCES playlist_entry(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> playlist_entry_comment"));
    db.run(`CREATE TABLE IF NOT EXISTS image_comment (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                image integer NOT NULL,
                reply integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                message text NOT NULL,
                FOREIGN KEY(reply) REFERENCES image_comment(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(image) REFERENCES image(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> image_comment"));
    db.run(`CREATE TABLE IF NOT EXISTS album_comment (
                id integer PRIMARY KEY NOT NULL,
                author integer NOT NULL,
                album integer NOT NULL,
                reply integer,
                date DATETIME NOT NULL DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')),
                message text NOT NULL,
                FOREIGN KEY(reply) REFERENCES album_comment(id),
                FOREIGN KEY(author) REFERENCES account(id),
                FOREIGN KEY(album) REFERENCES album(id)
            );`,
        err => err ? console.error(err.message) : console.log("Table added >> album_comment"));
});
console.timeEnd("create all tables in database...")

// close database
db.close(err => {
    if (err) {
        console.error(err.message);
    }
    console.log('Close the database connection.');
});
