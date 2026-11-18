AEOLIA 文単位翻訳・既存環境利用版（独立した実験ソフト）

必要な配布ファイルは Aeolia-Sentence-Reuse.py と Start-Reuse.cmd の2つです。
新しい専用フォルダーに2つを保存します。既存Translatorへ上書きしないでください。
Start-Reuse.cmdを起動し、既存Translatorのルートフォルダーを入力します。
例: C:\Tools\AEOLIA-Translator （この直下にruntimeとmodelsが必要）
または既存TranslatorのフォルダーをStart-Reuse.cmdへドラッグします。
黒い画面を残してブラウザーで使用します。終了は黒い画面のCtrl+Cです。

【必要条件】
Windows x64、既存軽量版が実際にオフライン翻訳できる状態であること。
品質版Qwen/llama.cppだけが動く環境や、初回準備前のZIPだけでは足りません。
次のファイル・パッケージが既存Translatorの中に必要です。

runtime\python.exe
runtime\Lib\site-packages\ctranslate2 （Pythonに対応するpyd/DLLを含む）
runtime\Lib\site-packages\sentencepiece （その依存ライブラリを含む）
models\en-ja\model.bin
models\en-ja\config.json
models\en-ja\shared_vocabulary.json
models\en-ja\tokenizer\source.spm
models\en-ja\tokenizer\target.spm
models\en-ja\tokenizer\vocab.json
models\en-ja\tokenizer\tokenizer_config.json
上記modelsの同じ7ファイルがmodels\ja-enにも必要です。
英日FuguMTと日英OPUSの既存CTranslate2変換済みモデルを想定しています。
GGUFモデルや別のトークナイザー構成には対応しません。

不足パスを起動前に表示して停止します。依存DLL・モデルが壊れている場合も理由を表示して停止します。
ダウンロード、pip、setup_runtime.py、既存アプリ起動、設定更新は実行しません。
既存モデル・ランタイム・AHK・設定を変更しません。-I -Bで実行します。
自己テストでは非機密の短文を両方向で翻訳してからUIを開きます。

【操作と限界】
原文と訳文を1対1で表示します。原文を自動置換・クリップボード取得・自動保存しません。
翻訳は既存モデルによるCPU 1スレッドです。外部翻訳APIは使いません。
ブラウザーと同じPCの127.0.0.1で通信します。翻訳中は完了まで待ってください。
12,000文字まで。1文480token超は切り捨てず未処理表示します。
通常の文ごとのエラー後も次の文を処理します。アプリやOS全体の障害から復旧する機能ではありません。
【未満→以下】、否定・義務・条件の誤訳、識別子改変、省略は残ります。警告なしでも原文と照合してください。
会社Core Ultra 5 235Uの動作・速度は未検証です。
完全版の2.123秒/8.844秒は別ランタイムでの自宅測定であり、この利用版の性能ではありません。

既存0.2.0初回セットを別フォルダーへ展開する案はありますが、初回セットだけで
CTranslate2の準備が済むとは限りません。このパッチは不足分を取得しません。
初回セット: https://github.com/takami0606/takami0606.github.io/releases/download/aeolia-translator-v0.2.0-trial/AEOLIA-Translator-0.2.0-win-x64-first-run.zip

【この小型版の検証】
今回作成したPython3.13.17 / CTranslate2 4.6.0 CPU専用環境を既存ルートとして、
起動前チェックと両方向翻訳の成功を確認しました。
参考旧0.3.3フォルダーではCTranslate2未配置を検出して不足パスを表示し停止しました。
会社の既存Python3.14 / CTranslate2 4.8.5等との組み合わせは未検証です。

ソースのライセンスはMIT（Copyright 2026 AEOLIA experiment contributors）。
使用・複製・変更・配布等を無償で許可します。この著作権表示と許可表示を保持してください。
ソフトウェアは現状のまま提供され、明示黙示の保証をせず、作者は損害の責任を負いません。
この配布にはモデル・Python・第三者バイナリを含めません。再利用する既存構成の各ライセンスは引き続き適用されます。
