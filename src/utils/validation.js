const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return '请输入有效邮箱账号';
  }
}

// 确定长度
export function length(len) {
  return value => {
    if (!isEmpty(value) && value.length !== len) {
      return `长度必须是 ${len} 位`;
    }
  };
}

export function username(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[a-zA-Z0-9_\u4e00-\u9fa5@\.]+$/ui.test(value)) {
    return '只能输入中文,字母,数字,下划线,.,@和横线';
  }
}

export function required(message) {
  return value => {
    if (isEmpty(value)) {
      return message || '必填选项，请输入内容!';
    }
  };
}

export function telephone(value) {
  if (!isEmpty(value) && !/^1\d{10}$/i.test(value)) {
    return '请输入11位有效手机号码';
  }
}

export function telephoneOrMail(value) {
  if (!isEmpty(value) && !/^1\d{10}$/i.test(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return '请输入效邮箱或手机号码';
  }
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `长度至少 ${min} 位`;
    }
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `长度最多 ${max} 位`;
    }
  };
}

export function integer(value) {
  if (!Number.isInteger(Number(value))) {
    return '请输入有效数字';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return '密码不一致';
      }
    }
  };
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
