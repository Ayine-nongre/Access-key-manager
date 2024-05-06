# Access Key Manager
This repo contains an access key manager for a multitenant school management software, this project was built with NodeJS, express, mongodb and minimalistic ejs.

## Features Implemented
⚪ <strong>Admin:</strong>
1. Login with email and password.
2. Revoke a user password.
3. See all keys generated on the platform (active, expired, revoked).
4. Retrieve a school's active access key using school email.<br>

⚪ <strong>IT personnel:</strong>
1. Signup and login using email and password.
2. Verify account after signing up.
3. Reset account password.
4. Generate new active key if no active key is available.
5.  See all keys granted to user on the platform (active, expired, revoked).
6.  See details of each key (status, date of procurement, expiry date).
## GETTING STARTED
1. Clone the project
 
   ```
   git clone https://github.com/Ayine-nongre/Access-key-manager.git
   ```
2. Change to project directory

    ```
    cd Access-key-manager/
    ```
3. Set up enviroment variables in env file
4. Install packages used in project

   ```
   npm install
   ```
5. Start server

    ```
    nodemon app.js
    ```

## ER Diagram
![ER diagram](https://github.com/Ayine-nongre/Access-key-manager/blob/main/ER%20Diagram.drawio.png)
