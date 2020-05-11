# API Documentation
## Table of Content
1. [User Login / Sign Up](#login)
   1. [Sign up](#sign-up)
   2. [Login](#log-in)
2. [Offer / Request](#offreq)
   1. [Make a post](#make-a-post)

## User Login / Sign up <a name="login"></a>
### 1. Sign up <a name="sign-up"></a>
- End point: ``/user/signup``
- Headers:
    ```json
    {
        "Content-Type": "application/json"
    }
    ```
- Request Body:
    ```json
    {
        "username": <username>,
        "password": <password>,
        "email": <email address>
    }
    ```
- Response:
    ```json
    {
        "username": <username>,
        "email": <email>
    }
    ```
### 2. Login <a name="log-in"></a>
- End point: ``/user/login``
- Headers:
    ```json
    {
        "Content-Type": "application/json"
    }
    ```
- Request Body:
    ```json
    {
        "name": <username>,
        "password": <password>
    }
    ```
- Response:
    ```json
    {
        "token": <login_token>
    }
    ```

## Offer / Request <a name="offreq"></a>
### 1. Make a post <a name="make-a-post"></a>
- End point: ``/post/new``
- Headers:
    ```json
    {
        "Content-Type": "application/json",
        "token": <login_token>
    }
    ```
- Request Body:
    ```json
    {
        "title": <title>,
        "description": <description>,
        "type": <"offer"_or_"request">,
        "tag": <tag>,
        "course": <course>
    }
    ```
- Response:
    ```
        "Post created"
    ```
