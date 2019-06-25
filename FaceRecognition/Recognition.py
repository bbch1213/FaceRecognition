import pyrebase
import time
import face_recognition

config = {
  "apiKey": "AIzaSyDSODF46yuYQ1OF5S4TwvgXpcB2wUW7Eps",
  "authDomain": "facedoor-18f8b.firebaseapp.com",
  "databaseURL": "https://facedoor-18f8b.firebaseio.com",
  "storageBucket": "facedoor-18f8b.appspot.com",
  "serviceAccount": "db.json"
}

firebase = pyrebase.initialize_app(config)

flag2 = False
#
#
db = firebase.database()

def stream_handler(message):
    global flag2
    # global firebase
    # pp(message)
    # print(message["event"]) # put
    # print(message["path"]) # /-K7yGTTEp7O549EzTYtI
    # print(message["data"]) # {'title': 'Pyrebase', "body": "etc..."}
    users = message["data"]

    if(flag2 != False):
        path = users["userName"]+"/"+users["imageName"]
        imageName = users["imageName"]
        print(users["userName"] + "가 " + imageName +"으로 인증요청을 하였습니다.")
        time.sleep(10)

        print("downloading...")
        firebase.storage().child(path).download("compare.jpg")
        firebase.storage().child(users["userName"] + "/s1.jpg").download("s1.jpg")
        firebase.storage().child(users["userName"] + "/s2.jpg").download("s2.jpg")
        firebase.storage().child(users["userName"] + "/s3.jpg").download("s3.jpg")
        firebase.storage().child(users["userName"] + "/s4.jpg").download("s4.jpg")
        firebase.storage().child(users["userName"] + "/s5.jpg").download("s5.jpg")

        saved_image1 = face_recognition.load_image_file("s1.jpg")
        saved_face_encoding1 = face_recognition.face_encodings(saved_image1)[0]

        saved_image2 = face_recognition.load_image_file("s2.jpg")
        saved_face_encoding2 = face_recognition.face_encodings(saved_image2)[0]

        saved_image3 = face_recognition.load_image_file("s3.jpg")
        saved_face_encoding3 = face_recognition.face_encodings(saved_image3)[0]

        saved_image4 = face_recognition.load_image_file("s4.jpg")
        saved_face_encoding4 = face_recognition.face_encodings(saved_image4)[0]

        saved_image5 = face_recognition.load_image_file("s5.jpg")
        saved_face_encoding5 = face_recognition.face_encodings(saved_image5)[0]

        compare_image = face_recognition.load_image_file("compare.jpg")
        loaded_face_encoding = face_recognition.face_encodings(compare_image)[0]

        known_faces = [
            saved_face_encoding1,
            saved_face_encoding2,
            saved_face_encoding3,
            saved_face_encoding4,
            saved_face_encoding5
        ]

        # results is an array of True/False telling if the unknown face matched anyone in the known_faces array
        results = face_recognition.compare_faces(known_faces, loaded_face_encoding)

        a_count = 0
        count = 0
        for a in results:
            if a:
                a_count += 1
                count += 1
            else:
                count += 1

        if a_count/count >= 0.8:
            data = {"userName": users["userName"], "permission": "y"}
            db.child("server").push(data)
        else:
            data = {"userName": users["userName"], "permission": "n"}
            db.child("server").push(data)

        print("동일인물입니까 {}".format(results[0]))

    flag2 = True


my_stream = db.child("message").child("app").stream(stream_handler)