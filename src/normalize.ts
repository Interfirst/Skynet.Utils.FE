interface NormalizeNumberProps {
  value: number;
  isCurrency?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const normalizeNumber = ({
  value,
  isCurrency = false,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
}: NormalizeNumberProps): string =>
  new Intl.NumberFormat('en-US', {
    style: isCurrency ? 'currency' : undefined,
    currency: isCurrency ? 'USD' : undefined,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
