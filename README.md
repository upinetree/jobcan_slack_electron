# Jobcan Slack Electorn

ジョブカン打刻を実行するアプリケーション。
今のところは macOS のみ対応。

## 機能

- Slack のジョブカン連携コマンドの `jobcan_touch` を実行して打刻（Slack 経由なのはジョブカンが他に API を提供していないため）
- 出退勤に合わせて好きな画像をランダムで表示

## 使い方

### ダウンロード

[Releases](https://github.com/upinetree/jobcan_slack_electron/releases) から最新版の `.dmg` ファイルをダウンロード。
展開して任意のディレクトリに配置してください。

### 設定

`~/jobcan/config.yml` に以下を記述。

```yaml
token: レガシートークン
channel: チャンネル ID (not チャンネル名）
dryrun: true なら実際の打刻を行わない（動作確認、画像確認用）
```

- レガシートークンは[こちらから](https://api.slack.com/custom-integrations/legacy-tokens)
- チャンネル ID は Slack のサイドバーから該当チャンネルを右クリックでリンクコピーして取得

### 出退勤画像の配置

- `~/jobcan/images/start/` 内に画像を入れると、出勤時にランダムで表示
- `~/jobcan/images/finish/` 内に画像を入れると、退勤時にランダムで表示
- `/.+\.(png|jpg|jpeg|gif)/` に一致するファイルのみ

### 実行

アプリケーションを開くと即座に打刻が実行されます。
ジョブカンと Slack との連携が正常で、Slack のレガシートークンが正しく設定されていれば、設定した Slack チャンネルに打刻メッセージが流れるはずです。

ショートカットキーに登録したり、オートメーションに組み込んだりすると便利です。

## 開発

このリポジトリを clone して以下を実行（あらかじめ `dryrun` を設定しておく）。

```
$ yarn install
$ yarn start
```

実行ファイルのビルドは

```
$ yarn dist
```

で `dist/` に `.dmg` ファイルが作成される。

タグを打って push すると GitHub Actions で自動的にリリースが作成される。
タグの値は package.json の version の値と一致させる。

```
$ git tag -a v1.0.0 -m "Frist release 🎉"
$ git push origin v1.0.0
```

Draft 状態になっているので、よさそうなら publish する。
