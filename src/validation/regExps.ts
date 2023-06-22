export const cellPhoneNumberRegexp = /\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

export const phoneNumberRegexp = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;

export const orEmptyRegexp = /|^$/;

export const exceptLessThanOne = /^(?!0+(\.[0-9]*)?$)/;

export const emailRegExp =
  /(^[A-Z0-9]+)((?!.*\.\.)[^<>()[\],;:=\s*@\\/]+)([A-Z0-9]+)@(([A-Z0-9]{2,}(?:([^<>()[\],;:%\\=\s@"_=/]*[A-Z0-9])?))\.[A-Z]{2,})$/;

export const domainRegExp = /^\w[\w-]{0,61}\w(?:\.[a-zA-Z]{2,})+$/;

export const exceptSpecialSymbolsRegExp = /^[a-zA-Z0-9\s]*$/;

export const exceptQueryDangerousSymbolsRegExp = /^[^($|>|<|=|;|+)]*$/;

export const latinLettersNumbersSpecialCharactersRegExp =
  /^[A-Za-z0-9\s!"#$%&'()*+,-./:;<=>?№@\\[\]^_`{|}~]*$/;
