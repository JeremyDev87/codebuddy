<p align="center">
  <a href="../plugin-examples.md">English</a> |
  <a href="../ko/plugin-examples.md">한국어</a> |
  <a href="../zh-CN/plugin-examples.md">中文</a> |
  <a href="plugin-examples.md">日本語</a> |
  <a href="../es/plugin-examples.md">Español</a> |
  <a href="../pt-BR/plugin-examples.md">Português</a>
</p>

# CodingBuddy 使用例

PLAN/ACT/EVAL ワークフローを効果的に使用する実際の例です。

## 例 1: REST API エンドポイントの実装

### シナリオ
バリデーション機能を持つユーザー登録用の新しいエンドポイントを追加します。

### PLAN フェーズ

```
あなた: PLAN implement a POST /api/users endpoint for user registration with email validation
```

**Claude のレスポンス:**
```markdown
# Mode: PLAN
## Agent: backend-developer [Primary Agent]

## 📋 プラン概要
メールバリデーション、パスワードハッシュ化、適切なエラーハンドリングを含む
ユーザー登録エンドポイントを実装します。

## ✅ Todo リスト
- [ ] User の型とバリデーションスキーマを定義
- [ ] 登録エンドポイントの失敗テストを作成
- [ ] 登録ハンドラを実装
- [ ] メールバリデーションユーティリティを追加
- [ ] パスワードハッシュ化を追加
- [ ] 統合テストを作成

## 🎯 実装ステップ

### コアロジック（TDD アプローチ）
1. テスト作成: 有効なデータで POST /api/users が 201 を返す
2. テスト作成: 無効なメールで 400 を返す
3. テスト作成: 弱いパスワードで 400 を返す
4. バリデーションユーティリティを実装
5. 登録ハンドラを実装

### 🔒 セキュリティ計画
- bcrypt によるパスワードハッシュ化（コストファクター 12）
- XSS 防止のための入力サニタイズ
- レート制限の推奨

## 📁 ファイル構造
- src/entities/user/types.ts
- src/entities/user/user.validation.ts
- src/entities/user/user.api.ts
- src/entities/user/__tests__/user.api.test.ts

**次へ:** `ACT` と入力して実行
```

### ACT フェーズ

```
あなた: ACT
```

**Claude のレスポンス:**
```markdown
# Mode: ACT
## Agent: backend-developer [Primary Agent]

## 🚀 実装の進捗

### ステップ 1: 型の定義
✅ ユーザー型を作成
- `src/entities/user/types.ts`: UserInput, User, ValidationError

### ステップ 2: 失敗テストの作成 (Red)
✅ テストファイルを作成
- `src/entities/user/__tests__/user.api.test.ts`
- テスト: "returns 201 on valid registration" - 失敗 ❌

### ステップ 3: バリデーションの実装 (Green)
✅ バリデーションユーティリティを作成
- `src/entities/user/user.validation.ts`: validateEmail, validatePassword

### ステップ 4: ハンドラの実装 (Green)
✅ 登録エンドポイントを作成
- `src/entities/user/user.api.ts`: registerUser ハンドラ
- テストがパス ✅

### ステップ 5: リファクタリング
✅ エラーレスポンスヘルパーを抽出
✅ JSDoc コメントを追加

## ✅ 品質チェック
- ✅ 型安全性: すべての型が明示的
- ✅ テスト: 4/4 パス（カバレッジ: 94%）
- ✅ セキュリティ: bcrypt でパスワードハッシュ化

**次へ:** 品質評価には `EVAL` と入力、または `PLAN` で続行
```

### EVAL フェーズ（オプション）

```
あなた: EVAL
```

**Claude のレスポンス:**
```markdown
# Mode: EVAL
## Agent: code-reviewer [Primary Agent]

## 📊 コード品質評価

### セキュリティ分析 🔒
| チェック | ステータス | 備考 |
|-------|--------|-------|
| パスワードハッシュ化 | ✅ パス | bcrypt コスト 12 |
| 入力バリデーション | ✅ パス | メール正規表現、パスワードルール |
| SQL インジェクション | ✅ パス | パラメータ化クエリ使用 |
| レート制限 | ⚠️ 中 | 未実装 |

### コード品質 📏
| 指標 | 値 | 目標 |
|--------|-------|--------|
| テストカバレッジ | 94% | 90%+ ✅ |
| 複雑度 | 低 | 許容範囲 ✅ |
| 型安全性 | 100% | 100% ✅ |

### 推奨事項
1. **中**: ブルートフォース防止のためレート制限を追加
2. **低**: メール確認フローの追加を検討

## 🔄 改善プラン
発見事項に対応する場合:
- レート制限ミドルウェアを追加
- メール確認トークンを実装
```

---

## 例 2: 失敗するテストのデバッグ

### シナリオ
テストがランダムに失敗するため、デバッグが必要です。

### PLAN フェーズ

```
あなた: PLAN debug the flaky test in UserProfile.test.tsx that fails randomly
```

**Claude のレスポンス:**
```markdown
# Mode: PLAN
## Agent: test-strategy-specialist [Primary Agent]

## 📋 プラン概要
UserProfile コンポーネントの不安定なテストを調査し修正します。

## 🔍 デバッグ戦略
1. テストファイルと失敗するアサーションを特定
2. 非同期タイミングの問題をチェック
3. テスト間の共有状態を確認
4. モックのクリーンアップを検証
5. 適切な waitFor アサーションを追加

## 🎯 調査ステップ
1. テストファイルを読み、失敗パターンを特定
2. 不足している await または act() ラッパーをチェック
3. beforeEach/afterEach のクリーンアップを検証
4. 非同期操作に明示的な waitFor を追加

**次へ:** デバッグを開始するには `ACT` と入力
```

### ACT フェーズ

```
あなた: ACT
```

**Claude のレスポンス:**
```markdown
# Mode: ACT
## Agent: test-strategy-specialist [Primary Agent]

## 🚀 デバッグの進捗

### ステップ 1: テストの分析
✅ `UserProfile.test.tsx:45` で問題を発見
- 非同期レンダーに `await` が欠落
- アサーション後に状態更新が発生

### ステップ 2: 修正の適用
✅ テストを修正
```tsx
// 修正前（不安定）
it('shows user name', () => {
  render(<UserProfile userId="1" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// 修正後（安定）
it('shows user name', async () => {
  render(<UserProfile userId="1" />);
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### ステップ 3: 修正の検証
✅ テストを 50 回実行 - 0 回の失敗

## ✅ 根本原因
非同期データ取得がアサーション後に完了していました。適切な `waitFor` で修正しました。
```

---

## 例 3: 自律的な機能開発

### シナリオ
自律的な品質管理で完全な機能を実装します。

### AUTO モード

```
あなた: AUTO implement a dark mode toggle with localStorage persistence
```

**Claude のレスポンス:**
```markdown
# Mode: AUTO (Iteration 1/5)
## Agent: frontend-developer [Primary Agent]

## 📋 PLAN フェーズ
- ThemeContext プロバイダーを作成
- トグルコンポーネントを実装
- localStorage 永続化を追加
- ダークモードバリアントをスタイリング

## 🚀 ACT フェーズ
✅ ダーク/ライトモード付き ThemeContext を作成
✅ DarkModeToggle コンポーネントを実装
✅ マウント/変更時の localStorage 同期を追加
✅ ダークモード変数でグローバル CSS を更新

## 📊 EVAL フェーズ
| 問題 | 重要度 | ステータス |
|-------|----------|--------|
| キーボードアクセシビリティがない | 高 | 発見 |
| システム設定の検出がない | 中 | 発見 |
| テストカバレッジが 78% | 中 | 発見 |

---

# Mode: AUTO (Iteration 2/5)

## 📋 PLAN フェーズ
イテレーション 1 の High と Medium の問題に対処

## 🚀 ACT フェーズ
✅ キーボードサポートを追加（Enter/Space でトグル）
✅ prefers-color-scheme の検出を追加
✅ 不足テストを追加（カバレッジ 92%）

## 📊 EVAL フェーズ
| 問題 | 重要度 | ステータス |
|-------|----------|--------|
| 以前の問題すべて | - | ✅ 解決済み |

---

# Mode: AUTO - 完了 ✅

## サマリー
- **イテレーション**: 2
- **Critical の問題**: 0
- **High の問題**: 0
- **カバレッジ**: 92%

## 作成/変更されたファイル
- src/shared/providers/ThemeContext.tsx
- src/shared/components/DarkModeToggle.tsx
- src/app/globals.css（ダークモード変数）
- tests/ThemeContext.test.tsx
```

---

## 例 4: セキュリティ監査

### シナリオ
既存の認証コードのセキュリティ問題を監査します。

### PLAN フェーズ

```
あなた: PLAN security audit the authentication module in src/auth/
```

**Claude のレスポンス:**
```markdown
# Mode: PLAN
## Agent: security-specialist [Primary Agent]

## 📋 監査範囲
以下に焦点を当てた認証モジュールのセキュリティレビュー:
- トークンハンドリング（JWT）
- パスワード保存
- セッション管理
- 入力バリデーション
- OWASP Top 10 準拠

## 🔍 監査チェックリスト
- [ ] JWT シークレットの強度とローテーション
- [ ] トークンの有効期限とリフレッシュロジック
- [ ] パスワードハッシュアルゴリズムとパラメータ
- [ ] ブルートフォース保護
- [ ] 認証レスポンスでの XSS 防止
- [ ] 認証エンドポイントでの CSRF 保護
- [ ] セキュアな Cookie 設定
- [ ] レート制限

**次へ:** 監査を実行するには `ACT` と入力
```

### ACT フェーズ

```
あなた: ACT
```

**Claude のレスポンス:**
```markdown
# Mode: ACT
## Agent: security-specialist [Primary Agent]

## 🔍 セキュリティ監査結果

### Critical の問題 🔴
| 問題 | 場所 | リスク |
|-------|----------|------|
| コード内に JWT シークレット | auth.config.ts:5 | シークレット漏洩 |
| トークン有効期限なし | jwt.utils.ts:12 | セッションハイジャック |

### High の問題 🟠
| 問題 | 場所 | リスク |
|-------|----------|------|
| 弱いパスワードポリシー | validation.ts:8 | ブルートフォース |
| レート制限なし | login.handler.ts | アカウント列挙 |

### Medium の問題 🟡
| 問題 | 場所 | リスク |
|-------|----------|------|
| Cookie に Secure フラグなし | session.ts:22 | MITM |
| 詳細すぎるエラーメッセージ | error.handler.ts | 情報漏洩 |

## 📋 修正プラン
1. JWT シークレットを環境変数に移動
2. トークン有効期限を追加（アクセス 15 分、リフレッシュ 7 日）
3. レート制限を実装（5 回/分）
4. Cookie に Secure、HttpOnly、SameSite フラグを追加

**次へ:** 修正を実装するには `ACT` と入力、または詳細な修正プランには `PLAN`
```

---

## 例 5: ドメインチェックリストの生成

### /checklist コマンドの使用

```
あなた: /checklist security accessibility
```

**Claude のレスポンス:**
```markdown
## 🔒 セキュリティチェックリスト

### 認証
- [ ] bcrypt/argon2 でパスワードをハッシュ化
- [ ] JWT トークンに有効期限あり
- [ ] リフレッシュトークンのローテーションを実装
- [ ] ログアウト時のセッション無効化

### 入力バリデーション
- [ ] すべてのユーザー入力をサニタイズ
- [ ] SQL インジェクション防止（パラメータ化クエリ）
- [ ] XSS 防止（出力エンコーディング）
- [ ] ファイルアップロード制限

### 認可
- [ ] ロールベースのアクセス制御
- [ ] リソース所有権の検証
- [ ] API レート制限

---

## ♿ アクセシビリティチェックリスト

### キーボードナビゲーション
- [ ] すべてのインタラクティブ要素がフォーカス可能
- [ ] 視認可能なフォーカスインジケーター
- [ ] ナビゲーション用スキップリンク
- [ ] キーボードトラップなし

### スクリーンリーダー
- [ ] セマンティック HTML 構造
- [ ] カスタムコントロールに ARIA ラベル
- [ ] 画像に alt テキスト
- [ ] フォームラベルが入力に関連付け

### ビジュアル
- [ ] 色コントラスト最低 4.5:1
- [ ] テキストを 200% まで拡大可能
- [ ] 色だけに依存しないコンテンツ
```

---

## 効果的な使用のためのヒント

### 1. PLAN では具体的に
```
# 良い例
PLAN implement pagination for user list with 20 items per page

# 効果が低い例
PLAN add pagination
```

### 2. 品質ゲートに EVAL を使用
マージ前に EVAL をリクエストして以下を確認:
- セキュリティの問題を検出
- アクセシビリティを検証
- テストカバレッジが基準を満たす

### 3. 複雑な機能には AUTO を活用
AUTO モードは以下に最適:
- 複数ファイルにまたがる機能
- 複数回のイテレーションが必要な機能
- 高い品質基準が求められる場合

### 4. 深いレビューにはスペシャリストを使用
集中的な分析のために特定のドメインを指定:
```
PLAN security review the payment processing module
EVAL with focus on accessibility
```

## 関連ドキュメント

- [クイックリファレンス](./plugin-quick-reference.md) - コマンドの概要
- [アーキテクチャ](./plugin-architecture.md) - 仕組み
- [トラブルシューティング](./plugin-troubleshooting.md) - よくある問題
- [FAQ](./plugin-faq.md) - よくある質問

---

<sub>🤖 このドキュメントはAIの支援を受けて翻訳されました。誤りや改善点があれば、[GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues)にてお知らせください。</sub>
