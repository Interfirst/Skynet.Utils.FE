import dayjs from 'dayjs';

export const downloadFileFromBlob = (blob: Blob | MediaSource, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

export const parseIntegerNumbers = (value: string) => value.replace(/[^0-9.]/g, '');

const millisecondsInMinute = 60000;

export const getDateWithoutTimezoneShift = (value: string): Date | undefined => {
  const date = dayjs(value);

  if (!date.isValid() || !value.length) {
    return;
  }

  const userTimezoneOffset = date.utcOffset() * millisecondsInMinute;

  return new Date(date.valueOf() - userTimezoneOffset);
};
