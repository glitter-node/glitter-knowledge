import React from 'react';
import './styles/main.css';
import { initializeColorScheme } from './colorScheme';
import { HtmlContent } from './components/composite/HtmlContent';
import { DocumentContent } from './components/composite/DocumentContent';
import { KnowledgeHeader } from './components/composite/KnowledgeHeader';
import { KnowledgeCollectionNavigation } from './components/composite/KnowledgeCollectionNavigation';
import { Img } from './components/basic/Img';

initializeColorScheme();

function element<T extends keyof React.JSX.IntrinsicElements>(tag: T) {
  return React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<T>>(({ className = '', children, ...props }, ref) =>
    React.createElement(tag, { ...props, ref, className }, children));
}

export const A = element('a');
export const Article = element('article');
export const Button = element('button');
export const Div = element('div');
export const Footer = element('footer');
export const Form = element('form');
export const H1 = element('h1');
export const H2 = element('h2');
export const H3 = element('h3');
export const Header = element('header');
export const Hr = element('hr');
export const Input = element('input');
export { Img };
export const Label = element('label');
export const Li = element('li');
export const Main = element('main');
export const P = element('p');
export const Section = element('section');
export const Span = element('span');
export const Time = element('time');
export const Ul = element('ul');

const glitterKnowledge = ((window as any).GlitterKnowledge ??= {}) as Record<string, unknown>;
glitterKnowledge.version = '0.13.0';

const basicComponents = { A, Article, Button, Div, Footer, Form, H1, H2, H3, Header, Hr, Img, Input, Label, Li, Main, P, Section, Span, Time, Ul };
const compositeComponents = { HtmlContent, DocumentContent, KnowledgeHeader, KnowledgeCollectionNavigation };
const registry = (window as any).G7Core?.templateEngine?.ComponentRegistry?.getInstance?.();
if (registry) {
  Object.entries(basicComponents).forEach(([name, component]) => registry.register({ component, metadata: { name, type: 'basic' } }));
  Object.entries(compositeComponents).forEach(([name, component]) => registry.register({ component, metadata: { name, type: 'composite' } }));
}

export { basicComponents, compositeComponents, HtmlContent, DocumentContent, KnowledgeHeader, KnowledgeCollectionNavigation };
