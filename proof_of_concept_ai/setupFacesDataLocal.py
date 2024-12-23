from face_extraction import extract_faces
from encode_generator import encode_faces

extract_faces("base_photos","detected_faces")
encode_faces("detected_faces")

# setelah ini isi data berikut sesuai nomor foto yang udah di detected_faces
data = [
    {}, #biarin aja jangan diisi
    { #1
        "name": "VVVV",
        "total_attendance": 6,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/1.jpg"
    },
    { #2
        "name": "WWWW",
        "total_attendance": 5,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/2.jpg"
    },
    { #3
        "name": "XXXX",
        "total_attendance": 5,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/3.jpg"
    },
    { #4
        "name": "YYYY",
        "total_attendance": 3,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/4.jpg"
    } # dst.
]

def get_userinfo_local():
    return data