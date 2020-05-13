# API Documentation
## Table of Content
0. [A 6-min guide on how to make requests to the server](https://www.youtube.com/watch?v=cuEtnrL9-H0)
1. [User Login / Sign Up](#login)
   1. [Sign up](#sign-up)
   2. [Login](#log-in)
   3. [User Posts Lookup](#userPosts)
2. [Offer / Request](#offreq)
   1. [Make a post](#make-a-post)

## User Login / Sign up <a name="login"></a>
### 1. Sign up <a name="sign-up"></a>
- End point: ``POST /user/signup``
- Headers:
    ```javascript
    {
        "Content-Type": "application/json"
    }
    ```
- Request Body:
    ```javascript
    {
        "username": "<username>",
        "password": "<password>",
        "email": "<email_address>"
    }
    ```
- Response:
  - ``200 OK``
    ```javascript
    {
        "username": "<username>",
        "email": "<email>"
    }
    ```
  - ``400 Bad Request`` Cause: invalid user input
  - ``409 Conflict``  Cause: username already exists
    ```javascript
    {
        "message": "<error_message>"
    }
    ```

### 2. Login <a name="log-in"></a>
- End point: ``POST /user/login``
- Headers:
    ```javascript
    {
        "Content-Type": "application/json"
    }
    ```
- Request Body:
    ```javascript
    {
        "username": "<username>",
        "password": "<password>"
    }
    ```
- Response:
  - ``200 OK``
    ```javascript
    {
        "token": "<login_token>"
    }
    ```
  - ``400 Bad Request``  Cause: invalid user input
  - ``401 Unauthorized``  Cause: invalid credentials
    ```javascript
    {
        "message": "<error_message>"
    }
    ```

### 3. User Posts Lookup <a name="userPosts"></a>
- End point: ``GET /user/posts``
- Headers:
    ```javascript
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
- Request Body:
    ```
    Nothing
    ```
- Response:
  - ``200 OK``
    ```javascript
    [
        {
            "_id": "<post_id>",
            "typeOfPost": "<0_or_1>",
            "typeOfItem": "<0_or_1>",
            "course": "<course_code>",      // when known
            "itemName": "<item_name>",
            "condition": "<0-3>",           // when known
            "description": "<description>",
            "link": "<link>",               // when known
            "fulfilled": "<0-2>"            // when known
            "publication_date": "<Date>"
        },  
        // more posts
    ]
    ```
  - ``400 Bad Request``  Cause: invalid user input
  - ``401 Unauthorized``  Cause: user needs to log in before creating posts
    ```javascript
    {
        "message": "<error_message>"
    }
    ```

## Offer / Request <a name="offreq"></a>
### 1. Make a post <a name="make-a-post"></a>
- End point: ``POST /post/new``
- Headers:
    ```javascript
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
- Request Body:
    ```javascript
    {
        "typeOfPost": "<0_or_1>",
        "typeOfItem": "<0_or_1>",
        "course": "<course_code>",      // not required
        "itemName": "<item_name>",
        "condition": "<0-3>",           // not required
        "description": "<description>",
        "link": "<link>",               // not required
        "fulfilled": "<0-2>"            // not required
    }
    ```
- Response:
  - ``200 OK``
    ```javascript
    {
        "message": "Post created successfully."
    }
    ```
  - ``400 Bad Request``  Cause: invalid user input
  - ``401 Unauthorized``  Cause: user needs to log in before creating posts
    ```javascript
    {
        "message": "<error_message>"
    }
    ```
