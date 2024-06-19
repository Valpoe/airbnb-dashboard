import { cache } from 'react';

export const getLicense = cache(async () => {
  const response = await fetch('/api/license');
  const data = await response.json();
  return data.license;
});
