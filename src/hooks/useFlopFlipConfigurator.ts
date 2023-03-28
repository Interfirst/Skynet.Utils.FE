import { TFlags, TMemoryAdapterInterface } from '@flopflip/types';
import { Logger } from 'logger';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type FeatureFlagsResponse = { key: string; value: boolean }[];

interface FlopFlipConfiguratorProps {
  memoryAdapter: TMemoryAdapterInterface;
  requestFunction(): Promise<FeatureFlagsResponse>;
  defaultFlags: TFlags;
  logger?: Logger;
}

const featureFlagsLocalStorageKey = 'isAllFFEnabled';

const getFeatureKeyFromLocalStorage = () => localStorage.getItem(featureFlagsLocalStorageKey);

export const useFlopFlipConfigurator = ({
  memoryAdapter,
  requestFunction,
  defaultFlags,
  logger,
}: FlopFlipConfiguratorProps) => {
  const [isToggled, setIsToggled] = useState(!!getFeatureKeyFromLocalStorage());

  const enabledFlags = useMemo(
    () =>
      Object.keys(defaultFlags).reduce((acc, flag) => {
        acc[flag] = true;

        return acc;
      }, {} as TFlags),
    [defaultFlags],
  );

  const configureAdapter = useCallback(
    (flags: TFlags) => {
      memoryAdapter.waitUntilConfigured().then(() => {
        memoryAdapter.updateFlags(flags);
      });
    },
    [memoryAdapter],
  );

  useEffect(() => {
    try {
      const fetchFlags = async () => {
        const response = await requestFunction();

        const transformedFlags = response.reduce((acc, { key, value }) => {
          acc[key] = value;

          return acc;
        }, {} as TFlags);

        configureAdapter(transformedFlags);
      };

      fetchFlags();
    } catch (err) {
      // eslint-disable-next-line no-console
      logger?.error(err) || console.error('getFeatureFlags request failed');
    }
  }, [configureAdapter, logger, requestFunction]);

  useEffect(() => {
    if (isToggled) {
      localStorage.setItem(featureFlagsLocalStorageKey, 'true');
      configureAdapter(enabledFlags);
      return;
    }

    localStorage.removeItem(featureFlagsLocalStorageKey);
    configureAdapter(defaultFlags);
  }, [configureAdapter, defaultFlags, enabledFlags, isToggled, memoryAdapter]);

  return { isToggled, setIsToggled };
};
