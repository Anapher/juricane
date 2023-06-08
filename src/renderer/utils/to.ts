import { ElementType } from 'react';
import { Link } from 'react-router-dom';

export default function to(link: string, component?: ElementType) {
  return { component: component ?? Link, to: link };
}
