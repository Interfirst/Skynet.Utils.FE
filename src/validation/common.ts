import {
  array,
  boolean,
  BooleanSchema,
  date,
  DateSchema,
  NotRequiredArraySchema,
  number,
  NumberSchema,
  string,
  StringSchema,
  TestContext,
} from 'yup';

import {
  getMaxLengthError,
  getMinLengthError,
  ShortValidationError,
  ValidationError,
} from './errors';
import {
  cellPhoneNumberRegexp,
  exceptQueryDangerousSymbolsRegExp,
  exceptSpecialSymbolsRegExp,
  latinLettersNumbersSpecialCharactersRegExp,
  orEmptyRegexp,
  phoneNumberRegexp,
} from './regExps';

const emptyStringToNull = (value: any, originalValue: any): null | any => {
  if (originalValue === '') {
    return null;
  }

  return value;
};

const emptyStringToFalse = (value: any, originalValue: any): boolean | any => {
  if (originalValue === '') {
    return false;
  }

  return value;
};

export const getBooleanField = (
  { isRequired } = { isRequired: true },
): BooleanSchema<boolean | undefined> => {
  const fieldSchema = boolean().transform(emptyStringToFalse);

  if (isRequired) {
    return fieldSchema.required(ValidationError.RequiredField);
  }

  return fieldSchema.notRequired();
};

export const getIntegerField = (
  { isRequired } = { isRequired: true },
): NumberSchema<number | undefined> => {
  const fieldSchema = number()
    .integer()
    .transform(emptyStringToNull)
    .nullable(!isRequired)
    .typeError(ValidationError.Integer);

  if (isRequired) {
    return fieldSchema.required(ValidationError.RequiredField);
  }

  return fieldSchema.notRequired();
};

export const getFloatField = (
  { isRequired } = { isRequired: true },
): NumberSchema<number | undefined> => {
  const fieldSchema = number()
    .transform(emptyStringToNull)
    .nullable(!isRequired)
    .typeError(ValidationError.Number);

  if (isRequired) {
    return fieldSchema.required(ValidationError.RequiredField);
  }

  return fieldSchema.notRequired();
};

interface GetTextFieldProps {
  isRequired?: boolean;
  errorText?: string;
}
export const getTextField = (
  { isRequired, errorText = ValidationError.RequiredField }: GetTextFieldProps = {
    isRequired: true,
    errorText: ValidationError.RequiredField,
  },
): StringSchema<string | undefined> => {
  const fieldSchema = string()
    .trim()
    .matches(latinLettersNumbersSpecialCharactersRegExp, ValidationError.ForbiddenSymbol);

  if (isRequired) {
    return fieldSchema.required(errorText);
  }

  return fieldSchema.notRequired();
};

export const getDateField = (
  {
    isRequired,
    maxDate,
    maxDateValidationMessage,
    minDate,
    minDateValidationMessage,
  }: {
    isRequired: boolean;
    maxDate?: Date | string;
    maxDateValidationMessage?: string;
    minDate?: Date | string;
    minDateValidationMessage?: string;
  } = {
    isRequired: true,
  },
): DateSchema<Date | undefined> => {
  let fieldSchema = date();

  if (maxDate) {
    fieldSchema = fieldSchema.max(maxDate, maxDateValidationMessage);
  }

  if (minDate) {
    fieldSchema = fieldSchema.min(minDate, minDateValidationMessage);
  }

  if (isRequired) {
    return fieldSchema.required(ValidationError.RequiredField);
  }

  return fieldSchema.notRequired();
};

export const getTextDateField = (
  { isRequired } = { isRequired: true },
): StringSchema<string | null | undefined> => {
  const fieldSchema = string().test(
    'is-text-date',
    ValidationError.DateFormat,
    value => !isNaN(Date.parse(value!)),
  );

  if (isRequired) {
    return fieldSchema.required(ValidationError.RequiredField).nullable(true);
  }

  return fieldSchema.notRequired().nullable(true);
};

// Note that to use the this context the test function must be a function expression (function test(value) {}), not an arrow function, since arrow functions have lexical context.

export function checkNewPassword(this: TestContext<{ oldPassword: string }>, value: any): boolean {
  return value !== this.options.context?.oldPassword;
}

export function checkConfirmPassword(
  this: TestContext<{ newPassword: string }>,
  value: any,
): boolean {
  return value === this.options.context?.newPassword;
}

export const getUrlField = (
  { isRequired } = { isRequired: true },
): StringSchema<string | undefined> => {
  const fieldSchema = string().url(ValidationError.Url);

  if (isRequired) {
    return fieldSchema.required(ValidationError.RequiredField);
  }

  return fieldSchema.notRequired();
};

interface GetCellPhoneNumberFieldProps {
  isRequired?: boolean;
  excludeEmptyString?: boolean;
  message?: ValidationError.PhoneNumber | ShortValidationError.PhoneNumber;
}
export const getCellPhoneNumberField = (
  {
    isRequired = true,
    excludeEmptyString,
    message = ValidationError.PhoneNumber,
  }: GetCellPhoneNumberFieldProps = {
    isRequired: true,
    excludeEmptyString: false,
    message: ValidationError.PhoneNumber,
  },
): StringSchema<string | undefined> => {
  return getTextField({ isRequired }).matches(cellPhoneNumberRegexp, {
    excludeEmptyString,
    message,
  });
};

export const getPhoneNumberField = (
  { isRequired } = { isRequired: true },
): StringSchema<string | undefined> => {
  const phoneNumberRegexpByStatus = isRequired
    ? phoneNumberRegexp
    : new RegExp(`${phoneNumberRegexp.source}${orEmptyRegexp.source}`);
  return getTextField({ isRequired }).matches(phoneNumberRegexpByStatus, {
    message: ValidationError.PhoneNumber,
  });
};

export const getNameField = (
  {
    isRequired = true,
    minLength = 2,
    maxLength = 450,
  }: { isRequired?: boolean; minLength?: number; maxLength?: number } = {
    isRequired: true,
    minLength: 2,
    maxLength: 450,
  },
): StringSchema<string | undefined> => {
  const fieldSchema = getTextField({ isRequired }).max(maxLength, getMaxLengthError(maxLength));

  if (minLength === 1) {
    return fieldSchema;
  }

  return fieldSchema.min(minLength, getMinLengthError(minLength));
};

export const getEmailField = (
  { isRequired, emailValidationRegExp }: { isRequired: boolean; emailValidationRegExp?: RegExp } = {
    isRequired: true,
  },
): StringSchema<string | undefined> => {
  const fieldSchema = getNameField({ isRequired, minLength: isRequired ? 2 : 0, maxLength: 100 });

  if (emailValidationRegExp) {
    return fieldSchema.matches(emailValidationRegExp, {
      message: ValidationError.Email,
      excludeEmptyString: !isRequired,
    });
  }

  return fieldSchema.email(ValidationError.Email);
};

export const getRadioCardField = ({
  isRequired = true,
  nullable = false,
}: { isRequired?: boolean; nullable?: boolean } = {}): StringSchema<string | undefined | null> => {
  let fieldSchema = string();

  if (nullable && isRequired) {
    return fieldSchema.required(ValidationError.SelectOneOption).nullable();
  }
  if (isRequired) {
    return fieldSchema.required(ValidationError.SelectOneOption);
  }
  if (nullable) {
    return fieldSchema.nullable().notRequired();
  }

  return fieldSchema.notRequired();
};

interface GetCurrencyFieldProps {
  isRequired?: boolean;
  currency: RegExp;
  exception?: RegExp;
  exceptionErrorText?: string;
  emptyErrorText?: string;
}
export const getCurrencyField = (
  {
    isRequired = true,
    currency,
    exception = /.*/,
    exceptionErrorText = '',
    emptyErrorText,
  }: GetCurrencyFieldProps = {
    isRequired: true,
    exceptionErrorText: '',
    currency: /.*/,
    exception: /.*/,
  },
): StringSchema<string | undefined> => {
  return getTextField({ isRequired, errorText: emptyErrorText })
    .matches(currency, { message: ValidationError.CurrencyAmount, excludeEmptyString: !isRequired })
    .matches(exception, exceptionErrorText);
};

export const getSsnField = (
  {
    isRequired,
  }: {
    isRequired: boolean;
  } = {
    isRequired: true,
  },
): StringSchema<string | undefined> => {
  const ssnLength = 9;

  return getTextField({ isRequired }).min(ssnLength, getMinLengthError(ssnLength));
};

interface GetCheckboxGroupFieldProps {
  isRequired?: boolean;
  isLongMessage?: boolean;
}
export const getCheckboxGroupField = (
  { isRequired = true, isLongMessage = true }: GetCheckboxGroupFieldProps = {
    isRequired: true,
    isLongMessage: true,
  },
): NotRequiredArraySchema<string, object> => {
  const fieldSchema = array<string>();

  if (isRequired) {
    const message = isLongMessage
      ? ValidationError.AtLeastOneChecked
      : ShortValidationError.AtLeastOneChecked;

    return fieldSchema.min(1, message);
  }

  return fieldSchema;
};

interface GetExceptSpecialSymbolsTextFieldProps {
  isRequired?: boolean;
  isLongMessage?: boolean;
}
export const getExceptSpecialSymbolsTextField = (
  { isRequired = true, isLongMessage = true }: GetExceptSpecialSymbolsTextFieldProps = {
    isRequired: true,
    isLongMessage: true,
  },
): StringSchema<string | undefined> => {
  const message = isLongMessage
    ? ValidationError.SpecialSymbolsNotAllowed
    : ShortValidationError.SpecialSymbolsNotAllowed;

  return getTextField({ isRequired }).matches(exceptSpecialSymbolsRegExp, {
    message,
    excludeEmptyString: !isRequired,
  });
};

export const getExceptQueryDangerousSymbolsTextField = (
  {
    isRequired,
  }: {
    isRequired: boolean;
  } = {
    isRequired: true,
  },
): StringSchema<string | undefined> => {
  return getTextField({ isRequired }).matches(exceptQueryDangerousSymbolsRegExp, {
    message: ValidationError.QueryDangerousSymbolsNotAllowed,
    excludeEmptyString: !isRequired,
  });
};
