# Student_Registration

**KURULUM**
- 
- Veri tabanı bağlama
Veri tabanını bağlamak için bir ".env" dosyası oluşturun ve içerisine veri tabanı bilgilerinizi giriniz
Örnek .env dosya içeriği
`DB_HOST="localhost"`
`DB_USER="postgres"`
`DB_PORT=5432`
`DB_PASSWORD="DATABASE_SİFRENİZ"`
`DB_DATABASE="DATABASE_ISMI"`

içinde yer alan

	`DB_PASSWORD="DATABASE_SİFRENİZ"`
	`DB_DATABASE="DATABASE_ISMI" `

kısma kendi veri tabanı bilgilerinizi girebilirsiniz.

- Ardından terminalde `node ./index.js` komutunu yazarak dosyanızı çalıştırabilirsiniz.
- Tarayıcınız üzerinden `localhost:3000/students` yazarsanız kendi local hostunuza bağlanıp veri tabanındaki mevcut öğrencileri görüntüleyebilirsiniz. 
- Öğrenci veya Bölüm Ekleme Silme ve Güncelleme işlemleri
Bu işlemleri gerçekleştirebilmek için post, put veya delete isteklerini kullanmanız gerekiyor
Bu istekleri atabileceğiniz birçok araç mevcuttur verilecek örnekte ise Visual Studio Code eklentisi olan Thunder Client kullanılacaktır

![image](https://github.com/Alidari/Student_Registration/assets/92364056/1d5f5bc8-09b4-4823-86e3-a2bef26dd23e)

bu kısımdan bağlantı adresimizi ve göndereceğimiz istek türünü seçiyoruz. (Ekleme yapmak için; Post, Güncelleme yapmak için; Put, Silme işlemi için; Delete)

![image](https://github.com/Alidari/Student_Registration/assets/92364056/96709152-9fa5-4beb-90fc-ca6356b8bfc0)

ardından bu şekilde json formatında bilgileri gönderip veri tabanında güncellemelerde bulunabilirsiniz. 



