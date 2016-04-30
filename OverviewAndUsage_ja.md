#fakeworker.jsの概要と使い方

# fakeworker.jsって？ #
fakeworker.jsは、HTML5 Web Workersのデバッグを支援するためのライブラリです。
2009年8月現在、Web Workersを実装したブラウザの中で、Web Workersをソースレベルでデバッグできる機能を備えたものはありません。
しかも、Web WorkersはDOMにアクセスできないため、ログ出力を行うといっても一筋縄では行きません。
これらの理由により、Web Workersを用いたプログラムの開発はかなり難しいです。

fakeworker.jsは、こうした状況を少しでも改善するために作成された、Web Workersの簡単な実装系です。
fakeworker.jsは単純なeval()を用いてワーカを生成し、setTimeout()を用いて非同期メッセージングを行うため、現在のブラウザが備えるデバッガ（Webkitの開発者用コンソールやFirebugなど）を用いてワーカのソースコードをデバッグする事が出来ます。

# fakeworker.jsの使い方 #

使い方は非常に簡単で、scriptタグでfakeworker.jsを読み込むだけです。

```
<script type="text/javascript" src="path/to/fakeworker.js"></script>
```

こうするだけで、Web Workersの実装がfakeworker.jsのものに置き換えられます。

# fakeworker.jsを使ってデバッグする #

fakeworker.jsを使って、ワーカをデバッグする手順を簡単に見ていきましょう。


### 1. デバッガを使用し、ワーカ作成直後にプログラムを一時停止する ###
デバッグしたいワーカの生成直後（`new Worker("url")`の呼び出し直後）にブレークポイントを仕掛け、プログラムを一時停止します。

<img src='http://fakeworker-js.googlecode.com/hg/doc/pause_program.png'>


<h3>2. ワーカのソースコードを見つけてブレークポイントを仕掛ける</h3>
ワーカのソースコードは、fakeworker.jsがeval()を用いて実行します。Firebugや、Webkit付属のデバッガはeval()で実行されたコードをデバッグする機能を持っていますので、探し出してブレークポイントを設定します。<br>
<br>
<img src='http://fakeworker-js.googlecode.com/hg/doc/select_evaled_code.png'><br><br>
<img src='http://fakeworker-js.googlecode.com/hg/doc/add_breakpoint.png'>


<h3>3. プログラムを再開する</h3>
プログラムを再開し、とことんデバッグに励んでください:-)<br>
<br>
<h1>fakeworker.jsの制限</h1>
<ul><li>SharedWorkerを実装していない<br>
<blockquote>SharedWorkerは、現在サポートするブラウザが全く存在しないため、実装されていません。<br>
</blockquote></li><li>ワーカのソース中でimportScriptsを使用できない<br>
<blockquote>残念ながら、ワーカのソース中でimportScriptsメソッドを使用する事が出来ません。eval()を用いてワーカを実現する事による制限です。importScripts相当の事をしたいなら、サーバ上でスクリプトファイルを連結する事をお勧めします（その方がHTTPリクエストを減らせるので効率的でもあります）。