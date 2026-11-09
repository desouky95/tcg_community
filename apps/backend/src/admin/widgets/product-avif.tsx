import { useRef, useState } from 'react';
import { defineWidgetConfig } from '@medusajs/admin-sdk';
import type { DetailWidgetProps, HttpTypes } from '@medusajs/framework/types';
import { Button, Container, Text } from '@medusajs/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sdk } from '../lib/client';

const MAX_SIZE = 10 * 1024 * 1024;
const ProductAvifWidget = ({ data }: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const upload = useMutation({
    mutationFn: async (image: File) => {
      const body = new FormData(); body.append('file', image);
      return sdk.client.fetch(`/admin/products/${data.id}/avif`, { method: 'POST', body, headers: { 'content-type': null } });
    },
    onSuccess: async () => {
      setFile(null); if (inputRef.current) inputRef.current.value = '';
      setMessage('AVIF image added to product media.');
      await queryClient.invalidateQueries();
    },
    onError: (error) => setMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.'),
  });
  return <Container className="px-6 py-4">
    <Text size="small" leading="compact" weight="plus">Upload AVIF image</Text>
    <Text size="small" leading="compact" className="mt-2 text-ui-fg-subtle">Add an AVIF image to this product. Maximum size: 10 MB.</Text>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <input ref={inputRef} aria-label="Choose AVIF image" type="file" accept="image/avif,.avif" disabled={upload.isPending} onChange={(event) => {
        const selected = event.target.files?.[0]; setMessage('');
        if (selected && (selected.type !== 'image/avif' || selected.size > MAX_SIZE)) { setFile(null); setMessage('Choose an AVIF image no larger than 10 MB.'); return; }
        setFile(selected ?? null);
      }} />
      <Button size="small" disabled={!file || upload.isPending} isLoading={upload.isPending} onClick={() => file && upload.mutate(file)}>Upload image</Button>
    </div>
    {upload.isPending && <Text size="small" className="mt-2" role="status">Uploading image…</Text>}
    {message && <Text size="small" className="mt-2" role="status">{message}</Text>}
  </Container>;
};
export const config = defineWidgetConfig({ zone: 'product.details' });
export default ProductAvifWidget;
