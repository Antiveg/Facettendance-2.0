import cv2
import os
import glob
import face_recognition

def extract_faces(inputfolder, outputfolder):

    input_folder = inputfolder
    output_folder = outputfolder

    image_files = glob.glob(os.path.join(input_folder, "*.png")) + glob.glob(os.path.join(input_folder, "*.jpg"))

    i = 1
    for file_name in image_files:
        print(f"Processing {file_name}...")

        img = cv2.imread(file_name)
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_img)

        for top, right, bottom, left in face_locations:

            cropped_face = img[top:bottom, left:right]
            
            target_file_name = os.path.join(output_folder, f"{i}.jpg")
            cv2.imwrite(target_file_name, cropped_face)

            i += 1

    print("Face extraction completed.")