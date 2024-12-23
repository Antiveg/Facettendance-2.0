import cv2
import face_recognition
import pickle
import os

def encode_faces(detected_faces_folder):
    
    folderPath = detected_faces_folder
    pathList = os.listdir(folderPath)
    imgList = []
    idList = []
    for path in pathList:
        imgList.append(cv2.imread(os.path.join(folderPath, path)))
        idList.append(os.path.splitext(path)[0])

    print(idList)

    def find_encodings(imagesList):
        encodeList = []
        for img in imagesList:
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            encode = face_recognition.face_encodings(img)[0]
            encodeList.append(encode)
        return encodeList

    print('encoding started...')
    encodeListKnown = find_encodings(imgList)
    encodeListKnownWithIds = [encodeListKnown, idList]
    print('encoding completed')

    encode_result_filename = 'encoding_results.p'
    file = open(encode_result_filename, 'wb')
    pickle.dump(encodeListKnownWithIds, file)
    file.close()

    print(f"encoding saved in {encode_result_filename}...")
