
#  Uptime-Monitoring-Server RESTful API

Uptime monitoring RESTful API server that allows authenticated users to monitor URLs, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Features

- Sign-up with email verification .
- Stateless authentication using JWT .
- Users can create a check to monitor a given URL if it is up or down .
- Users can edit or delete their checks if needed .
- Users receive email alerts whenever down checks exceed the number of the threshold defined by the user .
- Users can get detailed uptime reports contains :
    - Their URLs checks availability
    - Average response time
    - Total uptime period /downtime period
    - Timestamp of each check
   -  Count of uptime checks and downtime
    - Status  
- Users can group their checks by tags and get reports by tag


## Installation

- Locally
    
    To deploy this project  run ``` npm install ```

    Create a new database on MongoDB and change the .env file with the new connections details .

    Then run ``` npm start ```

- Running the Docker image
    
    Download the repo

    cd to the project directory

    Run in terminal ```bash docker-compose -f docker-compose.yml up ```
    
## Configurations

- MONGO_URI . 
- EMAIL_USERNAME " From which the app will send verification and outage emails " .
- EMAIL_PASSWORD .
- JWT_SECRET .
## API Endpoints

### - Auth routes
#### Signup : ```  Post /api/auth/signup```
to sign up using email and password

#### Verify account : ```  Post /api/auth/verify ```
to verify email by the code sent to your email

#### Login ``` Post /api/auth/login ```
to login and get a response with the token which will be used accross the API server 

### - Checks routes

#### Get All Checks : ```  Get /api/checks```
#### Create Check : ```  Post /api/checks```
#### Get A Specific Check  : ```  Get /api/checks/:id```
#### Update Check  : ```  PATCH /api/checks/:id```
#### Delete Check  : ```  DELETE /api/checks/:id```

### - Reports routes

#### Get All Reports : ```  Get /api/reports```
#### Get Reports By Tags : ```  POST /api/reports/tags```
provide an array of tags in the request body to get reports grouped by tags
#### Get Report Of A Specific Check  : ```  Get /api/reports/:checkId```




## Dependencies

    "express": "^4.18.1",
    "mongoose": "^6.2.10",
    "jsonwebtoken": "^8.5.1",
    "bcryptjs": "^2.4.3",
    "node-cron": "^3.0.0"
    "joi": "^17.6.0",
    "nodemailer": "^6.7.3",
    "axios": "^0.26.1",
    "axios-retry": "^3.2.4",
    "dotenv": "^16.0.0",
    "nodemon": "^2.0.16",
    "chai": "^4.3.4",
    "chai-http": "^4.3.0",
    "mocha": "^6.2.3"
# Unit tests

- Testing was done using Mocha and Chai 

### Test of Auth Routes :

![AuthRouteTesting](https://user-images.githubusercontent.com/99690899/172068472-d08d1d80-a9b4-4a98-8e0d-0f1384bf42fc.PNG)

### Test of Checks Routes :

![ChecksRoutesTesting](https://user-images.githubusercontent.com/99690899/172068514-a55b86e4-22d4-4b66-9351-ca1236748c7b.PNG)

### Test of Reports Routes :

![ReportRoutesTesting](https://user-images.githubusercontent.com/99690899/172068949-8d8fe551-7123-48f3-97e4-cd4c6220c127.PNG)

### Test of All Routes :

![AllTests](https://user-images.githubusercontent.com/99690899/172068980-c2cc5509-15f7-4864-b6fc-20ef93cfcc8f.PNG)
# Screenshots 
 Testing real websites playing around with the timeout value to be able to test our server

## Testing Amazon

Check

![AmazonCheck](https://user-images.githubusercontent.com/99690899/172071671-b3cca54b-0fe4-4965-89d2-11e42f3c175e.PNG)

Report

![AmazonReport](https://user-images.githubusercontent.com/99690899/172071684-82c36f12-b876-4c9f-9179-7c34b12de9ac.PNG)


## Testing Youtube
Check

![YoutubeCheck](https://user-images.githubusercontent.com/99690899/172071993-58745a9c-e97d-45a9-8d8f-2781b0bbc79d.PNG)

Report

![YoutubeReport](https://user-images.githubusercontent.com/99690899/172072000-817a99a2-3351-40c3-8074-6d4259b4dc68.PNG)

## Testing Facebook

Check

![FacebookCheck](https://user-images.githubusercontent.com/99690899/172072459-496b7132-eeed-4f41-8baa-a9c46064412c.PNG)

Report

![FacebookReport](https://user-images.githubusercontent.com/99690899/172072461-d9d1bdf9-69da-41bd-a964-4d861e6c761e.PNG)


## Verification Mail

![VerificationMail](https://user-images.githubusercontent.com/99690899/172116568-db1a55ca-cc7b-4d66-b08a-1edc99d7d003.PNG)

## Outage Mail

![OutageMail](https://user-images.githubusercontent.com/99690899/172116657-cdec3e76-a109-45ad-838d-42af26cfac31.PNG)



