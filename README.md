# CopperHand Studio web sitesi

[copperhandstudio.com](https://copperhandstudio.com) için kaynak kod. [Astro](https://astro.build) ile yapılmış statik bir site. `main` dalına her push'ta GitHub Actions siteyi derler ve GitHub Pages'e yayınlar.

## Çalıştırma

Node.js 22.22 veya üstü gerekir.

```sh
npm install      # ilk sefer
npm run dev      # http://localhost:4321, değişiklikleri anında gösterir
npm run build    # dist/ klasörüne son siteyi üretir
npm run preview  # dist/ klasörünü yerelde sunar
```

## Yeni oyun ekleme

Kod değişikliği gerekmez. Ana sayfadaki "Latest release" alanı, katalog listesi ve oyunun kendi sayfası bu dosyadan otomatik oluşur.

1. `games/` altında oyunun adıyla bir klasör aç. Klasör adı adres olur: `games/ice-runner/` → `copperhandstudio.com/games/ice-runner/`. Küçük harf, rakam ve tire kullan.
2. Görselleri klasöre at (boyutlar aşağıda).
3. Klasöre bir `game.json` koy. En kolayı `games/penguin-math-race/game.json` dosyasını kopyalayıp değiştirmek.
4. `npm run dev` ile kontrol et. Bir alan eksik ya da hatalıysa terminal hangi dosyada, hangi alanda olduğunu söyler.
5. Commit at ve push'la. Site birkaç dakika içinde güncellenir.

```
games/
  ice-runner/
    game.json
    cover.png
    icon.png
    screenshots/
      01.png
      02.png
```

### Katalog numarası

Her oyun çıkış tarihine göre sıralanır ve otomatik numara alır: ilk oyun `CH-001`, sonraki `CH-002`... Yeni çıkan oyun her zaman bir sonraki numarayı alır. Tarihi olmayan (henüz çıkmamış) oyunlar listenin sonuna gelir.

Ana sayfada en yeni oyun öne çıkar. Başka bir oyunu sabitlemek istersen onun dosyasına `"featured": true` ekle. Bir oyunu siteden geçici olarak kaldırmak için `"hidden": true` yeterli.

### Örnek `game.json`

```json
{
  "name": "Ice Runner",
  "tagline": "Tek cümlelik slogan.",
  "description": "Birinci paragraf.\n\nİkinci paragraf. Paragrafları boş satırla (\\n\\n) ayır.",
  "genre": "Endless runner",
  "platforms": ["ios", "android"],
  "releaseDate": "2026-12-01",

  "stores": [
    { "store": "app-store", "url": "https://apps.apple.com/app/id..." },
    { "store": "google-play", "url": "https://play.google.com/store/apps/details?id=..." }
  ],
  "trailer": { "youtube": "https://youtu.be/XXXXXXXXXXX" },
  "links": [
    { "label": "Privacy policy", "url": "/privacy-ice-runner.html" }
  ],

  "cover": "./cover.png",
  "coverAlt": "Kapak görselinde ne olduğunu anlatan kısa bir cümle.",
  "icon": "./icon.png",
  "screenshots": [
    { "src": "./screenshots/01.png", "alt": "Bu ekranda ne göründüğü." }
  ],

  "theme": {
    "scheme": "light",
    "colors": {
      "background": "#D7EEFA",
      "surface": "#FFFFFF",
      "text": "#14294A",
      "muted": "#43607F",
      "accent": "#FFC22E",
      "accentText": "#14294A",
      "highlight": "#F27BA8"
    },
    "font": { "family": "Fredoka", "weights": [500, 600, 700] },
    "radius": 22,
    "depth": 6,
    "tilt": -2,
    "ambient": [
      { "type": "snow", "density": 1, "speed": 0.8, "colors": ["#FFFFFF"] }
    ]
  }
}
```

### Alanlar

| Alan | Zorunlu | Açıklama |
| --- | --- | --- |
| `name`, `tagline`, `description`, `genre` | evet | Metin. Çok dilli için aşağıya bak. |
| `platforms` | evet | `ios`, `android`, `windows`, `mac`, `linux`, `web`, `switch`, `playstation`, `xbox`, `quest`. Listede olmayan bir değer olduğu gibi yazılır. |
| `releaseDate` | hayır | `YYYY-AA-GG`. Yoksa sayfada "Coming soon" yazar. |
| `stores` | hayır | `store`: `app-store`, `google-play`, `steam`, `itch`, `epic`, `web`, `other`. `label` ile buton yazısı değiştirilebilir. |
| `trailer.youtube` | hayır | YouTube linki ya da 11 karakterlik video kimliği. Video ancak tıklanınca yüklenir. |
| `links` | hayır | Gizlilik politikası, basın kiti gibi ek linkler. |
| `cover`, `coverAlt` | evet | Kapak görseli ve açıklaması. Ana sayfada, oyun sayfasında ve sosyal medya önizlemesinde kullanılır. |
| `icon` | hayır | Uygulama ikonu. |
| `screenshots` | hayır | Her biri için `src` ve `alt`. |
| `featured`, `hidden` | hayır | Yukarıdaki "Katalog numarası" bölümüne bak. |
| `theme` | evet | Oyun sayfasının görünümü. Aşağıya bak. |

`alt` ve `coverAlt` görme engelli ziyaretçiler ve arama motorları için. Görselde ne olduğunu bir cümleyle yaz.

### Tema: oyun sayfasının havası

Oyun sayfasında üst menü, alt bilgi ve oyun alanının köşelerindeki kesim işaretleri stüdyoya ait, onlar hiç değişmez. İşaretlerin içindeki alan tamamen oyunundur ve `theme` ile boyanır.

| Alan | Açıklama |
| --- | --- |
| `scheme` | `light` veya `dark`. Tarayıcının kaydırma çubuğu gibi parçalarını ayarlar. |
| `colors.background` | Oyun alanının zemini. |
| `colors.surface` | Kartlar, çerçeveler. |
| `colors.text` / `colors.muted` | Ana metin / ikincil metin. Zemin üzerinde okunur olmalı. |
| `colors.accent` / `colors.accentText` | Mağaza butonları ve oynat düğmesi / üzerindeki yazı. |
| `colors.highlight` | İkincil vurgu rengi (isteğe bağlı). |
| `font` | Başlıklar ve butonlar için bir [Google Fonts](https://fonts.google.com) aile adı ve kalınlıkları. |
| `bodyFont` | Paragraflar için ayrı bir font (isteğe bağlı). Başlık fontu süslüyse (ör. Cinzel) okunaklı bir font seç. |
| `radius` | Köşe yuvarlaklığı, piksel (0-40). |
| `depth` | Butonların ve kartların altındaki "basılabilir" gölge, piksel (0-12). Düz bir görünüm için 0. |
| `tilt` | Kapak görselinin eğimi, derece (-6 ile 6 arası). |
| `ambient` | Arka planda hareket eden katmanlar. Boş bırakılabilir. |

`ambient` katman tipleri:

| `type` | Görünüm | Ek alanlar |
| --- | --- | --- |
| `snow` | Yağan kar | `colors` |
| `glyphs` | Yavaşça yükselen, dönen semboller ya da harfler | `glyphs` (ör. `["+", "×"]`), `colors` |
| `embers` | Yükselen, titreyen kıvılcımlar | `colors` |
| `dust` | Havada asılı toz zerreleri | `colors` |

Hepsinde `density` (yoğunluk, 0-3) ve `speed` (hız, 0-3) var, varsayılan 1. Hareket azaltmayı açmış ziyaretçilerde animasyon durur, ekrandan çıkınca da duraklar. Yeni bir katman tipi eklemek kod gerektirir: `src/components/Ambient.astro`.

Ana sayfadaki kapak, oyuna tıklanana kadar stüdyonun bakır tonunda basılı görünür. Fare üzerine gelince ya da mobilde kaydırınca oyunun kendi renkleri belirir. Kapağın yanındaki küçük renk şeridi oyunun paletini gösterir.

### Görsel boyutları

Astro görselleri derleme sırasında küçültür ve WebP'ye çevirir, bu yüzden büyük ve kaliteli dosya koymak sorun değil. PNG veya JPG kullan.

| Görsel | Önerilen boyut | Not |
| --- | --- | --- |
| `cover` | 1200 × 630 ya da 1024 × 500 (Play Store tanıtım görseli) | Sosyal medya önizlemesi de bundan üretilir. Önemli içeriği ortada tut. |
| `icon` | 512 × 512 | Kare, köşeleri site yuvarlar. |
| `screenshots` | 1920 × 1080 (yatay) | Hepsi aynı oranda olmalı. Galeri 16:9 kırpar. |

## Çok dilli yapı

Site şu an yalnızca İngilizce. Arayüz metinleri `src/i18n/en.json` içinde, kodun içinde metin yok. Türkçe eklemek için:

1. `src/i18n/en.json` dosyasını `tr.json` olarak kopyala ve çevir.
2. `src/i18n/index.ts` içinde `import tr from './tr.json';` ekle ve `dictionaries` satırını `{ en, tr }` yap.

Türkçe sayfalar `/tr/...` adresinde oluşur, menüye dil seçici kendiliğinden gelir. Oyun dosyalarında bir metni çevirmek için düz metin yerine dil başına bir değer ver:

```json
"tagline": { "en": "Solve the sum, hop the ice.", "tr": "İşlemi çöz, buzda zıpla." }
```

Türkçe karşılığı olmayan alanlarda İngilizcesi gösterilir.

## Stüdyo bilgileri ve sayfa metinleri

- E-posta ve sosyal medya linkleri: `src/lib/studio.ts`. Yeni bir kanal eklemek için listeye bir satır ekle, menü altı, iletişim sayfası ve footer kendiliğinden günceller.
- Ana sayfa, Hakkında, İletişim ve 404 sayfalarındaki tüm metinler: `src/i18n/en.json`. Örneğin Hakkında sayfasındaki ilkeler `about.principles`, İletişim'deki konular `contact.topics` altında. Listeye öğe ekleyip çıkarmak sayfayı da değiştirir.
- Hakkında sayfasındaki "Releases" listesi ve "Released on" platformları oyun dosyalarından otomatik gelir.

## Değişmeyen adresler

`public/` klasöründeki dosyalar aynı adla sitenin köküne kopyalanır, içeriklerine dokunulmaz. Mağaza kayıtlarında kullanılan şu adresler bu yüzden aynı kalır:

- `/privacy-play.html`
- `/privacy-appstore.html`
- `/app-ads.txt`
- `CNAME` (alan adı: copperhandstudio.com)
- `/penguinmath.png`

Bu dosyaları taşıma ya da yeniden adlandırma.

## Yayına alma (bir kerelik)

GitHub'da repo ayarlarında **Settings → Pages → Build and deployment → Source** seçeneğini **GitHub Actions** yap. Bundan sonra `main` dalına her push'ta `.github/workflows/deploy.yml` siteyi derleyip yayınlar. Custom domain ayarı aynı sayfada `copperhandstudio.com` olarak kalmalı.

## Klasör yapısı

```
games/                 Oyunlar (her klasör bir oyun)
public/                Olduğu gibi kopyalanan dosyalar (privacy, app-ads.txt, CNAME, favicon)
src/
  content.config.ts    game.json şeması: hangi alanlar var, hangileri zorunlu
  i18n/                Arayüz metinleri ve dil ayarları
  lib/games.ts         Sıralama, numaralama, tema → CSS dönüşümü
  lib/studio.ts        E-posta, sosyal medya
  components/          Parçalar (menü, fragman, galeri, ortam animasyonu...)
  layouts/Base.astro   Her sayfanın iskeleti, SEO ve Open Graph etiketleri
  pages/               Sayfalar
  styles/              Stüdyo stili (global.css) ve oyun alanı stili (game-plate.css)
```
