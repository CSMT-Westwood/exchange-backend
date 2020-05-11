# API Documentation
## Table of Content
1. [User Login / Sign Up](#login)
   1. [Sign up](#sign-up)
   2. [Login](#log-in)
2. [Offer / Request](#offreq)
   1. [Make an offer](#make-an-offer)

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
        "username": "<username>",
        "password": "<password>",
        "email": "<email address>"
    }
    ```
- Response:
    ```json
    {
        "username": "<username>",
        "email": "<email>"
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
        "name": "<username>",
        "password": "<password>"
    }
    ```
- Response:
    ```json
    {
        "token": "<token>"
    }
    ```

## Offer / Request <a name="offreq"></a>
### 1. Make an offer <a name="make-an-offer"></a>
TODO
