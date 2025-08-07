import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validateLoginForm, FormValidationErrors } from '../utils/validation';
import './Auth.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Pick<FormValidationErrors, 'email' | 'password'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 入力時にエラーをクリア
    if (errors[name as keyof typeof errors]) {
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
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      await login(formData);
      // 成功時は自動的にリダイレクトされる
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'ログインに失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">ログイン</h2>
        
        {serverError && (
          <div className="error-message">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="パスワードを入力してください"
            />
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-submit-button"
          >
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <div className="auth-switch">
          <span>アカウントをお持ちでない方は</span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="switch-button"
          >
            会員登録
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
