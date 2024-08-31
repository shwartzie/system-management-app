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
### [Postman file](https://drive.google.com/file/d/1cQaUQNHom5VvyVCM6gHp_mXn4Q0F1QPf/view?usp=sharing)

### Collection should look like this
![image](https://github.com/user-attachments/assets/d0b02cc8-2080-4024-9a84-18d8f11153df)



### Follow the steps:

```
1. Open postman
2. Login to one of the following users which have different roles.
### guest can only send GET request however admin can do both!
username: admin
password: a12345

username: guest
password: a12345

3. Response headers will be filled with four main properties. 
4. Add for each endpoint you are going to test all 4 properties (examples included in each endpoint, only update the data)
```

 ### Login Response Example
![image](https://github.com/user-attachments/assets/046cf894-0121-47b6-afc3-7e6d8ec1a047)


### Enjoy accessing and playing around with the requests for handling projects and tasks!


### NOTICE: I had an idea to create a second database for tests only. However the second database costs money so imagine the data that is being created while running the tests, are supposed to be created in a test database idealy. I created integration tests too since they are mocking the real flow of the program since that's what I really care about, rather than looking for small detailes nested inside the flow.


## Test instructions
```
cd backend
``` 
```
npm run test
```


### Misc
(Git, Jest, TypesScript, NodeJS (Express), AWS Cognito Userpool + IAM, MongoDB + Compass)

# Read the attached Deployment suggestion in the repo, for the following infrastructure ! :)
