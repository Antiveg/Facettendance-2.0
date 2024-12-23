from face_extraction import extract_faces
from encode_generator import encode_faces

extract_faces("base_photos","detected_faces")
encode_faces("detected_faces")

# setelah ini isi data berikut sesuai nomor foto yang udah di detected_faces
data = [
    {}, #biarin aja jangan diisi
    { #1
        "name": "Erlina Sing",
        "total_attendance": 6,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/1.jpg"
    },
    { #2
        "name": "Susi Mullan",
        "total_attendance": 5,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/2.jpg"
    },
    { #3
        "name": "Felix Gerald",
        "total_attendance": 5,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/3.jpg"
    },
    { #4
        "name": "Stanic Dylan",
        "total_attendance": 3,
        "last_attendance_time": "2023-12-11 00:54:34",
        "image":"detected_faces/4.jpg"
    } # dst.
]

def get_userinfo_local():
    return data