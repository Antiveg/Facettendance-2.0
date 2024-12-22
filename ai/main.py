from fastapi import FastAPI, UploadFile, File, Request, Body, Form
from fastapi.responses import JSONResponse
from face_extraction import extract_face_encoding
from compare_faces import compare_faces
from typing import List
import numpy as np
import json

app = FastAPI()
    
@app.post("/encodes")
async def upload_images(files: List[UploadFile] = File(...)):
    results = []
    encodings = []
    for file in files:
        image_data = await file.read()
        try:
            encoding = extract_face_encoding(image_data)
            encodings.append(np.array(encoding))
            results.append({"filename": file.filename, "encoding": encoding.tolist()})
        except ValueError as e:
            results.append({"filename": file.filename, "error": str(e)})

    if encodings:
        final_encoding = np.mean(encodings, axis=0).tolist()
        return JSONResponse(content={
            "message": "Faces encoded successfully!",
            "final_encoding": final_encoding,
            "results": results,
            "success_encode": len(encodings)
        }, status_code=200)
    
    return JSONResponse(content={
        "message": "No valid face encodings could be extracted.",
        "results": results,
    }, status_code=400)

@app.post("/verify")
async def verify_image(file: UploadFile = File(...), users: str = Form(...)):

    users_data = json.loads(users)

    image_data = await file.read()
    encodings = []
    ids = []
    for user in users_data:
        encodings.append(user['face_data'])
        ids.extend([user['id']])

    result, distances = compare_faces(image_data, encodings)

    if distances is None or len(distances) == 0 or np.all(np.isnan(distances)):
        return JSONResponse(content={
            "message":"Warning",
            "content": "No face detected"
        })

    combinedResult = [[match, distance, user_id] for match, distance, user_id in zip(result, distances, ids)]
    matching = [entry for entry in combinedResult if entry[0] == True]

    if not matching:
        return JSONResponse(content={
            "message":"No matching face found",
            "match_result": "None"
        })
    
    matching_sorted = sorted(matching, key=lambda x: x[1])

    return JSONResponse(content={
        "message":"Matching face found",
        "match_result": True,
        "match_distance": matching_sorted[0][1],
        "match_userId": matching_sorted[0][2]
    })
