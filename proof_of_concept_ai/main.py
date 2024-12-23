import sys
import cv2
import cvzone
import pickle
import numpy as np
import face_recognition

from PyQt5.QtCore import Qt, QTimer, QDateTime
from PyQt5.QtGui import QImage, QPixmap
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QVBoxLayout, QHBoxLayout, QWidget, QLineEdit, QDateTimeEdit, QPushButton

from setupFacesDataLocal import get_userinfo_local

people = get_userinfo_local()
print(people)

event_info = {
    "title": "Introduction to AI",
    "start_time": "2023-10-12 11:30:00",
    "end_time": "2023-10-12 12:30:00",
    "location": "Jakarta"
}

# ------------------------------------
class WebcamOverlayApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Facettendance AI Prototype")
        self.setGeometry(100, 100, 1280, 800)

        self.imgBackground = cv2.imread('asset/background.jpg')
        self.imgBackground = cv2.resize(self.imgBackground, (1280, 800))

        file = open('encoding_results.p', 'rb')
        self.encodeListKnown, self.idList = pickle.load(file)
        print('face encodings loaded sucessfully')

        webcam_widget = QWidget()
        webcam_layout = QVBoxLayout()
        self.webcam_label = QLabel(self)
        self.webcam_label.setFixedSize(640, 480)
        webcam_layout.addWidget(self.webcam_label)
        webcam_widget.setLayout(webcam_layout)

        self.background_label = QLabel(self)
        self.background_label.setGeometry(0, 0, 1280, 800)

        self.form_layout = QVBoxLayout()
        self.title_input = QLineEdit(self)
        self.start_time_input = QDateTimeEdit(self)
        self.start_time_input.setDisplayFormat("yyyy-MM-dd HH:mm:ss")
        self.end_time_input = QDateTimeEdit(self)
        self.end_time_input.setDisplayFormat("yyyy-MM-dd HH:mm:ss")
        self.location_input = QLineEdit(self)

        self.title_input.setPlaceholderText(f'{event_info['title']}')
        self.start_time_input.setDateTime(QDateTime.currentDateTime())
        self.end_time_input.setDateTime(QDateTime.currentDateTime())
        self.location_input.setPlaceholderText(f'{event_info['location']}')
        self.title_input.setText(f'{event_info['title']}')
        self.location_input.setText(f'{event_info['location']}')

        self.submit_button = QPushButton("Submit", self)
        self.submit_button.clicked.connect(self.submit_form)

        self.form_layout.addWidget(self.title_input)
        self.form_layout.addWidget(self.start_time_input)
        self.form_layout.addWidget(self.end_time_input)
        self.form_layout.addWidget(self.location_input)
        self.form_layout.addWidget(self.submit_button)

        form_widget = QWidget(self)
        form_widget.setLayout(self.form_layout)

        self.user_info_label = QLabel('USER INFO DETECTED\nNone', self)
        self.user_info_label.setWordWrap(True)

        self.image_label = QLabel()
        pixmap = QPixmap('asset/background.jpg').scaled(200, 150, Qt.KeepAspectRatio)
        self.image_label.setPixmap(pixmap)
        self.image_label.setFixedSize(200, 150)

        user_info_layout = QVBoxLayout(self)
        user_info_layout.addWidget(self.image_label)
        user_info_layout.addWidget(self.user_info_label)

        user_info_widget = QWidget(self)
        user_info_widget.setLayout(user_info_layout)

        info_layout = QVBoxLayout()
        info_layout.addWidget(form_widget)
        info_layout.addWidget(user_info_widget)

        info_widget = QWidget()
        info_widget.setLayout(info_layout)

        main_layout = QHBoxLayout()
        main_layout.addWidget(webcam_widget)
        main_layout.addWidget(info_widget)

        central_widget = QWidget()
        central_widget.setLayout(main_layout)
        self.setCentralWidget(central_widget)

        # Setup webcam
        self.cap = cv2.VideoCapture(0)
        self.cap.set(3, 640)
        self.cap.set(4, 480)

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_frame)
        self.timer.start(1000 // 30) #30FPS

    def submit_form(self):
        event_info['title'] = self.title_input.text()
        event_info['start_time'] = self.start_time_input.dateTime().toString("yyyy-MM-dd HH:mm:ss")
        event_info['end_time'] = self.end_time_input.dateTime().toString("yyyy-MM-dd HH:mm:ss")
        event_info['location'] = self.location_input.text()

        self.title_input.clear()
        self.location_input.clear()

        self.title_input.setPlaceholderText(f'{event_info['title']}')
        self.location_input.setPlaceholderText(f'{event_info['location']}')
        self.title_input.setText(f'{event_info['title']}')
        self.location_input.setText(f'{event_info['location']}')

    def update_frame(self):
        success, img = self.cap.read()
        if not success:
            return

        scale = 0.25
        imgS = cv2.resize(img, (0, 0), None, scale, scale)
        imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

        faceCurFrame = face_recognition.face_locations(imgS)
        encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

        content = 'USER INFO DETECTED\nNone'

        if len(faceCurFrame) == 0:
            self.user_info_label.setText(content)
            pixmap = QPixmap('asset/background.jpg').scaled(200, 150, Qt.KeepAspectRatio)
            self.image_label.setPixmap(pixmap)

        for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):

            matches = face_recognition.compare_faces(self.encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(self.encodeListKnown, encodeFace)
            print("matches :", matches)
            print("faceDis :", faceDis)

            matchIndex = np.argmin(faceDis)
            print("match index: ", matchIndex)

            if matches[matchIndex]:
                
                print('Known Face Detected')
                print(faceLoc)

                y1, x2, y2, x1 = faceLoc
                y1, x2, y2, x1 = y1 / scale, x2 / scale, y2 / scale, x1 / scale

                bbox = (int(x1), int(y1), int(x2 - x1), int(y2 - y1))
                cvzone.cornerRect(img, bbox, rt=0)

                print("Bounding box:", bbox)
                print(int(self.idList[matchIndex]))

                current_time = QDateTime.currentDateTime()
                start_time = QDateTime.fromString(event_info['start_time'], "yyyy-MM-dd HH:mm:ss")
                end_time = QDateTime.fromString(event_info['end_time'], "yyyy-MM-dd HH:mm:ss")
                
                pixmap = QPixmap('asset/background.jpg').scaled(150, 100, Qt.KeepAspectRatio)
                self.image_label.setPixmap(pixmap)

                # ubah konten user info sesuai kondisi yang dicapai
                if start_time > current_time:
                    content = f"YOU CAN'T DO ATTENDANCE YET\nEvent Hasn't started..."
                elif end_time < current_time:
                    content = f"YOU CAN'T DO ATTENDANCE\n The Event Has Passed..."
                elif event_info['location'] != 'Jakarta':
                    content = f"YOU CAN'T DO ATTENDANCE\nYou're at Jakarta,\n but the event is at {event_info['location']}"
                else:
                    people[int(self.idList[matchIndex])]['last_attendance_time'] = QDateTime.currentDateTime().toString()

                    content = f"""
USER INFO DETECTED
name: {people[int(self.idList[matchIndex])]['name']}
id: {int(self.idList[matchIndex])}
total_attendance: {people[int(self.idList[matchIndex])]['total_attendance']}
last_attendance_time: {people[int(self.idList[matchIndex])]['last_attendance_time']}
                    """

                    pixmap = QPixmap(f'{people[int(self.idList[matchIndex])]['image']}').scaled(200, 150, Qt.KeepAspectRatio)
                    self.image_label.setPixmap(pixmap)

        self.user_info_label.setText(content)

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        height, width, channel = img.shape
        bytes_per_line = 3 * width
        qimage = QImage(img_rgb.data, width, height, bytes_per_line, QImage.Format_RGB888)

        pixmap = QPixmap.fromImage(qimage)
        self.webcam_label.setPixmap(pixmap)

        background_rgb = cv2.cvtColor(self.imgBackground, cv2.COLOR_BGR2RGB)
        background_qimage = QImage(background_rgb.data, 1280, 800, 3 * 1280, QImage.Format_RGB888)
        background_pixmap = QPixmap.fromImage(background_qimage)
        self.background_label.setPixmap(background_pixmap)

    def closeEvent(self, event):
        # Lepas webcam saat prototype dimatikan
        self.cap.release()
        event.accept()
# ------------------------

# Jalanin prototype AI
app = QApplication(sys.argv)
window = WebcamOverlayApp()
window.show()
sys.exit(app.exec_())
