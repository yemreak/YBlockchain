# Blockchain

### **Versiyonların açıklamaları klasörlerinin içerisindedir.**

##  Version Özellikleri v1.2

* **veri** yerine **işlem** adlandırması getirilmiştir.
* **indeks** değeri kaldırılmıştır.
  * Blokların sıralanması *indeks* değerlerine göre *değil* içinde bulundukları *array'e* göre belirlenmelidir.
* **Test** class'ı yeniden yazılmıştır.
* **Mining ödülü** eklenmiştir.
* **İşlem Sırası** eklenmiştir.
* **Hesaplar arası** işlem yapma eklenmiştir.
  

###  Değişen & Eklenen objeler / metodlars

* class **Blok**
* class **İşlem**
* başlangıçBloğuOluştur
* class **Blockchain**
* madenİşlemiOluştur
* işlemOluştur
* adrestekiHesabiAl

### Kaldırılan Objeler / metodalar

* blokEkle


#  Version Özellikleri v1.1

  

* Türkçeleştirilmiştir.

* Basit blokchain işlemleri eklenmiştir.

* Yeni bloklar oluşturulurken zorluk eklenmiştir.

  1. **anlıkDeğer** değişkeni ile kimlik hesaplanırken her denemede yeni kimlik hesaplanıyor.

  2. **zorluk** ile kimlik değerinin başında zorluk değeri kadar 0 gelene kadar, kimlik değerini kabul etmiyoruz, bu sayede işlem zorlaşmış oluyor.

  

###  Değişen objeler

  

* class Block

* blockOluştur

* kimlikHesapla

* blockEkle

* class Blockchain

  
  

#  Version Features v1.0

  

* Simple blockcahin features
