const numberRegex = /^[0-9]+$/gim;
const guidRegex =
  /([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})/gim;
const concattedGuidRegex = /[a-f,0-9]{32}/gim;

export const getOperationName = (prefix: string) => {
  const formattedPathname = window.location.pathname
    .split('/')
    .map(i => ([numberRegex, guidRegex, concattedGuidRegex].some(re => i.match(re)) ? '{id}' : i))
    .join('/');

  if (!prefix) {
    return formattedPathname;
  }

  const formattedPrefix = prefix.toLowerCase().replaceAll(' ', '-');

  return `/${formattedPrefix}${formattedPathname}`;
};
