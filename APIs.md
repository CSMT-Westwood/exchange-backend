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
    7. [Get all notifications](#notifications)
2. [Offer / Request](#offreq)
    1. [Make a Post](#make-a-post)
    2. [Search for Posts](#post-search)
3. [Feed](#Feed)
    1. [getFeed](#getFeed)
    2. [get My Posts](#getMyPosts)
    3. [get Followed Posts](#getFollowedPosts)
4. [User-Post interaction](#userPost)
    1. [client marks a post as Interested](#accept)
    2. [host accept a client](#chooseClient)
5. [Helper APIs](#helper)
    1. [getUser by ID](#getUserByID)
    2. [getUser by userame](#getUserByUsername)

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
            "followedPosts":"<array_of_followed_posts>",
            "rp": "<rp>",
            "avatar":"<link of avatar>", //value is null if no avater
            "avatar":"<avatar_ID>",
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

### 7. Get Notifications <a name="notifications"></a>

-   End point: `POST /user/notifications`
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json"
        "token":"<login_token>"
    }
    ```
-   Request Body:
    ```javascript
    {
    }
    ```
-   Response:
    -   `200 OK`
        ```javascript
        [
            {
                "unread": true,
                "relatedPost": null,
                "relatedUser": null,
                "_id": "5ed04d69b96a093be0da80e2",
                "recipient": "5ed04d69b96a093be0da80e1",
                "type": 0,
                "message": "Welcome to eXchange!",
                "activity_date": "2020-05-28T23:46:49.487Z",
                "__v": 0
            },
            {
                "unread": true,
                "relatedPost": "5ed04f61b96a093be0da80eb",
                "relatedUser": "5ed04d6eb96a093be0da80e3",
                "_id": "5ed058a22b26e3660ce28a2d",
                "recipient": "5ed04d69b96a093be0da80e1",
                "type": 2,
                "message": "You have followed the post. Please wait for the host to respond.",
                "activity_date": "2020-05-29T00:34:42.502Z",
                "__v": 0
            }
            {
                <NotificationObj>
            }
        ]
        ```
    -   `400 Bad Request` 
        ```javascript
        {
            "message": "<error_message>"
        }
        ```

- Notification type numbers:

    - `0: welcome. Appears when first sign up.`
    - Client accepts posts:
        - `1: a client has followed to your post(offer/request)`
        - `2: You (as a client) have followed a post. Please wait for response from host.`
    - Host accepts:
        - `3: You (as a host) have accepted a client. The post is fulfilled.`
        - `4: You (as a client) have been accepted. `
        - `5. The client did not select you(rejected). The post is fulfilled.`

### 8. Read Notifications <a name="readNotifications"></a>

- End point: `POST /user/readNotification`
- Headers:
    ```javascript
    {
        "Content-Type": "application/json",
        "token": "<login_token>"
    }
    ```
-   Request Body:
    ```javascript
    {
        "notificationID":"<notificationID_to_read>"
    }
    ```
    
- Response:
    - `200 OK`
    ```javascript
    {
    "message": "Success: read notification."
    }
    ```
    - `400 Bad Request`
    ```javascript
    {
    "message": "<error_message>"
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
            "author": {
                "username": "<usename>",
                "rp": "<rp>",
                "email": "<email>"
            },
            "clients": [
                {
                    // similar to the author obj ^
                },  // and more
            ]
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
            "author": {
                "username": "<usename>",
                "rp": "<rp>",
                "email": "<email>"
            },
            "clients": [
                {
                    // similar to the author obj ^
                },  // and more
            ]
        }
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
    ```javascript
    {
        //empty
    }
    ```

-   Response:
    -   `200 OK`

    ```javascript
    {
    "preferencePosts":[
        {
            "fulfilled": 1,
            "clients":[
                {
                "_id": "5ec0e0d707a63f58a074bf3f",
                "rp": 10,
                "username": "frank1",
                "email": "zhou123456@ucla.edu"
                }
            ]
            "_id":"5ec596f9503339e002e2e010",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is the best class ever(fulfilled)",
            "author":  {
                "_id": "5eb882153e72a51110bec821",
                "username": "TonyXia",
                "email": "Tony12345@g.ucla.edu",
                "rp": 1505
            },
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
    ]
    }

    ```

### 2. get MyPost <a name="getMyPosts"></a>
-   End point `GET /feed/myPosts/`
    -   Purpose: to get the posts created by the user
        , organized in terms of levels of fulfillment

    - Headers:

    ```javascript
    {
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
            "clients":[<author>,<author>],
            "_id": "5ec5d6875cd7321734f06a42",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs100",
            "description": "yesyesyes",
            "author": {
                "_id": "5ec0e0d707a63f58a074bf3f",
                "rp": 10,
                "username": "frank1",
                "email": "zhou123456@ucla.edu"
            },
            "publication_date": "2020-05-21T01:16:55.879Z",
            "__v": 0
        },
        {
            "fulfilled": 0,
            "clients":[],
            "_id": "5ec5d6bc5cd7321734f06a43",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is the best class ever",
            "author":  {
                "_id": "5ec0e0d707a63f58a074bf3f",
                "rp": 10,
                "username": "frank1",
                "email": "zhou123456@ucla.edu"
            },
            "publication_date": "2020-05-21T01:17:48.442Z",
            "__v": 0
        }
    ],
    "pending": [
        {
            "fulfilled": 1,
            "clients":[],
            "_id": "5ec5d6d35cd7321734f06a44",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is the best class ever(fulfilled)",
            "author": <author>,
            "publication_date": "2020-05-21T01:18:11.235Z",
            "__v": 0
        }
    ],
    "fulfilled": [
        {
            "fulfilled": 2,
            "clients":[],
            "_id": "5ec5d6e35cd7321734f06a45",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "cs97",
            "description": "This is hard)",
            "author": {
                "_id": "5ec0e0d707a63f58a074bf3f",
                "rp": 10,
                "username": "frank1",
                "email": "zhou123456@ucla.edu"
            },
            "publication_date": "2020-05-21T01:18:27.270Z",
            "__v": 0
        }
    ]
    }

    ```

### 3. get Followed posts <a name="getFollowedPosts"><a/>

-   End point `GET /feed/followedPosts/`
    -   Purpose: to get the posts followed by the user
        , organized in terms of levels of fulfillment

-   Headers:

    ```javascript
    {
        "token": "<login_token>"
    }
    ```

-   Request Body:  
    ```javascript
    {
        //empty
    }
    ```

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

## Feed <a name="userPost"></a>

### 1. client marks a post as Interested <a name="accept"></a>

- End point: `POST /post/follow`
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
        "_id":"<postID>"
    }
    ```

- Response:
    - `200 OK`
        ```javascript
        {
            "message":"<success_message>"
        }
        ```
    - `400 Bad Request`
        ```javascript
        {
            "message":"<error_message>"
        }
        ```    

### 2. host accepts a client <a name= "chooseClient"></a>

- End point: `POST /post/chooseClient`
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
        "postID":"<postID>",
        "clientID":"<clientID>"
    }
    ```

- Response:
    - `200 OK`
        ```javascript
        {
            "message":"<success_message>",
            "host": <UserObj>",
            "client":<UserObj>,
            "post":<PostObj>
        }
        ```

    -  example:
        ```javascript
        {
        "message": "You have successfully accepted a client",
        "host": {
            "info": {
            "num_of_followers": 0,
            "last_login": "2020-05-28T23:53:53.789Z",
            "date_of_creation": "2020-05-28T23:46:54.239Z"
        },
            "preferences": [],
            "posts": [
                "5ed04f50b96a093be0da80e8",
                "5ed04f57b96a093be0da80e9",
                "5ed04f5fb96a093be0da80ea",
                "5ed04f61b96a093be0da80eb" 
            ],
            "followedPosts": [],
            "rp": 100,
            "avatar": null,
            "avatar_ID": null,
            "_id": "5ed04d6eb96a093be0da80e3",
            "username": "tuser1",
            "password": "$2a$10$njQCGkC8wis0S7RGK47sB.i4nv0PtofWmVVNAAua5RX8SSNxPGrMi",
            "email": "tuser1@ucla.edu",
            "__v": 4
        },
        "client": {
            "info": {
                "num_of_followers": 0,
                "last_login": "2020-05-29T00:38:25.042Z",
                "date_of_creation": "2020-05-28T23:46:42.020Z"
            },
            "preferences": [],
            "posts": [],
            "followedPosts": [
                "5ed050d4b96a093be0da80ec",
                "5ed04f61b96a093be0da80eb",
                "5ed04f5fb96a093be0da80ea",
                "5ed04f57b96a093be0da80e9",
                "5ed04f50b96a093be0da80e8"
            ],
            "rp": 110,
            "avatar": null,
            "avatar_ID": null,
            "_id": "5ed04d62b96a093be0da80df",
            "username": "tuser3",
            "password": "$2a$10$SXY972qKmLYBVQxiv.MiFeDjAbr7nYU28FndyQWseFdTH130c90FO",
            "email": "tuser3@ucla.edu",
            "__v": 5
        },
        "post": {
            "fulfilled": 2,
            "clients": [
                "5ed04d62b96a093be0da80df"
            ],
            "_id": "5ed04f57b96a093be0da80e9",
            "typeOfPost": 0,
            "typeOfItem": 0,
            "itemName": "tuser1's book2",
            "description": "none",
            "author": "5ed04d6eb96a093be0da80e3",
            "publication_date": "2020-05-28T23:55:03.387Z",
            "__v": 2
        }
        }
        ```

    - `400 Bad Request`
        ```javascript
        {
            "message":"<error_message>"
        }
        ```    

## Helper APIs <a name="helper"></a>

### 1. Get User by ID <a name="getUserByID"></a>

-   End point: `GET /searchByID/<User ID to search>`  
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json"
    }
    ```
-   Request Body:
    ```javascript
    {
        Nothing
    }
    ```
-   Response:
    -   `200 OK`
        ```javascript
        {
            {
                "info": {
                    "num_of_followers": 0,
                    "last_login": "2020-05-30T09:03:17.047Z",
                    "date_of_creation": "2020-05-29T05:35:26.628Z"
                },
                "preferences":[],
                "posts": [
                    "5ed09fdfbf76217c103c724b",
                    "5ed09ffabf76217c103c724c",
                    "5ed09ffebf76217c103c724d",
                    "5ed0a000bf76217c103c724e",
                ],
                "followedPosts": [
                    <PostID>,
                    <PostID>
                ],
                "rp": 10,
                "avatar": <avatar_link>,
                "_id": "5ed09f1ebf76217c103c7249",
                "username": "testingbot",
                "email": "testtest@ucla.edu",
                "__v": 13
            }
        }
        ```
    -   `400 Bad Request` Cause: Bad ID

### 2. Get User by UserName <a name="getUserByID"></a>

-   End point: `GET /searchUser/<username to search>`  
-   Headers:
    ```javascript
    {
        "Content-Type": "application/json"
    }
    ```
-   Request Body:
    ```javascript
    {
        Nothing
    }
    ```
-   Response:
    -   `200 OK`
        ```javascript
        {
            {
                "info": {
                    "num_of_followers": 0,
                    "last_login": "2020-05-30T09:03:17.047Z",
                    "date_of_creation": "2020-05-29T05:35:26.628Z"
                },
                "preferences":[],
                "posts": [
                    "5ed09fdfbf76217c103c724b",
                    "5ed09ffabf76217c103c724c",
                    "5ed09ffebf76217c103c724d",
                    "5ed0a000bf76217c103c724e",
                ],
                "followedPosts": [
                    <PostID>,
                    <PostID>
                ],
                "rp": 10,
                "avatar": <avatar_link>,
                "_id": "5ed09f1ebf76217c103c7249",
                "username": "testingbot",
                "email": "testtest@ucla.edu",
                "__v": 13
            }
        }
        ```
    -   `400 Bad Request` Cause: Bad username