# TODO

## MVP

- [x] TypeScript + Tailwind + Viteで初期構築
- [x] トップ画面作成
- [x] GH / PM選択支援画面作成
- [x] CartridgeAdvisor作成
- [x] SpecimenTubeCard作成
- [x] 青スピッツカード作成
- [x] 緑スピッツカード作成
- [x] GH入力フォーム作成
- [x] PM入力フォーム作成
- [x] GH解釈ロジック作成
- [x] PM/TTP解釈ロジック作成
- [x] ECMO GH解釈ロジック作成
- [x] 結果カード表示作成
- [x] 結果カード見出し統一
- [x] 色分けルール実装
- [x] 安全注意文を全結果画面に表示
- [x] Created by Kosei Omasaをフッターに表示

---

## GHルール

- [x] CK-R判定
- [x] CKH-R判定
- [x] CK-R > CKH-Rによるヘパリン影響判定
- [x] CRT-MA判定
- [x] CFF-MA判定
- [x] LY30判定
- [x] 未入力項目の未評価表示

---

## PM / TTPルール

- [x] ActF-MA <5mm判定
- [x] HKH-MA <45mm判定
- [x] ADP inhibition >60%判定
- [x] HKH-R >10分の黄色表示
- [x] ADP-MA <=40mmの黄色表示
- [x] ADP-MA <=20mmの黄色表示
- [x] MTP de-escalation候補の黄色表示
- [x] 頭部外傷PM表示
- [x] 抗血小板薬PM表示

---

## ECMO GHルール

- [x] CK-R 16〜24分を緑表示
- [x] CK-R >24分を赤表示
- [x] CK-R <16分を赤表示
- [x] CKH-R 10〜16分を黄色表示
- [x] CKH-R >16分を赤表示
- [x] CK-R / CKH-R >2を赤表示
- [x] MA高値を黄色表示
- [x] ECMO注意文を表示

---

## 入力バリデーション

- [x] 数値以外を入力不可にする
- [x] 負の値を入力不可にする
- [x] ADP inhibition / AA inhibitionを0〜100%に制限する
- [x] 小数入力を許可する
- [x] 明らかに異常な値に警告を出す
- [x] 未入力項目を未評価として扱う

---

## 安全性

- [x] 患者情報入力欄が存在しないことを確認
- [x] OCR機能が存在しないことを確認
- [x] 画像アップロード機能が存在しないことを確認
- [x] カメラ撮影機能が存在しないことを確認
- [x] 「投与する」ではなく「検討する」表現になっているか確認
- [x] 「最終判断は担当医」を全結果画面に表示
- [x] 「TEGのために介入を遅らせない」注意文を表示

---

## 表示確認

- [ ] iPhone Safariで表示確認
- [ ] Android Chromeで表示確認
- [ ] スマホ縦画面でボタンが押しやすいか確認
- [ ] 夜間使用を想定して視認性を確認
- [ ] スピッツカードが目立つか確認
- [ ] 結果カードの色が直感的か確認

---

## 公開

- [ ] GitHubリポジトリ作成
- [ ] README.md設置
- [ ] AGENTS.md設置
- [ ] TODO.md設置
- [ ] GitHub Pages設定
- [ ] 公開URL確認
- [ ] URL共有前に安全文言を確認
