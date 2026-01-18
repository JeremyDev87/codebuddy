<p align="center">
  <a href="../plugin-quick-reference.md">English</a> |
  <a href="../ko/plugin-quick-reference.md">한국어</a> |
  <a href="../zh-CN/plugin-quick-reference.md">中文</a> |
  <a href="plugin-quick-reference.md">日本語</a> |
  <a href="../es/plugin-quick-reference.md">Español</a> |
  <a href="../pt-BR/plugin-quick-reference.md">Português</a>
</p>

# CodingBuddy クイックリファレンスカード

コマンド、モード、一般的なワークフローのクイックリファレンスです。

## ワークフローモード

| モード | トリガー | 目的 |
|------|---------|---------|
| **PLAN** | `PLAN <タスク>` | TDD による実装アプローチの設計 |
| **ACT** | `ACT` | プランの実行、変更の適用 |
| **EVAL** | `EVAL` | 品質の評価、改善提案 |
| **AUTO** | `AUTO <タスク>` | 品質達成まで自律的にサイクル |

### モードフロー

```
┌─────────────────────────────────────────────────────────────┐
│                      デフォルトフロー                          │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──(ユーザー: ACT)──> ACT ──(自動)──> PLAN              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      評価フロー                               │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──> ACT ──> PLAN ──(ユーザー: EVAL)──> EVAL ──> PLAN   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      自律フロー                               │
├─────────────────────────────────────────────────────────────┤
│  AUTO ──> [PLAN ──> ACT ──> EVAL] ──(繰り返し)──> 完了       │
│           └── Critical=0 かつ High=0 まで ──┘                │
└─────────────────────────────────────────────────────────────┘
```

## コマンド

| コマンド | 説明 |
|---------|-------------|
| `/plan` | PLAN モードに入る |
| `/act` | ACT モードに入る |
| `/eval` | EVAL モードに入る |
| `/auto` | AUTO モードに入る |
| `/checklist` | コンテキストに応じたチェックリストを生成 |

### ローカライズキーワード

| English | Korean | Japanese | Chinese | Spanish |
|---------|--------|----------|---------|---------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMÁTICO |

## スペシャリストエージェント

### 計画スペシャリスト
| エージェント | フォーカス |
|-------|-------|
| 🏛️ architecture-specialist | システム設計、レイヤー配置 |
| 🧪 test-strategy-specialist | TDD アプローチ、カバレッジ目標 |
| 📨 event-architecture-specialist | メッセージキュー、サーガ、リアルタイム |
| 🔗 integration-specialist | API 統合、外部サービス |
| 📊 observability-specialist | ロギング、モニタリング、トレーシング |
| 🔄 migration-specialist | データマイグレーション、バージョニング |

### 実装スペシャリスト
| エージェント | フォーカス |
|-------|-------|
| 📏 code-quality-specialist | SOLID、DRY、複雑度 |
| ⚡ performance-specialist | バンドルサイズ、最適化 |
| 🔒 security-specialist | 認証、入力検証、XSS |
| ♿ accessibility-specialist | WCAG 2.1、ARIA、キーボード |
| 🔍 seo-specialist | メタデータ、構造化データ |
| 🎨 ui-ux-designer | ビジュアル階層、UX パターン |

### 開発者エージェント
| エージェント | フォーカス |
|-------|-------|
| 🖥️ frontend-developer | UI コンポーネント、状態管理 |
| ⚙️ backend-developer | API、データベース、認証 |
| 🔧 devops-engineer | CI/CD、インフラストラクチャ |
| 📱 mobile-developer | モバイルアプリ開発 |

## 一般的なワークフロー

### 1. 新機能の実装

```
あなた: PLAN implement user authentication with JWT

Claude: [TDD アプローチによる構造化プランを作成]

あなた: ACT

Claude: [Red-Green-Refactor に従って実装]

あなた: EVAL  (オプション)

Claude: [コード品質、セキュリティをレビューし、改善を提案]
```

### 2. バグ修正

```
あなた: PLAN fix the login timeout issue in auth module

Claude: [問題を分析し、デバッグプランを作成]

あなた: ACT

Claude: [テストを含む修正を実装]
```

### 3. 自律開発

```
あなた: AUTO implement a complete REST API for user management

Claude: [Critical=0、High=0 になるまで PLAN→ACT→EVAL をサイクル]
```

### 4. チェックリスト生成

```
あなた: /checklist security performance

Claude: [セキュリティとパフォーマンスのチェックリストを生成]
```

## 品質基準

### カバレッジ目標
- **コアロジック**: 90%+ のテストカバレッジ
- **UI コンポーネント**: 主要なインタラクションをテスト

### TDD サイクル
```
RED ──> GREEN ──> REFACTOR
 │         │          │
 │         │          └── 構造を改善
 │         └── テストをパスする最小限のコード
 └── 失敗するテストを書く
```

### コード品質
- `any` 型を使わない（TypeScript strict）
- 純粋関数と非純粋関数の分離
- SOLID 原則
- DRY（Don't Repeat Yourself）

## コンテキスト管理

### セッション永続化
コンテキストは `docs/codingbuddy/context.md` に保存されます：
- 会話のコンパクション後も保持
- モード間の決定事項を追跡
- 推奨エージェントを保持

### コンテキストコマンド
| アクション | 方法 |
|--------|-----|
| コンテキストを表示 | `docs/codingbuddy/context.md` を読む |
| コンテキストをリセット | 新しい PLAN モードを開始 |
| コンテキストを更新 | モード完了時に自動更新 |

## MCP ツール

| ツール | 目的 |
|------|---------|
| `parse_mode` | プロンプトからワークフローモードを解析 |
| `get_agent_details` | スペシャリストエージェント情報を取得 |
| `generate_checklist` | ドメイン固有のチェックリストを生成 |
| `read_context` | 現在のコンテキストドキュメントを読む |
| `update_context` | 進捗でコンテキストを更新 |
| `get_project_config` | プロジェクト設定を取得 |

## クイックヒント

1. **PLAN から始める** - 実装前に必ずプランを立てる
2. **複雑な機能には AUTO を使う** - 品質達成までサイクルを回す
3. **ACT 後に EVAL をリクエスト** - マージ前に品質評価を受ける
4. **コンテキストを確認** - 以前の決定を確認するために `context.md` を読む
5. **スペシャリストを使う** - ドメイン固有の問題を検出できる

## 関連ドキュメント

- [インストールガイド](./plugin-guide.md) - セットアップと設定
- [アーキテクチャ](./plugin-architecture.md) - 仕組み
- [使用例](./plugin-examples.md) - 実際のワークフロー
- [トラブルシューティング](./plugin-troubleshooting.md) - よくある問題
- [FAQ](./plugin-faq.md) - よくある質問

---

<sub>🤖 このドキュメントはAIの支援を受けて翻訳されました。誤りや改善点があれば、[GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues)にてお知らせください。</sub>
