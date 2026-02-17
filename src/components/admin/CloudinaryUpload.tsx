'use client'

import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { Upload, FileCheck } from 'lucide-react';
import { useState } from 'react';

interface Props {
  onUpload: (url: string, publicId: string) => void;
  folder?: string;
  resourceType?: 'image' | 'raw';
}

export function CloudinaryUpload({ onUpload, folder = 'aaa-insurance', resourceType = 'image' }: Props) {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <CldUploadWidget 
      signatureEndpoint="/api/admin/cloudinary/signature"
      options={{
        folder,
        resourceType,
        clientAllowedFormats: resourceType === 'image' ? ['png', 'jpg', 'jpeg', 'webp'] : ['pdf'],
        maxFileSize: 10000000, // 10MB
      }}
      onSuccess={(result: any) => {
        if (result.info && typeof result.info === 'object') {
          onUpload(result.info.secure_url, result.info.public_id);
          setIsUploaded(true);
        }
      }}
    >
      {({ open }) => (
        <Button 
          type="button" 
          variant={isUploaded ? "outline" : "default"}
          onClick={() => open()}
          className="w-full"
        >
          {isUploaded ? (
            <><FileCheck className="mr-2 h-4 w-4 text-green-500" /> Uploaded Successfully</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" /> Upload {resourceType === 'image' ? 'Image' : 'PDF'}</>
          )}
        </Button>
      )}
    </CldUploadWidget>
  );
}
