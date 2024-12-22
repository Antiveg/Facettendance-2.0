import face_recognition
import numpy as np
from face_extraction import extract_face_encoding

def compare_faces(imagedata: bytes, encodings):

    current_encoding = extract_face_encoding(imagedata)
    if isinstance(current_encoding, str) or len(current_encoding) <= 0:
        return "No face detected in the image.", None
    
    numpy_encodings = np.array(encodings)

    results = face_recognition.compare_faces(numpy_encodings, current_encoding)
    distances = face_recognition.face_distance(numpy_encodings, current_encoding)
    return results, distances
