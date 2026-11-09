import { useState } from 'react';
import { defineWidgetConfig } from '@medusajs/admin-sdk';
import type { DetailWidgetProps, HttpTypes } from '@medusajs/framework/types';
import { Button, Container, Text } from '@medusajs/ui';
import { useMutation } from '@tanstack/react-query';
import { sdk } from '../lib/client';

const ProductCmsSyncWidget = ({ data }: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  const [message, setMessage] = useState('');
  const sync = useMutation({
    mutationFn: () => sdk.client.fetch(`/admin/products/${data.id}/sync-cms`, { method: 'POST' }),
    onSuccess: () => setMessage('Product synced to CMS.'),
    onError: (error) => setMessage(error instanceof Error ? error.message : 'Sync failed. Please try again.'),
  });
  return <Container className="px-6 py-4">
    <Text size="small" leading="compact" weight="plus">CMS product sync</Text>
    <Text size="small" leading="compact" className="mt-2 text-ui-fg-subtle">Send this product and its variants to Strapi.</Text>
    <Button className="mt-4" size="small" disabled={sync.isPending} isLoading={sync.isPending} onClick={() => { setMessage(''); sync.mutate(); }}>Sync to CMS</Button>
    {sync.isPending && <Text size="small" className="mt-2" role="status">Syncing product…</Text>}
    {message && <Text size="small" className="mt-2" role={sync.isError ? 'alert' : 'status'}>{message}</Text>}
  </Container>;
};
export const config = defineWidgetConfig({ zone: 'product.details' });
export default ProductCmsSyncWidget;
