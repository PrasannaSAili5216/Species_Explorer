
**Home Page:**

![Home Page](./Home%20Page%20.png)

# Species_Explorer

Species_Explorer is a full-stack web application designed to identify different species from user-uploaded images. It leverages a Python backend powered by FastAPI and a TensorFlow machine learning model for image classification, and a modern frontend built with React and TypeScript.

## Features

*   **User Authentication:** Secure user sign-up and login functionality.
*   **Image Upload:** Simple drag-and-drop interface for uploading images.
*   **Species Identification:** Utilizes a deep learning model to predict the species in the uploaded image.
*   **Responsive Design:** A clean and modern user interface built with Material-UI.

## Tech Stack

### Backend

*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
*   **Machine Learning:** [TensorFlow](https://www.tensorflow.org/)
*   **Database:** [SQLAlchemy](https://www.sqlalchemy.org/)
*   **Authentication:** [python-jose](https://github.com/mpdavis/python-jose) for JWT tokens, [passlib](https://passlib.readthedocs.io/en/stable/) for password hashing
*   **Image Processing:** [Pillow](https://python-pillow.org/)
*   **Server:** [Uvicorn](https://www.uvicorn.org/)

### Frontend

*   **Framework:** [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI Library:** [Material-UI](https://mui.com/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **File Uploads:** [React Dropzone](https://react-dropzone.js.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   **Node.js and npm:** Make sure you have Node.js and npm installed. You can download them from [here](https://nodejs.org/).
*   **Python:** Make sure you have Python 3.7+ installed. You can download it from [here](https://www.python.org/).

### Installation & Setup

**1. Clone the repository:**

```sh
git clone https://github.com/PrasannaSAili5216/Species_Explorer.git
cd Species_Explorer
```

**2. Backend Setup:**

```sh
cd backend
# Create a virtual environment
python -m venv venv
# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
# Install the required packages
pip install -r requirements.txt
```

**3. Frontend Setup:**

```sh
cd ../frontend
# Install NPM packages
npm install
```

### Running the Application

**1. Start the Backend Server:**

From the `backend` directory, run the following command to start the FastAPI server:

```sh
uvicorn main:app --reload
```

**2. Start the Frontend Development Server:**

From the `frontend` directory, run the following command:

```sh
npm start
```

The application will open automatically in your browser at `http://localhost:3000`.

## Usage

1.  **Sign Up / Log In:** Create a new account or log in with your existing credentials.
2.  **Upload an Image:** Navigate to the image upload section and drag-and-drop an image file or click to select a file.
3.  **View Results:** The application will process the image and display the predicted species.


