// バリデーション結果の型定義
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// ニックネームのバリデーション
export const validateNickname = (nickname: string): ValidationResult => {
  if (!nickname.trim()) {
    return {
      isValid: false,
      message: 'ニックネームは必須です'
    };
  }

  if (nickname.trim().length < 1) {
    return {
      isValid: false,
      message: 'ニックネームは1文字以上で入力してください'
    };
  }

  if (nickname.trim().length > 50) {
    return {
      isValid: false,
      message: 'ニックネームは50文字以内で入力してください'
    };
  }

  return { isValid: true };
};

// メールアドレスのバリデーション
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return {
      isValid: false,
      message: 'メールアドレスは必須です'
    };
  }

  // メールアドレスの正規表現
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      message: '正しいメールアドレスの形式で入力してください'
    };
  }

  return { isValid: true };
};

// パスワードのバリデーション
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      message: 'パスワードは必須です'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'パスワードは8文字以上で入力してください'
    };
  }

  // 英数字混在チェック
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: 'パスワードは英字と数字の両方を含む必要があります'
    };
  }

  return { isValid: true };
};

// パスワード確認のバリデーション
export const validatePasswordConfirmation = (
  password: string, 
  passwordConfirmation: string
): ValidationResult => {
  if (!passwordConfirmation) {
    return {
      isValid: false,
      message: 'パスワード（確認）は必須です'
    };
  }

  if (password !== passwordConfirmation) {
    return {
      isValid: false,
      message: 'パスワードが一致しません'
    };
  }

  return { isValid: true };
};

// フォーム全体のバリデーション
export interface FormValidationErrors {
  nickname?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export const validateRegistrationForm = (data: {
  nickname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}): { isValid: boolean; errors: FormValidationErrors } => {
  const errors: FormValidationErrors = {};

  const nicknameResult = validateNickname(data.nickname);
  if (!nicknameResult.isValid) {
    errors.nickname = nicknameResult.message;
  }

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }

  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }

  const passwordConfirmationResult = validatePasswordConfirmation(
    data.password, 
    data.passwordConfirmation
  );
  if (!passwordConfirmationResult.isValid) {
    errors.passwordConfirmation = passwordConfirmationResult.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (data: {
  email: string;
  password: string;
}): { isValid: boolean; errors: Pick<FormValidationErrors, 'email' | 'password'> } => {
  const errors: Pick<FormValidationErrors, 'email' | 'password'> = {};

  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.message;
  }

  if (!data.password) {
    errors.password = 'パスワードは必須です';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
