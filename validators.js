const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isPhoneNumber = (phoneNumber) => {
  const regEx = 09+[0-9];
  if(phoneNumber.match(regEx)) return true;
  else return false;
}

exports.validateSignupData = (data,confirmPassword) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== confirmPassword) errors.confirmPassword = 'Passwords must match';
  if (isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateItemData = (data) => {
  let errors = {};

  if (!isEmpty(data.name)) errors.name = 'Must not be empty';
  if (!isEmpty(data.price)) errors.price = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };

}

const isEmpty = (string) => {
  if (string === '') return true;
  else return false;
};
