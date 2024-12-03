import type * as Rspack from '@rspack/core';
import type RspackChain from 'rspack-chain';

export type { Rspack, RspackChain };

export interface BundlerPluginInstance {
  [index: string]: any;
  apply: (compiler: any) => void;
}

export type RspackConfig = Omit<Rspack.Configuration, 'plugins'> & {
  // Use a loose type here, so that user can pass webpack plugins
  plugins: BundlerPluginInstance[];
};
