from pydantic import BaseModel
# This file is used to define the schemas


class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class Prediction(BaseModel):
    label: str
    probability: float

class PredictionResponse(BaseModel):
    prediction: list[Prediction]