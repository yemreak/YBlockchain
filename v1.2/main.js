/*
 * Konu: Basit node kod yapısı
 * Açıklama: Tasarımı açıklama adına basit bir başlangıç kodu.
 * Yazar: Yunus Emre
 * Tarih: 08 / 08 / 2018
 */


// Bağlı içerikler (dosya vs.)
const SHA256 = require("crypto-js/sha256"); // Hash (kimlik şifreleme) fonksiyonunun tanımlaması

class İşlem {
    /**
     * @param {string} verici İşlemi yapan kişi adresi
     * @param {string} alıcı İşlemin yapıldığı kişi adresi
     * @param {number} tutar İşlem tutarı
     */
    constructor(verici, alıcı, tutar) { 
        this.verici = verici;
        this.alıcı = alıcı;
        this.tutar = tutar;
    }
}

class Blok {
    /**
     * @param {number} tarihDamgası (timestamp)  BLoğun oluşturulduğu tarih
     * @param {İşlem} işlem (transaction)  Bloğıun tuttuğu veri
     * @param {string} öncekiKimlik (prevHash) Bir önceki bloğun kimlik değeri
     * @param {string} kimlik (hash) Bloğun özlük bilgisi (kimlik değeri)
     * @param {number} anlıkZaman (nonce) [kimlikHesapla] her çalıştığında farklı kimlik hesaplanması için kullanılır
     */
    constructor(tarihDamgası, işlem, öncekiKimlik = '') {
        this.tarihDamgası = tarihDamgası;
        this.işlem = işlem;
        this.öncekiKimlik = öncekiKimlik;
        this.kimlik = this.kimlikHesapla();
        this.anlıkZaman = 0;
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
            this.anlıkZaman
        ).toString();
    }

    /**
     * Blok öğesi oluşturmak için kullanılır.
     * @param {number} zorluk Blok oluşturmayı zorlaştırma katsayısı
     */
    blokMadenciliği(zorluk) {
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
        this.zorluk = 4;
        this.bekleyenİşlemler = [];
        this.oluşturmaÖdülü = 100;
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
     * @param {string} alıcıAdresi Oluşturma (mining) işlemini yapan kişinin cüzdan adresi
     */
    madenİşlemiOluştur(alıcıAdresi) {
        let blok = new Blok(Date.now(), this.bekleyenİşlemler)
        blok.blokMadenciliği(this.zorluk);

        this.zincir.push(blok);
        console.log("Blok başarılı bir şekilde oluşturuldu");

        // Bekleyen işlemleri sıfırlayıp, öldülü işleme sokuyoruz.
        this.bekleyenİşlemler = [
            // verici Sistem olduğundan "null" yazıyoruz.
            new İşlem(null, alıcıAdresi, this.oluşturmaÖdülü)
        ];
    }

    işlemOluştur(işlem) {
        this.bekleyenİşlemler.push(işlem);
    }

    /**
     * Verilen adresteki hesab bilgilerini döndürür.
     * @param {string} adres Hesap bilgisi istenen adres
     * @return {number} Hesap bilgisi (para miktarı vs.)
     */
    adrestekiHesabiAl(adres) {
        // Başlangıçta hesapta 0 para var.
        let hesap = 0;

        // Zincirdeki her bloğu değişim yapmadan (const) inceliyoruz.
        for (const blok of this.zincir) {
            // Bloktaki her işlemi değişim yapmadan (const) inceliyoruz.
            for (const işlem of blok.işlem) {
                // Eğer veren kişi isek paramız azalır.
                if (işlem.verici === adres) {
                    hesap -= işlem.tutar;
                }
                // Eğer alan kişi isek paramız artacaktır.
                if (işlem.alıcı === adres) {
                    hesap += işlem.tutar;
                }
            }
        }

        return hesap;
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

let yCoin = new Blockchain();
console.log("yEmre'nin hesabı: ", yCoin.adrestekiHesabiAl("yEmre"));
yCoin.işlemOluştur(new İşlem("yEmre", "adres2", 100));
console.log("yEmre'nin hesabı: ", yCoin.adrestekiHesabiAl("yEmre"));
yCoin.işlemOluştur(new İşlem("yEmre", "adres1", 50));
console.log("yEmre'nin hesabı: ", yCoin.adrestekiHesabiAl("yEmre"));

console.log("\nMadencilik başladı..");
yCoin.madenİşlemiOluştur("yEmre");

console.log("yEmre'nin hesabı: ", yCoin.adrestekiHesabiAl("yEmre"));

console.log("\nMadencilik başladı..");
yCoin.madenİşlemiOluştur("yEmre");

console.log("yEmre'nin hesabı: ", yCoin.adrestekiHesabiAl("yEmre"));
