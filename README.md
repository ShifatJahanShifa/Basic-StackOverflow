
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

## Distributed Basic-StackOverFlow
Alhamdulillah I have successfully converted the Monolithic Basic-Stackoverflow to Distributed Basic-Stakoverflow. According to the requirement: 

```bash
- Nginx server is used as reverse proxy server
- Server side code is divided into three services- user service, post service, notification service
- Inter service communication is established
- The three service have three different database associated with them
- Three services, three associated databases, minio all are orchestrated in docker-compose.yml file
- Additionaly, i have containerized frontend separately but have not orchestrated.
``` 

## Run
 
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

```   
Must have docker installed
```

### Run the project

Frontend:

```bash
  cd client
  npm start
```
Backend:

```bash
  docker-compose build
  docker-compose up
```

