# Simple-Blog-Manager

This is a simple blog program that can be deployed on a PHP server that uses local JS to create
markdown-written pages.

# Adding blog entries

Entries are created on the `Entries` folder, which are the plan markdown files that contain all the content. They support YAML implementation on the headers for information like title, date, automatic table of contents, and other things.

To define the entries on the main page, which is the main hub to find the entries, edit `db.json`.

```json
{
	"01-MyFirstEntry" : {"Title":"My very first blog post!","Date":"Today!"}
}
```

# How to Deploy

You'll need PHP 7.3.24, but should work on earlier versions as well.

- Clone the repository using git and go to the folder.
```bash
git clone git@github.com:JoseVarelaP/Simple-Blog-Manager.git
cd Simple-Blog-Manager
```

- Start a local PHP server in a localhost to run, then access the page on a web browser.
```bash
php -S localhost:8888
```
# External repos
This program uses the following repos:
- [JS-YAML](https://github.com/nodeca/js-yaml)
- [Marked](https://github.com/markedjs/marked)