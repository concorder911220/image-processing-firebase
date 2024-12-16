## Setup

```bash
# create a firebase project and copy AccountKey.json to the src/config folder

# copy .env.example to .env
$ cp .env.example .env

# fill out the variables required from firebase project settings

# with docker
$ docker build -t image-generation-api .
$ docker run -p 3000:3000 image-generation-api

# install node modules with npm or yarn
$ npm install

# start the dev application
$ npm run start
```

## Project overview

```
- using cookie for better security rather than auth Token

- firebase authentication and role based authentication

- seeding for admin user
email: "superadmin@gmail.com",
password: "admin123",


```

| method | resource                     | description                                                     |
| :----- | :--------------------------- | :-------------------------------------------------------------- |
| `POST` | `/auth/login`                | login user                                                      |
| `POST` | `/auth/register`             | register user                                                   |
| `POST` | `/admin/grant-access`        | grant service access to user                                    |
| `POST` | `/admin/remove-access`       | remove service access to user                                   |
| `POST` | `/admin/benchmark`           | benchmark to compare the image generation speed of the services |
| `POST` | `/service/text-to-image`     | text to image effect                                            |
| `POST` | `/service/remove-background` | remove background effect                                        |
| `POST` | `/service/upscale`           | upscale effect                                                  |

```
Include three middlewares
- auth middleware
- role middleware (for admin only)
- service middleware (for service permission granted by admin)
```

## Benchmark

![alt text](./image.png)
