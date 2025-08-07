import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateRegistrationForm, FormValidationErrors } from '../utils/validation';
import { mockDatabase } from '../services/mockDatabase';
import './Auth.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 入力時にエラーをクリア
    if (errors[name as keyof FormValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // メールアドレスの重複チェック
    if (mockDatabase.isEmailExists(formData.email)) {
      setErrors({ email: 'このメールアドレスは既に登録されています' });
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      await register({
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password
      });
      // 成功時は自動的にログイン状態になり、認証済みユーザーとしてリダイレクトされる
    } catch (error) {
      setServerError(error instanceof Error ? error.message : '登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">会員登録</h2>
        
        {serverError && (
          <div className="error-message">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nickname" className="form-label">
              ニックネーム
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              className={`form-input ${errors.nickname ? 'error' : ''}`}
              placeholder="ニックネームを入力してください"
              maxLength={50}
            />
            {errors.nickname && (
              <div className="field-error">{errors.nickname}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="メールアドレスを入力してください"
            />
            {errors.email && (
              <div className="field-error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="8文字以上、英数字混在"
            />
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirmation" className="form-label">
              パスワード（確認）
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleInputChange}
              className={`form-input ${errors.passwordConfirmation ? 'error' : ''}`}
              placeholder="パスワードを再入力してください"
            />
            {errors.passwordConfirmation && (
              <div className="field-error">{errors.passwordConfirmation}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-submit-button"
          >
            {isSubmitting ? '登録中...' : '会員登録'}
          </button>
        </form>

        <div className="auth-switch">
          <span>既にアカウントをお持ちの方は</span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="switch-button"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
