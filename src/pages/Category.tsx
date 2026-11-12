import React from 'react';
import { useParams } from 'react-router-dom';
import { Catalog } from './Catalog';

export const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  return <Catalog initialCategorySlug={category} />;
};
