# API Documentation

## Table of Content

0. [A 6-min guide on how to make requests to the server](https://www.youtube.com/watch?v=cuEtnrL9-H0)
1. [User Related](#login)
    1. [Sign up](#sign-up)
    2. [Login](#log-in)
    3. [User Posts Lookup](#userPosts)
    4. [Get Logged-in User Profile](#get-self-profile)
    5. [Update User Profile](#user-update)
    6. [Update User Avatar](#user-avatar)
2. [Offer / Request](#offreq)
    1. [Make a Post](#make-a-post)
    2. [Search for Posts](#post-search)
3. [Feed](#Feed)
    1. getFeed(#getFeed)
    2. get Preference Posts(#getMyPosts)
    3. get My Posts(#getActivities)
    4. get Followed Posts(getFollowedPosts)

## User Related <a name="login"></a>

### 1. Sign up <a name="sign-up"></a>

-   End point: `POST /user/signup`
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json"
    }
    ```
-   Request Body:
    ```javascript
    {
        "username": "<username>",
        "password": "<password>",
        "email": "<email_address>"
    }
    ```
-   Response:
    -   `200 OK`
        ```javascript
        {
            "username": "<username>",
            "email": "<email>"
        }
        ```
    -   `400 Bad Request` Cause: invalid user input
    -   `409 Conflict` Cause: username already exists
        ```javascript
        {
            "message": "<error_message>"
        }
        ```

### 2. Login <a name="log-in"></a>

-   End point: `POST /user/login`
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json"
    }
    ```
-   Request Body:
    ```javascript
    {
        "username": "<username>",
        "password": "<password>"
    }
    ```
-   Response:
    -   `200 OK`
        ```javascript
        {
            "preferences": "<array_of_preferences>",
            "rp": "<rp>",
            "username": "<username>",
            "email": "<email>",
            "token": "<login_token>"
        }
        ```
    -   `400 Bad Request` Cause: invalid user input
    -   `401 Unauthorized` Cause: invalid credentials
        ```javascript
        {
            "message": "<error_message>"
        }
        ```

### 3. User Posts Lookup <a name="userPosts"></a>

-   End point: `GET /user/posts`
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
-   Request Body:
    ```
    Nothing
    ```
-   Response:
    -   `200 OK`
        ```javascript
        [
            {
                "_id": "<post_id>",
                "typeOfPost": "<0_or_1>",
                "typeOfItem": "<0_or_2>",
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
    -   `400 Bad Request` Cause: invalid user input
    -   `401 Unauthorized` Cause: user needs to log in before creating posts
        ```javascript
        {
            "message": "<error_message>"
        }
        ```

### 4. Get Logged-in User Profile <a name="get-self-profile"></a>

-   End point: `GET /user/self`
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
-   Request Body: `None needed`
-   Response:
    -   `200 OK`
        ```javascript
        {
            "preferences": "<array_of_preferences>",
            "posts": "<array_of_posts_by_user>",
            "rp": "<rp>",
            "username": "<username>",
            "email": "<email>"
        }
        ```
    -   `400 Bad Request`: should never happen
        ```javascript
        {
            "message": "<error_message>"
        }
        ```

### 5. Update User Profile <a name="user-update"></a>

-   End point: `PATCH /user/update`
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
-   Request Body:
    ```javascript
    {
        "username": "<username>",                   // optional
        "email": "<email_address>",                 // optional
        "preferences": "<array_of_preferences>",    // optional
        "rp": "<new_rp_count>"                      // optional
    }
    ```
-   Response:
    -   `200 OK`
        ```javascript
        {
            "username": "<new_username>",
            "email": "<new_email>",
            "rp": "<new_rp>",
            "preferences": "<new_array_of_preferences>"
        }
        ```
    -   `400 Bad Request` Cause: invalid user input
    -   `409 Conflict` Cause: username/email already exists
        ```javascript
        {
            "message": "<error_message>"
        }
        ```

### 6. Upload User Avatar <a name="user-avatar"></a>

-   End point `POST /userAvatar/avatar/`
-   Headers:

    ```javascript
    {
        "Content-Type": "multipart/form-data",
        "token": "<login_token>"
    }
    ```

    Request Body:

    ```javascript
    {
        "image": <FILE>

    }
    ```

    Response:
    `200 OK`

    ```javascript
    {
        "username":"<username>" , //the username linked to the token
        "url":"<url>",
        "width":<width>,
        "height":<height>
    }
    ```

    Note: The avatar url is also updated in the corresponding user object

    `400 Bad Request`

    ```javascript
    {
        "message":"<error_message>"
    }
    ```

## Offer / Request <a name="offreq"></a>

### 1. Make a Post <a name="make-a-post"></a>

-   End point: `POST /post/new`
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
-   Request Body:
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
-   Response:
    -   `200 OK`
        ```javascript
        {
            "_id": "<post_id>",
            "typeOfPost": "<0_or_1>",
            "typeOfItem": "<0_or_2>",
            "course": "<course_code>",      // if applicable
            "itemName": "<item_name>",
            "condition": "<0-3>",           // if applicable
            "description": "<description>",
            "link": "<link>",               // if applicable
            "fulfilled": "<0-2>",           // if applicable
            "publication_date": "<publication_date>",
            "__v": "<ignore_this>",
            "author": "<author_id>"
        }
        ```
    -   `400 Bad Request` Cause: invalid user input
    -   `401 Unauthorized` Cause: user needs to log in before creating posts
        ```javascript
        {
            "message": "<error_message>"
        }
        ```

### 2. Search for Posts <a name="post-search"></a>

- End point `GET /post/search/search?query=<search_query>&typeOfItem=<0or1or2>`
- Headers
    ```javascript
    {
        "Content-Type": "application/json",
    }
    ```
- Body `None`
- Response
  - `200 OK`
    ```javascript
    [
        {
            "_id": "<post_id>",
            "typeOfPost": "<0_or_1>",
            "typeOfItem": "<0_or_2>",
            "course": "<course_code>",      // if applicable
            "itemName": "<item_name>",
            "condition": "<0-3>",           // if applicable
            "description": "<description>",
            "link": "<link>",               // if applicable
            "fulfilled": "<0-2>",           // if applicable
            "publication_date": "<publication_date>",
            "__v": "<ignore_this>",
            "author": "<author_id>"
        }, // more posts
    ]
    ```

    
## Feed <a name="Feed"></a>

### 1. getFeed <a name="getFeed"></a>

-   End point `GET /feed/`
        Purpose: to get every post related to the user
        
-   Headers:

    ```javascript
    {
        "Content-Type": "multipart/form-data",
        "token": "<login_token>"
    }
    ```

-   Request Body:
    ```
    {
        //empty
    }
    ```
    
-   Response:
    -   `200 OK`

    ```javascript
    "preferencePosts":[
        {
            "fulfilled": 1,
            "_id": "5ec5d6d35cd7321734f06a44",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is the best class ever(fulfilled)",
            "author": "5ec0e0d707a63f58a074bf3f",
            "publication_date": "2020-05-21T01:18:11.235Z",
            "__v": 0
        },
        {<same as above>},
        {<same as above>}
    ],
    "followedPosts": [
        {<same as above>},
        {<same as above>}
    ],
    "ownPosts": [
        {<same as above>},
        {<same as above>}
    ],
    "activities":[
        {<same as above>},
        {<same as above>}
    ]
    ```

### 2. get MyPost <a name="getMyPosts"></a>
-   End point `GET /feed/myPosts/`
    -   Purpose: to get the posts created by the user
        , organized in terms of levels of fulfillment
        
    - Headers:

    ```javascript
    {
        "Content-Type": "multipart/form-data",
        "token": "<login_token>"
    }
    ```

-   Request Body:  
    {
        //empty
    }

-   Response:
    `200 OK`

    ```javascript
    {
    "unfulfilled": [
        {
            "fulfilled": 0,
            "_id": "5ec5d6875cd7321734f06a42",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs100",
            "description": "yesyesyes",
            "author": "5ec0e0d707a63f58a074bf3f",
            "publication_date": "2020-05-21T01:16:55.879Z",
            "__v": 0
        },
        {
            "fulfilled": 0,
            "_id": "5ec5d6bc5cd7321734f06a43",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is the best class ever",
            "author": "5ec0e0d707a63f58a074bf3f",
            "publication_date": "2020-05-21T01:17:48.442Z",
            "__v": 0
        }
    ],
    "pending": [
        {
            "fulfilled": 1,
            "_id": "5ec5d6d35cd7321734f06a44",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is the best class ever(fulfilled)",
            "author": "5ec0e0d707a63f58a074bf3f",
            "publication_date": "2020-05-21T01:18:11.235Z",
            "__v": 0
        }
    ],
    "fulfilled": [
        {
            "fulfilled": 2,
            "_id": "5ec5d6e35cd7321734f06a45",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is hard)",
            "author": "5ec0e0d707a63f58a074bf3f",
            "publication_date": "2020-05-21T01:18:27.270Z",
            "__v": 0
        }
    ]
}
    ```
### 3. get posts that the user responded to <a name="getActivities"></a>

-   End point `GET /feed/activities/`
    -   Purpose: to get the posts responded to by the user
        , organized in terms of levels of fulfillment
        
-   Headers:

    ```javascript
    {
        "Content-Type": "multipart/form-data",
        "token": "<login_token>"
    }
    ```

-   Request Body:  
    {
        //empty
    }

-   Response:
    `200 OK`

    ```javascript
    {
    "unfulfilled": [
        {
            <POSTOBJ>
        },
        {
            <POSTOBJ>
        }
    ],
    "pending": [
        {
            <POSTOBJ>
        }
    ],
    "fulfilled": [
        {
            <POSTOBJ>
        }
    ]
}
    ```
### 4. get Followed posts <a name="getFollowedPosts"><a/>

-   End point `GET /feed/followedPosts/`
    -   Purpose: to get the posts followed by the user
        , organized in terms of levels of fulfillment
        
-   Headers:

    ```javascript
    {
        "Content-Type": "multipart/form-data",
        "token": "<login_token>"
    }
    ```

-   Request Body:  
    {
        //empty
    }

-   Response:
    `200 OK`

    ```javascript
    {
    "unfulfilled": [
        {
            <POSTOBJ>
        },
        {
            <POSTOBJ>
        }
    ],
    "pending": [
        {
            <POSTOBJ>
        }
    ],
    "fulfilled": [
        {
            <POSTOBJ>
        }
    ]
    }
    ```