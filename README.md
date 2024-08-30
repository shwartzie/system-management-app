# System-management-app
Program to manage with authenticated users CRUD operations on Projects and Tasks Using AWS Cognito Userpool


Lets start shall we ?

## Setup Instructions
Please make sure port 3000 is free.

### Backend
```
cd backend
``` 
```
npm i
``` 
```
npm start
``` 
#### Then the server will print:
###### "Server started at port http://localhost:3000
###### Connected to DB"

#### Enjoy 😊

## Links
### Download Postman file -
### [Postman file]()


### Follow the steps:

```
1. Register user for guest role (need to setup verification in SNS for your phone_number to continue)
2. Login to it
3. Use MFA Http Request by sending the username and session you have received from login request.
4. Use the access token received after success MFA to access all recources.
``` 
```
1. Login to the following user which is Admin type
username: roni1
password: a12345
2. Use MFA Http Request by sending the username and session you have received from login request.
3. Use Mfa code recieved to my phone
4. Use the access token received after success MFA to access all recources.
``` 
```

1. Login to the following user which is Guest type
username: roni
password: a12345
2. Use MFA Http Request by sending the username and session you have received from login request.
3. Use MFA code recieved to my phone
4. Use the access token received after success MFA to access all recources.

``` 
### Enjoy accessing and playing around with the requests for handling projects and tasks!


## Test instructions
```
cd backend
``` 
```
npm test
```


### Misc
(Git, Jest,TypesScript, NodeJS (Express), AWS Cognito Userpool + SNS + IAM)
