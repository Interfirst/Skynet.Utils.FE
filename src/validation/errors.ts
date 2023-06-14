import { normalizeNumber } from '../normalize';

export enum ValidationError {
  Email = 'Field value should be a valid email',
  PasswordDoNotMatch = 'Your password and confirmation password do not match',
  RequiredField = 'Required field should not be empty',
  Number = 'Field value should be a number',
  Integer = 'Field value should be an integer',
  Url = 'Field value should be a valid url',
  MinLength = 'Min character length is',
  MaxLength = 'Max character length is',
  AlreadyExists = 'Already exists',
  InternalNameUnique = 'The Internal Name must be unique',
  PhoneNumber = 'Field value should be a valid phone number',
  CurrencyAmount = 'Field value should be a valid amount',
  AcceptanceRequired = 'You should accept it to continue',
  MinValue = 'Field must be greater than or equal to',
  MaxValue = 'Field must be lower than or equal to',
  EqualToValue = 'Field must be equal to',
  LowerThanValue = 'Field must be lower than',
  SelectOneOption = 'Please select one',
  MustBePositive = 'Field must be positive',
  SocialSecurityNumber = 'Field value should be a valid social security',
  MinCount = 'Choose at least one',
  NewPasswordIsTheSame = 'Your new password cannot be the same as old password',
  DateFormat = 'Wrong date format',
  AtLeastOneChecked = 'At least one checkbox needs to be checked',
  ZipCode = 'Must be a valid zip code',
  Domain = 'Field value should be a valid domain',
  SpecialSymbolsNotAllowed = 'Field value should not contain special symbols',
  QueryDangerousSymbolsNotAllowed = 'Restricted symbols: $ > < = ; +',
  NumbersNotAllowed = 'Field value should not contain numbers',
  MinHomeValue = 'Home value must be at least',
  AdulthoodDate = 'You must be at least 18 years old to submit a mortgage application',
  ForbiddenSymbol = 'Field contains forbidden symbol'
}

export enum ShortValidationError {
  PhoneNumber = 'Please provide valid phone number',
  SocialSecurityNumber = 'Please provide valid SSN',
  MinValue = 'Field must not be less than',
  MaxValue = 'Field must not be greater than',
  AtLeastOneChecked = 'Please check at least one checkbox',
  SpecialSymbolsNotAllowed = 'Special symbols are not allowed',
}

export const getMinLengthError = (length: number): string =>
  `${ValidationError.MinLength} ${length}`;

export const getMaxLengthError = (length: number): string =>
  `${ValidationError.MaxLength} ${length}`;

export const getAlreadyExistsError = (entity: string): string =>
  `${entity} ${ValidationError.AlreadyExists.toLowerCase()}`;

export const getMinCountError = (entity: string): string => `${ValidationError.MinCount} ${entity}`;

export const getInputMinValueErrorText = (
  value: number,
  isCurrency: boolean = false,
  message: ValidationError | ShortValidationError = ValidationError.MinValue,
): string => {
  const normalizedValue = normalizeNumber({ value, isCurrency });

  return `${message} ${normalizedValue}`;
};

export const getInputMaxValueErrorText = (
  value: number,
  isCurrency: boolean = false,
  message: ValidationError.MaxValue | ShortValidationError.MaxValue = ValidationError.MaxValue,
): string => {
  const normalizedValue = normalizeNumber({ value, isCurrency });

  return `${message} ${normalizedValue}`;
};

export const getInputLowerThanValueErrorText = (
  value?: number,
  isCurrency: boolean = false,
): string => {
  const normalizedValue = value ? normalizeNumber({ value, isCurrency }) : value;

  return `${ValidationError.LowerThanValue} ${normalizedValue}`;
};

export const getYearMinValueErrorText = (
  value: number,
  message: ValidationError.MinValue | ShortValidationError.MinValue = ValidationError.MinValue,
): string => {
  return `${message} ${value}`;
};

export const getYearMaxValueErrorText = (
  value: number,
  message: ValidationError.MaxValue | ShortValidationError.MaxValue = ValidationError.MaxValue,
): string => {
  return `${message} ${value}`;
};
