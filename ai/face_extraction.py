import face_recognition
from io import BytesIO

def extract_face_encoding(image_data: bytes):
    try:
        image = face_recognition.load_image_file(BytesIO(image_data))
        face_encodings = face_recognition.face_encodings(image)
        if len(face_encodings) == 1:
            return face_encodings[0]
        elif len(face_encodings) == 0:
            return "No face detected in the image."
        else:
            return f"Multiple faces found. Found {len(face_encodings)} faces."
    except Exception as e:
        print(f"Error in face encoding: {str(e)}")
        return "Unknown error"