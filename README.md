
# Basic Stack-Overflow

A minimalistic version of popular website stackoverflow.  


## Introduction

I have been developing this project under the course "Distributed System (CSE-601)". The requirement 

- At first I have to develop this project following monolithic architecture.

## Features

- User sign up, sign in, logout functionality
- User can post textual information without or with code ( either copy paste teh code or directly input the file from their system)
- One user can view other users post in the home page ( most recent post will be at the frontline ). But the user will not view their posts from the home page.
- Users will have notification of other users's posting
- Users can click on the notification to view the details of the post related to the notification
- The viewed notification will not be rendered later. But the unviewed notification will stay on the notification page until the user views it.


## Tech Stack

**Frontend:** React, Material UI

**Backend:** Nodejs, Expressjs 

**Database**: MongoDB

**ObjectDB**: Minio

## Run Locally


### Clone the project

```bash
  git clone https://github.com/ShifatJahanShifa/Basic-StackOverflow.git
```

### Go to the project directory

```bash
  cd Basic-StackOverflow
```

### Install dependencies

Frontend: 

```bash 
cd client
npm install
``` 
Backend:
    
```bash
cd server
npm install
```

### Run the project

Frontend:

```bash
  npm start
```
Backend:

```bash
  node index.js
```


