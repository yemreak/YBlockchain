const SHA256 = require("crypto-js/sha256"); // Hash (kimlik şifreleme) fonksiyonunun tanımlaması

class Blok {
    /**
     * @param indeks (index) Bloğun zincirdeki konum değeri 
     * @param (timestamp) tarihDamgası BLoğun oluşturulduğu tarih 
     * @param (data) veri Bloğıun tuttuğu veri 
     * @param (prevHash) öncekiKimlik Bir önceki bloğun kimlik değeri 
     * @param kimlik (hash) Bloğun özlük bilgisi (kimlik değeri) 
     * @param anlıkZaman (nonce) [kimlikHesapla] her çalıştığında farklı kimlik hesaplanması için kullanılır
     */
    // İndex: Where is the Bloks sit on the zincir.
    // tarihDamgası: Tell us when the Blok are created
    // veri: Any type of veri which you want to associate with this Blok.
    // öncekiKimlik: The string which contains the kimlik of the Blok before.
    constructor(indeks, tarihDamgası, veri, öncekiKimlik = '') {
        this.indeks = indeks;
        this.tarihDamgası = tarihDamgası;
        this.veri = veri;
        this.öncekiKimlik = öncekiKimlik;
        this.kimlik = this.kimlikHesapla();
        this.anlıkZaman = 0; // Blok oluşturmayı zorlaştırmak için eklendi
    }

    /**
     * Bloğun kimlik verisini hesaplar.
     */
    kimlikHesapla() {
        return SHA256(
            this.index +
            this.öncekiKimlik +
            this.tarihDamgası +
            JSON.stringify(this.veri) +
            this.anlıkZaman // Blok oluşturmayı zorlaştırmak için eklendi
        ).toString();
    }

    /**
     * Blok oluşturmak için kullanılır.
     * @param zorluk Blok oluşturmayı zorlaştırma katsayısı
     */
    blokOluştur(zorluk) { // Blok oluşturmayı zorlaştırmak için eklendi
        while (
            this.kimlik.substring(0, zorluk) !==
            // Array'i "0" (normalde ","") ile ayırarak string'e çevirir. 0 sayısı = zorluk
            Array(zorluk + 1).join("0")
        ) {
            // Her denemede farklı veri oluştmak için anlık değeri değiştiriyoruz.
            this.anlıkZaman++;

            this.kimlik = this.kimlikHesapla();
        }

        console.log("Blok oluşturuldu: " + this.kimlik);
    }
}

class Blockchain {
    constructor() {
        this.zincir = [this.başlangıçBloğuOluştur()]; // Blok dizisi
        this.zorluk = 4; // Blok oluşturmayı zorlaştırmak için eklendi
    }

    /**
     * Blokchain'in ilk bloğunu oluşturmak için kullanılır.
     * @return Zincirin başlangıç bloğu
     */
    başlangıçBloğuOluştur() {
        return new Blok(0, "08/05/2018", "Genesis Blok", "0")
    }

    /**
     * Zincirin sonundaki blok verisinin kimliğine erişmek için kullanılır.
     * @return Zincirin sonundaki blok
     */
    sonBloğuAl() {
        return this.zincir[this.zincir.length - 1];
    }

    /**
     * Zincire blok eklemek için kullanılır.
     * @param yeniBlok Eklenecek blok
     */
    blokEkle(yeniBlok) {
        // Yeni bloğun eskiKimliği en sondaki bloğn kimliğini tutmak zorunda.
        yeniBlok.öncekiKimlik = this.sonBloğuAl().kimlik;
        // Yeni blok oluşturma
        yeniBlok.blokOluştur(this.zorluk); // Blok oluşturmayı zorlaştırmak için eklendi
        // Bloğu zincire ekleme
        this.zincir.push(yeniBlok);
    }

    /**
     * Zİncirin değiştirilmemiş olduğunu kontrol eder.
     * @return Eğer değiştirilmemiş ise "true"
     */
    zincirGeçerliMi() {
        // 0. blok başlangıç bloğu olduğu için ona bakmıyoruz.
        for (let i = 1; i < this.zincir.length; i++) {
            // Her bir zincirin kimliğinin kontrolünü yapıyoruz.
            if (this.zincir[i].kimlik !== this.zincir[i].kimlikHesapla()) {
                return false;
            }
            // Her bir zincirin tutmuş olduğu önceki kimliklerin doğruluğunu kontrol ediyoruz.
            if (this.zincir[i].öncekiKimlik !== this.zincir[i - 1].kimlik) {
                return false;
            }
        }

        return true;
    }
}

class Test {
    /**
     *  Blok verilerinin değişkliğe karşı tavrını test ediyoruz.
     * v1.0
     */
    test1() {
        let yCoin = new Blockchain();
        yCoin.blokEkle(new Blok(1, "08/05/2018", {
            tutar: 4
        }));
        yCoin.blokEkle(new Blok(2, "08/05/2018", {
            tutar: 10
        }));
        yCoin.blokEkle(new Blok(3, "08/05/2018", {
            tutar: 20
        }));

        console.log(JSON.stringify(yCoin, null, 4));

        /**
         * Eğer veriyi değiştirirsek, yeni kimlik farklı bir değer olacaktır.
         * Blockchain değişen kimlik verisini [zincirGeçerliMi]'nin 2. if kısmında fark edecektir.
         */
        yCoin.zincir[1].veri = {
            tutar: 100
        }
        console.log("Is the first Blockchain valid? " + yCoin.zincirGeçerliMi());
        /**
         * Eğer kimlik verisini de değiştirirsek, bir sonraki bloğun tutmuş olduğu öncekiKimlik
         * ile şu anki kimlik uyuşmayacaktır. Blockchain [zincirGeçerliMi]'nin 2. if kısmında fark edecektir.
         */
        yCoin.zincir[1].kimlik = yCoin.zincir[1].kimlikHesapla();
        console.log("Is the second Blockchain valid? " + yCoin.zincirGeçerliMi());
    }

    /**
     * Blokchain'de blok oluşturma testi. (v1.1)
     */
    test2() {
        let yCoin = new Blockchain();
        yCoin.blokEkle(new Blok(1, "08/05/2018", {
            tutar: 4
        }));
        yCoin.blokEkle(new Blok(2, "08/05/2018", {
            tutar: 4
        }));
    }
}

new Test().test2();