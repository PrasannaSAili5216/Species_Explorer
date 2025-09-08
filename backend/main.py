from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from tensorflow.keras.preprocessing import image
import numpy as np
import io

import auth, models, schemas
from schemas import PredictionResponse
from database import SessionLocal, engine, Base, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://10.117.181.123:3000",
    "http://192.168.168.89:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



# Load the pre-trained model
model = MobileNetV2(weights='imagenet')


def get_prediction_from_bytes(contents: bytes) -> list:
    """
    Takes image bytes and returns a list of predictions.
    """
    # Load the image from bytes
    img = image.load_img(io.BytesIO(contents), target_size=(224, 224))

    # Preprocess the image
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Make a prediction
    predictions = model.predict(img_array)

    # Decode the prediction
    decoded_predictions = decode_predictions(predictions, top=3)[0]

    # Format the response
    result = [{"label": label, "probability": float(prob)} for (_, label, prob) in decoded_predictions]
    return result


@app.post("/token", response_model=schemas.Token)
# This function is used to get the token

async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.get_user(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
# This function is used to create the user
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = auth.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me/", response_model=schemas.User)
# This function is used to read the current user
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/")
# This function is used to show the welcome message
def read_root():
    return {"message": "Welcome to the Organism Species Checker API"}

@app.post("/predict", response_model=PredictionResponse)
# This function is used to predict the image of an animal
async def predict_image(
    file: UploadFile = File(...)
):
    contents = await file.read()
    result = get_prediction_from_bytes(contents)
    return {"prediction": result}

@app.post("/predict_microbe", response_model=PredictionResponse)
# This function is used to predict the image of a microbe
async def predict_microbe(file: UploadFile = File(...)):
    contents = await file.read()
    result = get_prediction_from_bytes(contents)
    return {"prediction": result}