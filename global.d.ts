/// <reference types="next" />
/// <reference types="next/image-types/global" />
import tree from '@yyds-lib/airui/package/wc/tree-wc'
// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;
type CustomElement<T, K extends string> = Partial<T & DOMAttributes<T> & { children: any } & CustomEvents<`style`>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['tree-wc']: CustomElement<tree, 'style'>;
    }
  }
}