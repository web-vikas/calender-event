# Calendar App

A simple calendar application built with React and integrated with an API to manage events.

## Live Demo

Check out the live demo [here](https://calender-evt.vercel.app/).


## Features

- View and manage events on a monthly calendar
- Add new events with a title, start date, end date, description, and color
- Edit existing events
- Visualize events with different colors on the calendar
- Prevent adding more than two events on the same date

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/web-vikas/calender-event.git
```
  
2. **Navigate to the project directory::**
```bash
cd calender-event
```
3. **Install dependencies:**
```bash
npm install 
  ```
4. **Create a MongoDB database and obtain the connection URI :**
Create a .env file in the root of the project.
Add the following line to the .env file, replacing YOUR_MONGODB_URI with your actual MongoDB URI:
 ```bash
 MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```
### Running the App
  ```bash
  npm run dev 
  ```
