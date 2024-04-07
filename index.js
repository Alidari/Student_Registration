const client = require("./database.js");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const Express = require("express");
const app = Express();

app.use(bodyParser.json());

client.connect();

app.listen(3000, () => {
    console.log("Server is listening at port 3000")
})

//Bölüm tablosu oluşturma
const bolumTable = client.query(`CREATE TABLE IF NOT EXISTS public.bolum
(
    id integer NOT NULL,
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    std_id integer,
    CONSTRAINT "Bolum_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.bolum
    OWNER to postgres;`)

//Öğrenci tablosu oluşturma
const ogrTable = client.query(`CREATE TABLE IF NOT EXISTS public.ogrenci
(
    id integer NOT NULL,
    name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    dept_id integer,
    CONSTRAINT "Ogrenci_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ogrenci
    OWNER to postgres;`)


//Öğrenci sayaç tablosu oluşturma
const ogr_counter = client.query(`CREATE TABLE IF NOT EXISTS public.ogrenci_sayac
(
    sayac integer
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ogrenci_sayac
    OWNER to postgres;`)


const update_counter =  async () => {
    const allStudents = await client.query("SELECT * FROM ogrenci");
    const counter = await client.query("Select * From ogrenci_sayac");
    const ogr_count = allStudents.rowCount

    if(counter.rowCount > 0){
        client.query("UPDATE public.ogrenci_sayac SET sayac="+ogr_count)
    }
    else{
        client.query("INSERT INTO ogrenci_sayac (sayac) VALUES ($1) RETURNING *",[ogr_count])
    }

}

update_counter()

/*-------------------------------OGRENCI EKLEME GÜNCELLEME SİLME-----------------------------*/

//Tüm öğrenci listesini güncelleme
app.get('/students', async (req, res) => {
    try {
        const allStudents = await client.query("SELECT * FROM ogrenci");
        res.json(allStudents.rows);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('SERVER ERROR');
    }
});

app.get('/counter', async (req, res) => {
    try {
        const counter = await client.query("SELECT * FROM ogrenci_sayac");
        res.json(counter.rows);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('SERVER ERROR');
    }
});

//Öğrenci ekleme
app.post('/students', async (req, res) => {
    try {
        const { id, name, email, dept_id, counter } = req.body;

        //Departmana kayıtlı başka bir öğrenci bulunuyor mu kontrolü yapılmakta
        const dept_query = await client.query("SELECT dept_id FROM ogrenci WHERE dept_id=" + dept_id);

        //Öğrenci id'ye sahip başka bir öğrenci var mı
        if (dept_query.rowCount > 0) {
            res.status(500).send("Bu departmanda zaten bir öğrenci bulunuyor")
            console.log(dept_query)
        }
        //Öğrenciyi ekleme işlemi
        else {
            const newStudent = await client.query("INSERT INTO ogrenci (id,name,email,dept_id) VALUES ($1,$2,$3,$4) RETURNING *", [id, name, email, dept_id]);
            res.status(500).send(id + " numaralı öğrenci başarıyla eklenmiştir.")
            res.json(newStudent.rows[0]);
            console.log(req.body);
            //Ogrenci sayacı güncelleniyor
            update_counter();
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("SERVER ERROR");
    }
});

//Öğrenci güncelleme işlemi
app.put('/students', async (req, res) => {
    const { id, name, email, dept_id } = req.body;

    //Güncellenecek departman bilgisinde başka bir öğrenci bulunuyor mu kontrolü
    const dept_query = await client.query("SELECT dept_id FROM ogrenci WHERE dept_id=" + dept_id);

    //Başka bir öğrenci varsa ve bu öğrenci mevcut öğrenci değilse hata
    if (dept_query.rowCount > 0 && dept_query.rows[0].id != id) {
        res.status(500).send("Bu departmanda zaten bir öğrenci bulunuyor")
        console.log(dept_query)
    }
    //Güncelleme işlemi
    else {
        const updateStudent = await client.query("UPDATE public.ogrenci SET name='" + name + "', email='" + email + "', dept_id=" + dept_id + " WHERE id=" + id)
        res.status(500).send(id + " numaralı öğrenci bilgileri başarıyla güncellenmiştir.")
        res.json(updateStudent.rows[0]);
        console.log(req.body)
    }

})


//Silme işlemi
app.delete('/students', async (req, res) => {
    const { id } = req.body
    try {
        const std_query = await client.query("DELETE FROM ogrenci WHERE id=" + id);
        console.log(std_query)
        
        if(std_query.rowCount > 0){
            res.status(500).send(id + " Numaralı öğrenciyi silme işlemi başarılı")
            update_counter();
        }
        else{
            res.status(500).send("Bu id numaralı bir öğrenci bulunamadı")
        }

    }
    catch (err) {
        res.status(500).send("Silme işlemi başarısız bu id numaralı bir öğrenci olmayabilir")
    }

})
/*-------------------------------BOLUM EKLEME GÜNCELLEME SİLME-----------------------------*/

//Öğrenci için geçerli olan her şeyin bölüm için yazılmış hali
app.get('/bolum', async (req, res) => {
    try {
        const allDeprtmns = await client.query("SELECT * FROM bolum");
        res.json(allDeprtmns.rows);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send('SERVER ERROR');
    }
});


app.post('/bolum', async (req, res) => {
    try {
        const { id,name,std_id } = req.body;

        //Departmana kayıtlı başka bir öğrenci bulunuyor mu kontrolü yapılmakta
        const stdQuery = await client.query("SELECT std_id FROM bolum WHERE std_id=" + std_id);


        if (stdQuery.rowCount > 0) {
            res.status(500).send("Bu departmanda zaten bir öğrenci bulunuyor")
            console.log(stdQuery)
        }
        else {
            const newDepart = await client.query("INSERT INTO bolum (id,name,std_id) VALUES ($1,$2,$3) RETURNING *", [id, name, std_id]);
            res.status(500).send(id + " numaralı bölüm başarıyla eklenmiştir.")
            res.json(newDepart.rows[0]);
            console.log(req.body)
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("SERVER ERROR");
    }
});

app.put('/bolum', async (req, res) => {
    const { id, name, std_id} = req.body;

    const stdQuery = await client.query("SELECT std_id FROM bolum WHERE std_id=" + std_id);

    if (stdQuery.rowCount > 0 && stdQuery.rows[0].id != id) {
        res.status(500).send("Bu departmanda zaten bir öğrenci bulunuyor")
        console.log(stdQuery)
    }
    else {
        const updateDepart = await client.query("UPDATE public.bolum SET name='" + name + "',std_id=" + std_id + "+ WHERE id=" + id)
        res.status(500).send(id + " numaralı bolum bilgileri başarıyla güncellenmiştir.")
        res.json(updateDepart.rows[0]);
        console.log(req.body)
    }

})

app.delete('/bolum', async (req, res) => {
    const { id } = req.body
    try {
        const dept_query = await client.query("DELETE FROM bolum WHERE id=" + id);
        console.log(dept_query)
        
        if(dept_query.rowCount > 0){
            res.status(500).send(id + " Numaralı bolum silme işlemi başarılı")
        }
        else{
            res.status(500).send("Bu id numaralı bir bolum bulunamadı")
        }

    }
    catch (err) {
        res.status(500).send("Silme işlemi başarısız bu id numaralı bir bolum olmayabilir")
    }

})




