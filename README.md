# Shortify



This is an app that allows the User to shorten their URL Links. If they log in the also have access to a couple of statitics.

## User Stories

* **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **Homepage** - As a user I want to be able to access the homepage to I can shorten my Url..
- **sign up** - As a user I want to sign up on the web page so i can login.
- **login** - As a user I want to be able to log in on the web page so that I can have access to the statistics of the shortened Urls
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.

## Backlog



# Client / Frontend

## React Router Routes (React App)

| Path      | Component  | Permissions | Behavior                                          |
|-----------|------------|-------------|---------------------------------------------------|
| `/login`  | LoginPage  |             | Login form, navigates to home page after login.   |
| `/signup` | SignupPage |             | Signup form, navigates to home page after signup. |
| `/`       | HomePage   |             | Home page.                                        |

## Components

Pages:

* LoginPage
* SignupPage
* HomePage

Components:

* Navbar

## Services

* None

  

# Server / Backend

## Models

**User model**

```js
{
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  urlData: [{ type: Schema.Types.ObjectId, ref: "Url" }],
    
}
```

**Url Model**

```js
fullUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
        default: shortId.generate
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    },
    shortCount: {
        type: Number,
        required: true,
        default: 0,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
```




## API Endpoints (backend routes)

| HTTP Method | URL              | Request Body            | Success status | Error Status | Description                                                                                                                     |
|-------------|------------------|-------------------------|----------------|--------------|---------------------------------------------------------------------------------------------------------------------------------|
| `GET`       | `/auth/verify` | Saved session           | 200            | 404          | Verify tokens stored                                                         |
| `POST`      | `/auth/signup`   | {name, email, password} | 201            | 404          | Sends req.body to register the User |
| `POST`      | `/auth/login`    | {username, password}    | 200            | 401   | Checks User in DB if found logs him in |
| `POST`      | `/auth/logout`   |                         | 204            | 400          | Logs out the user                                                                                                               |
| `GET`       | `/api/users/current` |                           | 200            | 401          | Get current user info                  |
| `GET`     | `/api/urlList` |                         | 200 | 500 | Retrieves List of Urls                                                                                        |
| `POST` | `/api/shortUrl` | {fullUrl} | 201 | 500 |Creates a Url Entry in DB|
| `POST` | `/api/userUr` | { fullUrl, userIdentity } | 201 | 400 | Creates a Url entry in DB for the User |
| `GET` | `/api/:shortURL` | :shortURL                 | 200 | 400 | Redirects User to Full Url |

