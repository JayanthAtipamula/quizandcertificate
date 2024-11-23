import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      button: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      p: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      h1: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      form: DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      label: DetailedHTMLProps<HTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
      input: DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    }
  }
} 