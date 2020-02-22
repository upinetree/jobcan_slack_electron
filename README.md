# Jobcan Slack Electorn

ジョブカン打刻を実行するアプリケーション。

## 機能

- Slack のジョブカン連携を使って、 Slack 経由で `jobcan_touch` を実行
  - ジョブカンが他に API を提供していないため
- 出退勤に合わせて好きな画像をランダムで表示

## 設定

`~/jobcan/config.yml` に以下を記述。

```yaml
token: レガシートークン
channel: チャンネル ID (not チャンネル名）
dryrun: true なら実際の打刻を行わない（動作確認、画像確認用）
```

- レガシートークンは[こちらから](https://api.slack.com/custom-integrations/legacy-tokens)
- チャンネル ID は Slack のサイドバーから該当チャンネルを右クリックでリンクコピーして取得

## 出退勤画像

- `~/jobcan/images/start/` 内に画像を入れると、出勤時にランダムで表示
- `~/jobcan/images/finish/` 内に画像を入れると、退勤時にランダムで表示
- `/.+\.(png|jpg|jpeg|gif)/` に一致するファイルのみ

## 開発

このリポジトリを clone して以下を実行（あらかじめ dryrun を設定しておく）

```
$ yarn install
$ yarn start
```

実行ファイルのビルドは
