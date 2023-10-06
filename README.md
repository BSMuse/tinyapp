# TinyApp Project

TinyApp is a full-stack web application built with Node and Express that allows users to shorten long URLs, similar to services like bit.ly.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Usage](#usage)
- [License](#license)

## Introduction

TinyApp is a URL shortening service that allows users to convert long URLs into shorter, more manageable links. It provides a web interface for users to create, manage, and share shortened URLs.

## Features

- Shorten long URLs into compact, shareable links.
- View a list of all shortened URLs.
- Edit the destination of a shortened URL.
- Delete a shortened URL.
- Secure user registration and authentication.
- User-specific URL management.

## Getting Started

To get started with TinyApp, follow these steps:

```bash
# Clone the repository:
git clone https://github.com/BSMuse/tinyapp.git

# Install the project dependencies:
npm install

# Start the TinyApp server:
npm start


Open a web browser and navigate to [http://localhost:8080](http://localhost:8080) to access the TinyApp interface.

## Dependencies

TinyApp relies on the following dependencies:

- `bcryptjs`: For password hashing and authentication.
- `cookie-session`: For managing user sessions.
- `ejs`: For server-side HTML templates.
- `express`: A web application framework for Node.js.
- `morgan`: A HTTP request logger middleware.

## Usage

1. Register for a TinyApp account or log in if you already have one.
2. Use the TinyApp interface to create shortened URLs for long links.
3. Manage and edit your URLs from your dashboard.
4. Share your shortened URLs with others.

## License

This project is licensed under the ISC License.
