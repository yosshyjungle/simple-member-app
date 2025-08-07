import bcrypt from 'bcryptjs';
import { User, UserRegistrationData, UserLoginData, AuthUser } from '../types/user';

// モックデータベース（ローカルストレージを使用）
class MockDatabase {
  private static USERS_KEY = 'simple_member_app_users';
  private static CURRENT_USER_KEY = 'simple_member_app_current_user';

  // ユーザー一覧を取得
  private getUsers(): User[] {
    const usersData = localStorage.getItem(MockDatabase.USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  }

  // ユーザー一覧を保存
  private saveUsers(users: User[]): void {
    localStorage.setItem(MockDatabase.USERS_KEY, JSON.stringify(users));
  }

  // 次のIDを生成
  private getNextId(): number {
    const users = this.getUsers();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  }

  // メールアドレスの重複チェック
  isEmailExists(email: string): boolean {
    const users = this.getUsers();
    return users.some(user => user.email === email);
  }

  // ユーザー登録
  async registerUser(userData: UserRegistrationData): Promise<AuthUser> {
    // メールアドレスの重複チェック
    if (this.isEmailExists(userData.email)) {
      throw new Error('このメールアドレスは既に登録されています');
    }

    // パスワードをハッシュ化
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(userData.password, saltRounds);

    // 新しいユーザーを作成
    const newUser: User = {
      id: this.getNextId(),
      nickname: userData.nickname,
      email: userData.email,
      password_hash,
      created_at: new Date(),
      updated_at: new Date()
    };

    // ユーザーを保存
    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    // 認証ユーザー情報を返す
    const authUser: AuthUser = {
      id: newUser.id,
      nickname: newUser.nickname,
      email: newUser.email
    };

    return authUser;
  }

  // ユーザーログイン
  async loginUser(loginData: UserLoginData): Promise<AuthUser> {
    const users = this.getUsers();
    const user = users.find(u => u.email === loginData.email);

    if (!user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    // パスワードの検証
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    // 認証ユーザー情報を返す
    const authUser: AuthUser = {
      id: user.id,
      nickname: user.nickname,
      email: user.email
    };

    return authUser;
  }

  // 現在のユーザーをローカルストレージに保存
  saveCurrentUser(user: AuthUser): void {
    localStorage.setItem(MockDatabase.CURRENT_USER_KEY, JSON.stringify(user));
  }

  // 現在のユーザーをローカルストレージから取得
  getCurrentUser(): AuthUser | null {
    const userData = localStorage.getItem(MockDatabase.CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // ログアウト
  logout(): void {
    localStorage.removeItem(MockDatabase.CURRENT_USER_KEY);
  }
}

export const mockDatabase = new MockDatabase();
