# Tabmane - Chrome Extension Project Guidelines

## プロジェクト概要

Tabmane は Chrome ブラウザのタブ管理を効率化するための拡張機能です。
Plasmo Framework を使用して開発されており、以下の主要機能を提供します：

- **タブ URL の一括コピー**: 現在のウィンドウの全タブ URL をクリップボードにコピー
- **URL の一括オープン**: クリップボードから複数の URL を読み取って新しいタブで開く
- **重複タブの削除**: 同じ URL を持つタブを自動的に検出して削除
- **タブ数のバッジ表示**: 開いているタブの総数を拡張機能アイコンにバッジで表示

## 技術スタック

- **Framework**: Plasmo 0.90.5
- **UI**: React 18.2.0
- **言語**: TypeScript 5.3.3
- **パッケージマネージャー**: Bun/npm/yarn

## TypeScript Guidelines

### 基本原則

- 型定義は interface ではなく、type を使用する
- for よりも map や filter などの関数型メソッドを優先して使用する
- 変数の宣言には const のみを使用する
- 外部で使われていない場合は export しない
- 使用していない import や変数や関数などは削除
- class は使用せず、関数を使用する

### Chrome Extension 固有の型

- Chrome API の型は `@types/chrome` パッケージから利用
- 非同期処理は Promise ベースで統一（Chrome API の callback は Promise でラップ）

### インポート・エクスポート

- ES Modules 使用時は .js 拡張子を明示してインポート
- 相対パス指定時は一貫したベースパスを使用
- デフォルトエクスポートよりも名前付きエクスポートを優先

### 型安全性

- any 型の使用を避け、適切な型定義を行う
- Chrome API のレスポンスは必ず型ガードでチェック
- オプショナル型は `?:` を使用
- Union types で状態を明確に表現

## React Guidelines

### コンポーネント設計

- props の型は `Props` という名前にする
- popup.tsx は単一のコンポーネントファイルとして維持
- component は小さく分割する
- ロジックと UI は分離する

### 状態管理

- ローカル状態は useState
- Chrome Storage API を使用する場合は適切な型定義を追加
- setState の関数型更新を活用

### スタイリング

- インラインスタイルで統一（現在の実装を維持）
- スタイルオブジェクトは必要に応じて外部化

## Chrome Extension 特有のガイドライン

### Manifest Permissions

- 必要最小限の権限のみを要求
- 現在の権限:
  - `tabs`: タブ情報へのアクセス
  - `clipboardRead`: クリップボードからの読み取り
  - `clipboardWrite`: クリップボードへの書き込み

### Background Script

- Service Worker として動作（Manifest V3）
- イベントリスナーはトップレベルで登録
- 非同期処理は適切にハンドリング

### Popup

- ユーザー操作に対して即座にフィードバック
- エラーハンドリングを実装
- 非同期処理中は適切な UI 状態を表示

## General Coding Practices

### 原則

#### 関数型アプローチ

- 純粋関数を優先
- 不変データ構造を使用
- 副作用を分離
- 型安全性を確保

#### 使用していないものは消す

- 使用していない変数や関数は消す
- 使用していない import は消す
- 使用していないライブラリは消す
- 不要になったファイルは消す

### 実装手順

1. **型設計**

   - Chrome API の型を適切に定義
   - ドメインの言語を型で表現

2. **純粋関数から実装**

   - URL 処理などのロジックを純粋関数として実装
   - テストを先に書く

3. **Chrome API との統合**
   - 非同期処理を Promise でラップ
   - エラーハンドリングを実装

### ディレクトリ構成

現在の構成を維持（Plasmo のデフォルト構成）:

```
src/
  popup.tsx       # ポップアップ UI
  background.ts   # バックグラウンドスクリプト
  assets/         # アイコンなどのアセット
```

### コードスタイル

- 基本的に関数で実装し、class は一切使用しない
- 関数を小さく分割し、一つの関数の内部は抽象度が揃った可読性の高いコードにする
- 早期リターンで条件分岐をフラット化
- Chrome API のエラーは必ずチェック

### テスト戦略

- Chrome API のモックを作成してテスト
- 純粋関数の単体テストを優先
- E2E テストは実際の拡張機能として手動で確認

## Development Workflow

### 開発サーバー

```bash
bun dev    # または npm run dev
```

### ビルド

```bash
bun build  # または npm run build
```

### 動作確認

1. `chrome://extensions/` を開く
2. デベロッパーモードを有効化
3. `build/chrome-mv3-dev` フォルダを読み込む

## Git Practices

### コミットの作成

- できるだけ小さい粒度で commit を作成する
- 機能単位でコミット
- Chrome Extension 特有の変更は明確に記載

### コミットメッセージの例

```bash
# 新機能の追加
feat: URL一括ペースト機能を追加

# 既存機能の改善
update: 重複タブ削除のパフォーマンスを改善

# バグ修正
fix: バッジ更新のタイミングを修正

# リファクタリング
refactor: Chrome API呼び出しをPromiseベースに統一

# Manifest更新
chore: manifest権限を最小化
```

## MVP を重視する実装方針

- Chrome Extension の基本機能から実装
- ユーザーフィードバックを元に段階的に拡張
- パフォーマンスとユーザビリティを重視

## 注意事項

- Chrome API の非同期処理は必ず適切にハンドリング
- ユーザーの権限リクエストは最小限に
- セキュリティを考慮（XSS対策など）
- Chrome Web Store のポリシーに準拠
