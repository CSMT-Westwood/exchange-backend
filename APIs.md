# API Documentation
## Table of Content
0. [A 6-min guide on how to make requests to the server](https://www.youtube.com/watch?v=cuEtnrL9-H0)
1. [User Login / Sign Up](#login)
   1. [Sign up](#sign-up)
   2. [Login](#log-in)
2. [Offer / Request](#offreq)
   1. [Make a post](#make-a-post)

## User Login / Sign up <a name="login"></a>
### 1. Sign up <a name="sign-up"></a>
- End point: ``POST /user/signup``
- Headers:
    ```json
    {
        "Content-Type": "application/json"
    }
    ```
- Request Body:
    ```json
    {
        "username": "<username>",
        "password": "<password>",
        "email": "<email_address>"
    }
    ```
- Response:
  - ``200 OK``
    ```json
    {
        "username": "<username>",
        "email": "<email>"
    }
    ```
  - ``400 Bad Request`` Cause: invalid user input
  - ``409 Conflict``  Cause: username already exists
    ```json
    {
        "message": "<error_message>"
    }
    ```

### 2. Login <a name="log-in"></a>
- End point: ``POST /user/login``
- Headers:
    ```json
    {
        "Content-Type": "application/json"
    }
    ```
- Request Body:
    ```json
    {
        "name": "<username>",
        "password": "<password>"
    }
    ```
- Response:
  - ``200 OK``
    ```json
    {
        "token": "<login_token>"
    }
    ```
  - ``400 Bad Request``  Cause: invalid user input
  - ``401 Unauthorized``  Cause: invalid credentials
    ```json
    {
        "message": "<error_message>"
    }
    ```

## Offer / Request <a name="offreq"></a>
### 1. Make a post <a name="make-a-post"></a>
- End point: ``POST /post/new``
- Headers:
    ```json
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
- Request Body:
    ```json
    {
        "title": "<title>",
        "description": "<description>",
        "type": "<offer_or_request>",
        "tag": "<tag>",
        "course": "<course>"
    }
    ```
- Response:
  - ``200 OK``
    ```json
    {
        "message": "Post created successfully."
    }
    ```
  - ``400 Bad Request``  Cause: invalid user input
  - ``401 Unauthorized``  Cause: user needs to log in before creating posts
    ```json
    {
        "message": "<error_message>"
    }
    ```
