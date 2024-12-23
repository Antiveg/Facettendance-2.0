# Facettendance-2.0

Cara run aplikasi website Facettendance (local development)

1. VSCode (direkomendasi) untuk membuka folder project “Facettendance-2.0”
2. Setup server folder ai :
- download Python 3.12.0 (https://www.python.org/downloads/release/python-3120/)
- pergi ke directory folder ai (cd ../ai)
- pip install -r requirements.txt
- uvicorn main:app --reload
- Jika berhasil akan ada message di terminal
3. Setup server folder backend
- download Node.js (https://nodejs.org/en/download/source-code)
- download DBeaver (https://dbeaver.io/download/)
- download PostgreSQL Database (https://www.postgresql.org/download/)
- setup username, password database di Dbeaver dan buat database baru “Facettendance”
- pergi ke directory folder backend (cd ../backend)
- npx sequelize-cli db:migrate
- buat .env file dalam folder backend dan isi lah data dengan format berikut :
JWT_SECRETKEY=XXXX
DB_HOST=XXX.XXX.XXX.XXX (isi dengan host database di Dbeaver anda)
DB_USER=XXXX (isi dengan username database anda)
DB_PASS=XXXX (isi dengan password database anda)
DB_NAME=Facettendance
DB_DIALECT=postgres
DB_PORT=XXXX (isi dengan port database di Dbeaver anda)
- npm install
- npx nodemon server.js
4. Setup server folder frontend (jika Node.js sudah didownload, bisa skip step 1
- download Node.js (https://nodejs.org/en/download/source-code)
- pergi ke directory folder frontend (cd ../frontend)
- npm install
- npm run dev
5. Setelah semua server berhasil di setup (dijalankan). Gunakan website dengan masuk
ke localhost:5173 (default localhost server frontend) pada web browser anda
