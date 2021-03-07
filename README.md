TodoList is a simple and intelligent to-do list that makes it easy to plan your day

This repo is the front-end client, built in React.  You can see the app live at [https://todolist2110.herokuapp.com/](https://todolist2110.herokuapp.com/)

The app is meant for mobile use, but will still scale for desktop viewing.

To check out the app, I suggest you create a dummy account so you can see the onboarding experience.  But, if you just want to view what a program looks like, you can use the demo account.

#### Demo Account Details

* email: vudat2110@gmail.com
* password: secret

## Introduction

It turns out, our brains are actually wired to keep us thinking about our unfinished tasks. Handy when you have one thing you need to work on. Not so good when you have 30+ tasks vying for your attention at once.

That’s why the first step to organizing your work and life is getting everything out of your head and onto your to-do list. From there you can begin to organize and prioritize so you know exactly what to focus on.

## Quick App Demo

![](https://imgflip.com/gif/50aa6k)

## Technology

#### Back End

* Node and Express
  * RESTful Api
* Testing
  * Supertest
  * Mocha and Chai
* Database
  * Postgres
  * Knex

#### Production

Deployed via Heroku


## Set up

Major dependencies for this repo include Postgres and Node.

To get setup locally, do the following:

1. Clone this repository to your machine, `cd` into the directory and run `npm install`
2. Create a new database for this project

3. Create tables in that database

	For the "user":
		create table users(
			id serial primary key,
			name varchar(100),
			email text unique not null
		);
	For the "login":
		create table login(
			id serial primary key,
			hash varchar(100) not null,
			email text unique not null
		);
	For the "todo"
		create table todo(
			noteid serial primary key,
			todo text not null,
			id int not null,
			done int default 0
		);

4. In the app.js file, change the DB connection to localhost

## API Documentation
[Click Here for the API Documentation](https://drive.google.com/file/d/1vc9lz1YOn0GMLCWplezscfps0XHmsmA5/view?usp=sharing)
